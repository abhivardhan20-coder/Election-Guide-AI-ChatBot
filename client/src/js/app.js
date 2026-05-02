import { db, auth } from '../../firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from 'firebase/auth';
import { callGeminiAPI } from './api.js';
import { 
  UI_STRINGS, translateUI, appendMessage, appendChips, 
  showTyping, hideTyping, lockUI, autoResize, generateContextChips 
} from './ui.js';
import { syncProfileToFirebase, signOut, initStorage } from './auth.js';

let lang = 'en';
let historyLog = [];
let isBusy = false;

async function sendText(text) {
  if (isBusy) return;
  appendMessage('user', text);
  lockUI(true, document.getElementById('sendBtn'));
  showTyping();
  try {
    const reply = await callGeminiAPI(text, historyLog, auth, localStorage);
    hideTyping();
    appendMessage('ai', marked.parse(reply));
    appendChips(generateContextChips(reply), isBusy, sendText);
  } catch(e) { 
    hideTyping(); 
    if (e.message.includes("Unauthorized")) {
      appendMessage('ai', `⚠️ Your session expired. Please refresh the page.`);
    } else {
      appendMessage('ai', `⚠️ Error: ${e.message}`);
    }
  }
  lockUI(false, document.getElementById('sendBtn'));
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
  if (isBusy) return;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  if (navEl) navEl.classList.add('active');
  const MODES = {
    home: { prompt: "Explain how you can help." },
    action: { prompt: "List 5 election prep actions." },
    journey: { prompt: "Explain the election process journey step by step." },
    timeline: { prompt: "Show the election timeline." },
    voter: { prompt: "Explain voter registration steps." },
    booth: { prompt: "How to find polling booth?" },
    eli5: { prompt: "Explain elections simply for a child." },
    scenario: { prompt: "Explain hung parliament scenario." },
    faq: { prompt: "Answer top 3 election FAQs." },
    glossary: { prompt: "Define EVM, VVPAT, MCC." },
    live: { prompt: "How to follow live updates?" }
  };
  appendMessage('user', MODES[mode].prompt);
  lockUI(true, document.getElementById('sendBtn')); showTyping();
  try {
    const reply = await callGeminiAPI(MODES[mode].prompt, historyLog, auth, localStorage);
    hideTyping();
    appendMessage('ai', marked.parse(reply));
    appendChips(generateContextChips(reply), isBusy, sendText);
  } catch(e) { hideTyping(); appendMessage('ai', `⚠️ Error: ${e.message}`); }
  lockUI(false, document.getElementById('sendBtn'));
}

function setLang(l, btn) {
  lang = l;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  translateUI(l, UI_STRINGS);
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

const initApp = async () => {
  const email = localStorage.getItem('google_user_email');
  if (!email) { window.location.href = '/'; return; }
  
  initStorage(localStorage);
  translateUI('en', UI_STRINGS);

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (localStorage.getItem('is_guest')) return;
      const localAge = localStorage.getItem('user_age');
      const modal = document.getElementById('onboardingModal');
      if (!localAge) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
      }
      try {
        const snap = await getDoc(doc(db, "users", user.email));
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
      const idToken = localStorage.getItem('google_id_token');
      if (idToken && !localStorage.getItem('is_guest')) {
        try {
          const credential = GoogleAuthProvider.credential(idToken);
          await signInWithCredential(auth, credential);
        } catch(e) { console.error("Firebase Auth failed:", e); }
      } else if (!localStorage.getItem('is_guest')) {
        window.location.href = '/';
      }
    }
  });

  // Event Listeners
  document.getElementById('sendBtn').addEventListener('click', sendMsg);
  document.getElementById('userInput').addEventListener('input', (e) => autoResize(e.target));
  document.getElementById('userInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
  });
  document.getElementById('ui-signout').addEventListener('click', () => signOut(localStorage));
  document.getElementById('ui-save-profile').addEventListener('click', (e) => saveProfile(e.target));
  document.getElementById('ui-modal-save').addEventListener('click', async () => {
     const age = document.getElementById('onboardingAge').value;
     const loc = document.getElementById('onboardingLocation').value;
     const status = document.getElementById('onboardingStatus').value;
     if(!age || !loc || !status) return alert("Please fill all fields");
     document.getElementById('userAge').value = age;
     document.getElementById('userLocation').value = loc;
     document.getElementById('userStatus').value = status;
     localStorage.setItem('user_age', age);
     localStorage.setItem('user_location', loc);
     localStorage.setItem('user_status', status);
     const modal = document.getElementById('onboardingModal');
     modal.classList.remove('active');
     setTimeout(() => { modal.style.display = 'none'; }, 300);
     syncProfileToFirebase(db, localStorage).catch(e => console.error(e));
     initStorage(localStorage);
  });

  document.querySelectorAll('.nav-item').forEach(el => {
    const mode = el.getAttribute('data-mode');
    if (mode) el.addEventListener('click', () => { if(mode==='home') location.reload(); else loadMode(mode, el); });
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    const code = btn.getAttribute('data-lang');
    if (code) btn.addEventListener('click', () => setLang(code, btn));
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
