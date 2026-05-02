export const UI_STRINGS = {
  en: {
    subtitle: "India's Interactive Election Assistant",
    profileTitle: "My Profile (Optional)",
    labelAge: "Age",
    labelLoc: "Location",
    labelStatus: "Voting Status",
    saveProfile: "Save Profile",
    navHome: "🏠 Home",
    navJourney: "📅 Election Journey",
    navTimeline: "⏱️ Timeline",
    navVoter: "🧾 Voter Registration",
    navAction: "✅ What Should I Do?",
    navBooth: "📍 Polling Booth",
    navEli5: "🧒 Explain Simply",
    navScenario: "💡 Scenarios",
    navFaq: "❓ FAQ",
    navGlossary: "📖 Glossary",
    navLive: "📡 Live Updates",
    welcomeTitle: "Your Guide to Democracy",
    welcomeText: "I simplify the Indian election process into guided, interactive steps. Set up your profile or select a topic to get started.",
    inputPlaceholder: "Ask a question about the elections...",
    modalTitle: "Complete Your Profile",
    modalDesc: "Let's customize your election guide.",
    modalBtn: "Save & Continue"
  },
  hi: {
    subtitle: "भारत का संवादात्मक चुनाव सहायक",
    profileTitle: "मेरा प्रोफाइल (वैकल्पिक)",
    labelAge: "आयु",
    labelLoc: "स्थान",
    labelStatus: "मतदान की स्थिति",
    saveProfile: "प्रोफ़ाइल सहेजें",
    navHome: "🏠 होम",
    navJourney: "📅 चुनाव यात्रा",
    navTimeline: "⏱️ समयरेखा",
    navVoter: "🧾 मतदाता पंजीकरण",
    navAction: "✅ मुझे क्या करना चाहिए?",
    navBooth: "📍 मतदान केंद्र",
    navEli5: "🧒 सरलता से समझाएं",
    navScenario: "💡 परिदृश्य",
    navFaq: "❓ सामान्य प्रश्न",
    navGlossary: "📖 शब्दावली",
    navLive: "📡 लाइव अपडेट",
    welcomeTitle: "लोकतंत्र के लिए आपका मार्गदर्शक",
    welcomeText: "मैं भारतीय चुनाव प्रक्रिया को निर्देशित, संवादात्मक चरणों में सरल बनाता हूं। शुरू करने के लिए अपना प्रोफ़ाइल सेट करें या कोई विषय चुनें।",
    inputPlaceholder: "चुनाव के बारे में एक प्रश्न पूछें...",
    modalTitle: "अपनी प्रोफाइल पूरी करें",
    modalDesc: "आइए आपके चुनाव मार्गदर्शक को अनुकूलित करें।",
    modalBtn: "सहेजें और जारी रखें"
  }
};

export function translateUI(l, strings) {
  const s = strings[l] || strings['en'];
  document.documentElement.setAttribute('lang', l);
  
  const mapping = {
    'ui-subtitle': s.subtitle,
    'ui-profile-title': s.profileTitle,
    'ui-label-age': s.labelAge,
    'ui-label-loc': s.labelLoc,
    'ui-label-status': s.labelStatus,
    'ui-save-profile': s.saveProfile,
    'ui-nav-home': s.navHome,
    'ui-nav-journey': s.navJourney,
    'ui-nav-timeline': s.navTimeline,
    'ui-nav-voter': s.navVoter,
    'ui-nav-action': s.navAction,
    'ui-nav-booth': s.navBooth,
    'ui-nav-eli5': s.navEli5,
    'ui-nav-scenario': s.navScenario,
    'ui-nav-faq': s.navFaq,
    'ui-nav-glossary': s.navGlossary,
    'ui-nav-live': s.navLive,
    'ui-welcome-title': s.welcomeTitle,
    'ui-welcome-text': s.welcomeText,
    'ui-modal-title': s.modalTitle,
    'ui-modal-desc': s.modalDesc,
    'ui-modal-save': s.modalBtn
  };

  Object.keys(mapping).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (el.tagName === 'INPUT') el.placeholder = mapping[id];
      else el.textContent = mapping[id];
    }
  });
  
  document.getElementById('userInput').placeholder = s.inputPlaceholder;
}

export function appendMessage(role, content) {
  const chat = document.getElementById('chat');
  const banner = document.getElementById('welcome-banner');
  if (banner) banner.style.display = 'none';

  const row = document.createElement('div');
  row.className = `msg-row ${role}`;
  
  const avatar = document.createElement('div');
  avatar.className = `avatar ${role}`;
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = role === 'ai' ? '🗳️' : '👤';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = content;

  row.appendChild(avatar);
  row.appendChild(bubble);
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}

export function showTyping() {
  const chat = document.getElementById('chat');
  const row = document.createElement('div');
  row.className = 'msg-row ai';
  row.id = 'typing-indicator';
  row.setAttribute('role', 'status');
  row.setAttribute('aria-label', 'AI is typing');
  row.innerHTML = `
    <div class="avatar ai" aria-hidden="true">🗳️</div>
    <div class="bubble">
      <div class="typing-indicator" aria-hidden="true">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>`;
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}

export function hideTyping() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) indicator.remove();
}

export function appendChips(chips, isBusy, sendText) {
  const chat = document.getElementById('chat');
  const container = document.createElement('div');
  container.className = 'chips-container';
  
  chips.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.textContent = c;
    btn.setAttribute('aria-label', `Ask: ${c}`);
    btn.onclick = () => { if (!isBusy) sendText(c); };
    container.appendChild(btn);
  });
  
  chat.appendChild(container);
  chat.scrollTop = chat.scrollHeight;
}

export function lockUI(isBusy, sendBtn) {
  sendBtn.disabled = isBusy;
  sendBtn.style.opacity = isBusy ? '0.5' : '1';
  sendBtn.style.cursor = isBusy ? 'not-allowed' : 'pointer';
}

export function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

export function generateContextChips(reply) {
  const chips = [];
  if (/register|registration/i.test(reply)) chips.push("How do I register to vote?");
  if (/booth|polling/i.test(reply))         chips.push("Find my polling booth");
  if (/EVM|VVPAT/i.test(reply))             chips.push("Explain EVM and VVPAT");
  if (/hung parliament/i.test(reply))        chips.push("What happens in a hung parliament?");
  chips.push("Tell me more", "What's the next step?");
  return chips.slice(0, 4);
}
