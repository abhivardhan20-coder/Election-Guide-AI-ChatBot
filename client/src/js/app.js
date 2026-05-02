import { db, auth, analytics } from '../../firebase.js';
import { logEvent, setUserId } from "firebase/analytics";
import { doc, getDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from 'firebase/auth';
import { callGeminiAPI } from './api.js';
import { 
  UI_STRINGS, translateUI, appendMessage, appendChips, 
  showTyping, hideTyping, lockUI, autoResize
} from './ui.js';
import { syncProfileToFirebase, signOut, initStorage } from './auth.js';
import { state } from './state.js';

// Configure DOMPurify to ensure external AI-generated links open safely in a new tab
DOMPurify.addHook('afterSanitizeAttributes', function(node) {
  if (node.tagName === 'A') {
    const href = node.getAttribute('href') || '';
    // Only apply blank targets to external links to preserve internal routing integrity
    if (href.startsWith('http')) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  }
});

let elementBeforeModal = null; // Store focus state for accessibility

const MODES = {
  home: { prompt: "Explain how you can help." },
  action: { prompt: "List 5 election prep actions." },
  journey: { prompt: "Explain the election process journey step by step." },
  timeline: { prompt: "Show the election timeline." },
  voter: { prompt: "Explain voter registration steps." },
  booth: { prompt: "Find my polling booth" },
  eli5: { prompt: "Explain elections simply for a child." },
  scenario: { prompt: "Explain hung parliament scenario." },
  faq: { prompt: "Answer top 3 election FAQs." },
  glossary: { prompt: "Define EVM, VVPAT, MCC." },
  live: { prompt: "How to follow live updates?" }
};

// DRY helper function for AI response rendering with batched layout reflows
function renderAIResponse(data) {
  hideTyping();
  
  // Strictly enforce a string fallback to prevent marked() from throwing a fatal object type error
  const cleanHTML = DOMPurify.sanitize(marked.parse(data.reply || ''), { ADD_ATTR: ['target'] });
  
  appendMessage('ai', cleanHTML);
  const chips = data.suggestedQuestions || [];
  if (chips.length > 0) {
    appendChips(chips, state.isBusy, sendText);
  }

  // Trigger a single layout reflow/scroll after all elements are appended
  const chat = document.getElementById('chat');
  requestAnimationFrame(() => {
    chat.scrollTop = chat.scrollHeight;
  });
}

async function sendText(text) {
  if (state.isBusy) return;
  logEvent(analytics, 'message_sent', { char_count: text.length, is_guest: state.user.isGuest });
  appendMessage('user', text);
  state.setBusy(true);
  showTyping();
  try {
    const data = await callGeminiAPI(text, state.historyLog, auth, state.user.isGuest);
    renderAIResponse(data);
  } catch(e) { 
    hideTyping(); 
    if (e.message.includes("Unauthorized")) {
      appendMessage('ai', `⚠️ Your session expired. Please refresh the page.`);
    } else {
      appendMessage('ai', `⚠️ Error: ${e.message}`);
    }
  }
  state.setBusy(false);
}

function sendMsg() {
  const input = document.getElementById('userInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  autoResize(input);
  sendText(text);
}

async function loadMode(mode, navEl) {
  if (state.isBusy) return;
  logEvent(analytics, 'mode_selected', { mode, lang: state.lang });
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  if (navEl) navEl.classList.add('active');

  const chat = document.getElementById('chat');
  if (chat) chat.focus(); // Shift screen reader context to the newly updated area

  if (mode === 'booth') {
    appendMessage('user', MODES.booth.prompt);
    let loc = localStorage.getItem('user_location') || '';
    
    // Validate location specificity before making an external API call
    if (loc.trim().length < 3 || loc.toLowerCase() === 'india') {
      appendMessage('ai', 'To find your nearest polling booth, I need a more specific location. Please update your city or district in your Profile.');
      document.getElementById('userLocation').focus();
      return;
    }

    const safeLoc = DOMPurify.sanitize(loc);
    const mapsQuery = encodeURIComponent(`election polling booth in ${safeLoc}, India`);
    const embedUrl = `https://www.google.com/maps/embed/v1/search?key=${import.meta.env.VITE_MAPS_API_KEY}&q=${mapsQuery}`;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'msg-row ai';
    
    // Create the booth elements programmatically to prevent layout thrashing and double-loading
    const avatar = document.createElement('div');
    avatar.className = 'avatar ai';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = '🗳️';
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble bubble--booth';
    
    const intro = document.createElement('p');
    intro.className = 'booth-intro';
    intro.innerHTML = `Here are polling locations near <strong>${safeLoc}</strong>:`;
    
    const iframe = document.createElement('iframe');
    iframe.title = `Polling booths near ${safeLoc}`;
    iframe.className = 'booth-map';
    iframe.width = '100%';
    iframe.height = '300';
    iframe.loading = 'lazy';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.src = embedUrl;
    
    bubble.appendChild(intro);
    bubble.appendChild(iframe);
    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    
    chat.appendChild(wrapper);
    requestAnimationFrame(() => { chat.scrollTop = chat.scrollHeight; });
    return;
  }

  appendMessage('user', MODES[mode].prompt);
  state.setBusy(true); 
  showTyping();
  try {
    const data = await callGeminiAPI(MODES[mode].prompt, state.historyLog, auth, state.user.isGuest);
    renderAIResponse(data);
  } catch(e) { 
    hideTyping(); 
    if (e.message.includes("Unauthorized")) {
      appendMessage('ai', `⚠️ Your session expired. Please refresh the page.`);
    } else {
      appendMessage('ai', `⚠️ Error: ${e.message}`);
    }
  }
  state.setBusy(false);
}

function setLang(l) {
  state.setLang(l);
}

async function saveProfile(btn) {
  localStorage.setItem('user_age', document.getElementById('userAge').value);
  localStorage.setItem('user_location', document.getElementById('userLocation').value);
  localStorage.setItem('user_status', document.getElementById('userStatus').value);
  await syncProfileToFirebase(db, localStorage);
  btn.textContent = 'Saved!';
  btn.classList.add('saved');
  setTimeout(() => { btn.textContent = 'Save Profile'; btn.classList.remove('saved'); }, 2000);
}

function setupFocusTrap(modalId) {
  const modal = document.getElementById(modalId);
  const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusableElements.length === 0) return;
  
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  modal.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) { 
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus(); e.preventDefault();
        }
      } else { 
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus(); e.preventDefault();
        }
      }
    }
    if (e.key === 'Escape') {
      closeModal(modalId, elementBeforeModal);
    }
  });
}

function closeModal(modalId, triggerEl = null) {
  const modal = document.getElementById(modalId);
  const fallbackEl = document.querySelector('[data-mode="home"]');
  modal.classList.remove('active');
  setTimeout(() => {
    modal.style.display = 'none';
    if (triggerEl) triggerEl.focus();
    else if (fallbackEl) fallbackEl.focus();
  }, 300);
}

const initApp = async () => {
  const email = state.user.email;
  if (!email) { window.location.href = '/'; return; }
  
  initStorage(localStorage);
  
  const sendBtn = document.getElementById('sendBtn');
  const langBtns = [...document.querySelectorAll('.lang-btn')];
  const userInput = document.getElementById('userInput');
  const modal = document.getElementById('onboardingModal');

  // Set up the focus trap ONCE during initialization to avoid memory leaks
  setupFocusTrap('onboardingModal');

  state.subscribe((s) => {
    translateUI(s.lang, UI_STRINGS);
    lockUI(s.isBusy, sendBtn);
    langBtns.forEach(b => {
      const isActive = b.getAttribute('data-lang') === s.lang;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-pressed', isActive.toString());
    });
  });
  
  state.notify();

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (state.user.isGuest) return;
      
      // Associate analytics events with this authenticated user
      setUserId(analytics, user.uid);
      
      const localAge = localStorage.getItem('user_age');
      if (!localAge) {
        modal.style.display = 'flex';
        elementBeforeModal = document.activeElement; // Capture focus
        // Listener is already attached, just trigger visibility and focus
        setTimeout(() => { modal.classList.add('active'); document.getElementById('onboardingAge').focus(); }, 10);
      }
      try {
        // Fetch the profile using the immutable UID instead of email
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const d = snap.data();
          if (d.age) {
            modal.classList.remove('active');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
            document.getElementById('userAge').value = d.age || '';
            document.getElementById('userLocation').value = d.location || '';
            document.getElementById('userStatus').value = d.status || '';
            initStorage(localStorage);
          }
        }
      } catch(e) { console.error("Firestore Error:", e); }
    } else {
      const isGuest = localStorage.getItem('is_guest') === 'true';
      if (!isGuest) {
        window.location.href = '/';
      }
    }
  });

  sendBtn.addEventListener('click', sendMsg);
  userInput.addEventListener('input', (e) => autoResize(e.target));
  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
    if (e.ctrlKey && e.key === 'l') { 
      const langs = ['en', 'hi', 'ta', 'te', 'ml', 'kn'];
      const nextIdx = (langs.indexOf(state.lang) + 1) % langs.length;
      state.setLang(langs[nextIdx]);
    }
  });
  
  document.getElementById('ui-signout').addEventListener('click', () => signOut(localStorage));
  document.getElementById('ui-save-profile').addEventListener('click', (e) => saveProfile(e.target));
  document.getElementById('ui-modal-save').addEventListener('click', async () => {
     const age = document.getElementById('onboardingAge').value;
     const loc = document.getElementById('onboardingLocation').value;
     const status = document.getElementById('onboardingStatus').value;
     let errorMsg = document.getElementById('modal-error');

     if(!age || !loc || !status) {
       if (!errorMsg) {
         errorMsg = document.createElement('p');
         errorMsg.id = 'modal-error';
         errorMsg.setAttribute('role', 'alert');
         errorMsg.setAttribute('tabindex', '-1'); // Make focusable for screen readers
         errorMsg.style.color = '#ef4444';
         errorMsg.style.fontSize = '13px';
         errorMsg.style.marginBottom = '12px';
         errorMsg.style.outline = 'none';
         const btn = document.getElementById('ui-modal-save');
         btn.parentNode.insertBefore(errorMsg, btn);
       }
       errorMsg.textContent = "Please fill out all fields to continue.";
       
       // Accessibility focus shift to notify the user of the error
       errorMsg.focus();
       
       // Highlight the first empty field visually to guide the user
       if (!age) document.getElementById('onboardingAge').focus();
       else if (!loc) document.getElementById('onboardingLocation').focus();
       else document.getElementById('onboardingStatus').focus();
       
       return;
     }

     if (errorMsg) errorMsg.remove();

     document.getElementById('userAge').value = age;
     document.getElementById('userLocation').value = loc;
     document.getElementById('userStatus').value = status;
     localStorage.setItem('user_age', age);
     localStorage.setItem('user_location', loc);
     localStorage.setItem('user_status', status);
     closeModal('onboardingModal', elementBeforeModal);
     syncProfileToFirebase(db, localStorage).catch(e => console.error(e));
     initStorage(localStorage);
  });

  document.querySelectorAll('.nav-item').forEach(el => {
    const mode = el.getAttribute('data-mode');
    if (mode) el.addEventListener('click', () => { if(mode==='home') location.reload(); else loadMode(mode, el); });
  });

  langBtns.forEach(btn => {
    const code = btn.getAttribute('data-lang');
    if (code) btn.addEventListener('click', () => setLang(code));
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

if ('serviceWorker' in navigator) {
  const registerSW = () => {
    navigator.serviceWorker.register('/sw.js').catch(err => console.error('SW Reg failed:', err));
  };
  
  // Account for deferred <script type="module"> execution to ensure SW registers reliably
  if (document.readyState === 'complete') {
    registerSW();
  } else {
    window.addEventListener('load', registerSW);
  }
}
