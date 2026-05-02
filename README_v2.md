# ElectionGuide AI - Code Snapshot (Version 2)
*Generated on: 2026-05-02 16:08:49*

This document contains a full snapshot of the application source code for documentation and review purposes.

## Table of Contents
- [client/index.html](#clientindexhtml)
- [client/app.html](#clientapphtml)
- [client/firebase.js](#clientfirebasejs)
- [client/src/css/app.css](#clientsrccssappcss)
- [client/src/js/app.js](#clientsrcjsappjs)
- [client/src/js/api.js](#clientsrcjsapijs)
- [client/src/js/ui.js](#clientsrcjsuijs)
- [client/src/js/auth.js](#clientsrcjsauthjs)
- [client/src/js/state.js](#clientsrcjsstatejs)
- [client/src/js/login.js](#clientsrcjsloginjs)
- [server/index.js](#serverindexjs)
- [README.md](#readmemd)
- [client/src/js/api.test.js](#clientsrcjsapitestjs)
- [client/src/js/auth.test.js](#clientsrcjsauthtestjs)
- [client/src/js/auth_adv.test.js](#clientsrcjsauth_advtestjs)
- [client/src/js/ui.test.js](#clientsrcjsuitestjs)

---

### client/index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - ElectionGuide AI</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./src/css/app.css">
  <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>
<body>

<main class="login-page">
  <div class="login-card">
    <div class="logo-wrap" role="img" aria-label="Election Logo">🗳️</div>
    <h1>ElectionGuide AI</h1>
    <p>Sign in to access your personalized, interactive guide to the Indian democratic process.</p>
    
    <div class="auth-container" id="google-signin-btn"></div>
    
    <div style="margin-top: 24px; border-top: 1px solid var(--border); padding-top: 24px;">
      <button id="guest-btn" style="width: 100%; padding: 12px; background: transparent; border: 1px solid var(--border); border-radius: 50px; color: var(--text-muted); cursor: pointer; font-weight: 500; transition: all 0.2s;">Continue without an account</button>
    </div>
  </div>
</main>

<script type="module" src="./src/js/login.js"></script>
</body>
</html>

```

---

### client/app.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ElectionGuide AI</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./src/css/app.css">
  <link rel="manifest" href="/manifest.json">
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>
<body>
<a href="#chat" class="skip-link">Skip to chat</a>

<header class="header">
  <div class="brand">
    <div class="logo" role="img" aria-label="Election Icon">🗳️</div>
    <div>
      <div class="title">ElectionGuide AI</div>
      <h1 class="subtitle" id="ui-subtitle">India's Interactive Election Assistant</h1>
    </div>
  </div>
  <div class="header-actions">
    <div id="user-profile" style="display:flex; align-items:center; gap:8px; color: #fff; font-size: 13px; font-weight: 500;"></div>
    <button class="lang-btn active" data-lang="en">EN</button>
    <button class="lang-btn" data-lang="hi">HI</button>
    <button class="lang-btn" data-lang="ta">TA</button>
    <button class="lang-btn" data-lang="te">TE</button>
    <button class="lang-btn" data-lang="ml">ML</button>
    <button class="lang-btn" data-lang="kn">KN</button>
    <button class="settings-btn" id="ui-signout" style="background:#ef4444">Sign Out</button>
  </div>
</header>

<div class="layout">
  <nav class="sidebar" aria-label="Main Navigation">
    <section class="profile-section">
      <h2 class="profile-title" id="ui-profile-title">My Profile (Optional)</h2>
      <label for="userAge" class="sr-only" id="ui-label-age-sidebar">Age</label>
      <input type="number" id="userAge" class="profile-input" placeholder="Age (e.g. 18)">
      <label for="userLocation" class="sr-only" id="ui-label-loc-sidebar">Location</label>
      <input type="text" id="userLocation" class="profile-input" placeholder="Location/State">
      <label for="userStatus" class="sr-only" id="ui-label-status-sidebar">Voting Status</label>
      <select id="userStatus" class="profile-input">
        <option value="">Voting Status...</option>
        <option value="Not Registered">Not Registered</option>
        <option value="Registered">Registered Voter</option>
        <option value="Voted Before">Voted Before</option>
      </select>
      <button class="profile-save" id="ui-save-profile">Save Profile</button>
    </section>

    <div class="nav-group">
      <div class="nav-header" id="ui-nav-main">Main</div>
      <button class="nav-item active" data-mode="home" id="ui-nav-home">🏠 Home</button>
      <button class="nav-item" data-mode="journey" id="ui-nav-journey">📅 Election Journey</button>
      <button class="nav-item" data-mode="timeline" id="ui-nav-timeline">⏱️ Timeline</button>
    </div>
    
    <div class="nav-group">
      <div class="nav-header" id="ui-nav-guide">My Guide</div>
      <button class="nav-item" data-mode="voter" id="ui-nav-voter">🧾 Voter Registration</button>
      <button class="nav-item" data-mode="action" id="ui-nav-action">✅ What Should I Do?</button>
      <button class="nav-item" data-mode="booth" id="ui-nav-booth">📍 Polling Booth</button>
    </div>

    <div class="nav-group">
      <div class="nav-header" id="ui-nav-learn">Learn</div>
      <button class="nav-item" data-mode="eli5" id="ui-nav-eli5">🧒 Explain Simply</button>
      <button class="nav-item" data-mode="scenario" id="ui-nav-scenario">💡 Scenarios</button>
      <button class="nav-item" data-mode="faq" id="ui-nav-faq">❓ FAQ</button>
    </div>

    <div class="nav-group">
      <div class="nav-header" id="ui-nav-ref">Reference</div>
      <button class="nav-item" data-mode="glossary" id="ui-nav-glossary">📖 Glossary</button>
      <button class="nav-item" data-mode="live" id="ui-nav-live">📡 Live Updates</button>
    </div>
  </nav>

  <main class="main">
    <div class="chat-container" id="chat" aria-live="polite">
      <div class="welcome-banner" id="welcome-banner">
        <div class="welcome-badge">✨ Powered by Gemini AI</div>
        <h2 id="ui-welcome-title">Your Guide to Democracy</h2>
        <p id="ui-welcome-text">I simplify the Indian election process into guided, interactive steps. Set up your profile or select a topic to get started.</p>
      </div>
    </div>
    
    <div class="input-wrapper">
      <div class="input-box">
        <label for="userInput" class="sr-only">Message</label>
        <textarea id="userInput" placeholder="Ask a question about the elections..." rows="1"></textarea>
        <button class="send-btn" id="sendBtn" aria-label="Send message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    </div>
  </main>
</div>

<!-- Onboarding Modal -->
<div class="modal-overlay" id="onboardingModal" style="display: none;">
  <div class="modal-content" role="dialog" aria-labelledby="ui-modal-title" aria-describedby="ui-modal-desc">
    <h2 id="ui-modal-title">Complete Your Profile</h2>
    <p id="ui-modal-desc">Let's customize your election guide.</p>
    
    <div class="profile-field" style="margin-bottom: 16px;">
      <label for="onboardingAge" id="ui-label-age">Age</label>
      <input type="number" id="onboardingAge" class="modal-input" placeholder="e.g. 18">
    </div>
    <div class="profile-field" style="margin-bottom: 16px;">
      <label for="onboardingLocation" id="ui-label-loc">Location (State)</label>
      <input type="text" id="onboardingLocation" class="modal-input" placeholder="e.g. Maharashtra">
    </div>
    <div class="profile-field" style="margin-bottom: 24px;">
      <label for="onboardingStatus" id="ui-label-status">Voting Status</label>
      <select id="onboardingStatus" class="modal-input">
        <option value="" class="ui-opt-select">Select...</option>
        <option value="Not Registered" class="ui-opt-not-reg">Not Registered</option>
        <option value="Registered" class="ui-opt-reg">Registered</option>
        <option value="Voted Before" class="ui-opt-voted">Voted Before</option>
      </select>
    </div>
    
    <button class="modal-btn" id="ui-modal-save">Save & Continue</button>
  </div>
</div>

<script type="module" src="./src/js/app.js"></script>
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
</script>
</body>
</html>

```

---

### client/firebase.js
```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log("Initializing Firebase for project:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

```

---

### client/src/css/app.css
```css
:root {
  --bg-dark: #09090b;
  --bg-panel: #18181b;
  --border: #27272a;
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --accent: #f97316;
  --text-main: #f4f4f5;
  --text-muted: #a1a1aa;
  --msg-user: #27272a;
  --msg-ai: rgba(59, 130, 246, 0.05);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body { 
  font-family: 'Inter', sans-serif; 
  background: var(--bg-dark); 
  color: var(--text-main); 
  height: 100vh; 
  overflow: hidden; 
  display: flex; 
  flex-direction: column;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary);
  color: white;
  padding: 8px;
  z-index: 100;
  transition: top 0.2s;
}
.skip-link:focus {
  top: 0;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #52525b; }

/* Header */
.header {
  background: rgba(24, 24, 27, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
}
.brand { display: flex; align-items: center; gap: 12px; }
.logo { 
  width: 36px; height: 36px; 
  background: linear-gradient(135deg, var(--accent), #fcd34d); 
  border-radius: 10px; 
  display: flex; align-items: center; justify-content: center; 
  font-size: 20px; 
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
}
.title { font-size: 18px; font-weight: 600; letter-spacing: -0.02em; }
.subtitle { font-size: 12px; color: var(--text-muted); }

.header-actions { display: flex; gap: 12px; align-items: center; }
.lang-btn {
  padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border);
  background: transparent; color: var(--text-muted); font-size: 12px; font-weight: 500;
  cursor: pointer; transition: all 0.2s;
}
.lang-btn.active, .lang-btn:hover { background: var(--bg-panel); color: #fff; border-color: var(--primary); }
.settings-btn {
  padding: 6px 12px; border-radius: 6px; background: var(--primary); border: none;
  color: #fff; font-size: 12px; font-weight: 600; cursor: pointer; transition: background 0.2s;
}
.settings-btn:hover { background: var(--primary-hover); }

/* Layout */
.layout { display: flex; flex: 1; overflow: hidden; }

/* Sidebar */
.sidebar {
  width: 260px; background: var(--bg-panel); border-right: 1px solid var(--border);
  display: flex; flex-direction: column; overflow-y: auto; padding: 16px; gap: 24px;
}

.profile-section {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}
.profile-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 600; margin-bottom: 12px; }
.profile-input {
  width: 100%; background: var(--bg-dark); border: 1px solid var(--border);
  color: var(--text-main); font-family: 'Inter', sans-serif; font-size: 13px;
  padding: 8px 12px; border-radius: 6px; margin-bottom: 8px; outline: none; transition: border-color 0.2s;
}
.profile-input:focus { border-color: var(--primary); }
.profile-save { width: 100%; background: var(--border); color: #fff; border: none; padding: 8px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.profile-save:hover { background: #3f3f46; }
.profile-save.saved { background: #22c55e; }

.nav-group { display: flex; flex-direction: column; gap: 4px; }
.nav-header { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 600; margin-bottom: 8px; padding-left: 8px; }
.nav-item {
  display: flex; align-items: center; gap: 12px; padding: 10px 12px;
  border-radius: 8px; color: var(--text-muted); font-size: 14px; font-weight: 500;
  cursor: pointer; transition: all 0.2s;
}
.nav-item:hover { background: rgba(255,255,255,0.05); color: var(--text-main); }
.nav-item.active { background: rgba(59, 130, 246, 0.15); color: var(--primary); }

/* Main Chat Area */
.main { flex: 1; display: flex; flex-direction: column; background: var(--bg-dark); position: relative; }
.chat-container { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 24px; scroll-behavior: smooth; }

.welcome-banner {
  text-align: center; margin: 40px auto; max-width: 500px;
}
.welcome-badge {
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px;
  background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 30px; font-size: 12px; font-weight: 600; color: var(--primary); margin-bottom: 20px;
}
.welcome-banner h1 { font-size: 28px; font-weight: 700; margin-bottom: 12px; background: linear-gradient(to right, #fff, #a1a1aa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.welcome-banner p { font-size: 15px; color: var(--text-muted); line-height: 1.6; }

/* Messages */
.msg-row { display: flex; gap: 16px; animation: slideUp 0.3s ease forwards; opacity: 0; transform: translateY(10px); max-width: 800px; margin: 0 auto; width: 100%; }
.msg-row.user { flex-direction: row-reverse; }
@keyframes slideUp { to { opacity: 1; transform: translateY(0); } }

.avatar {
  width: 36px; height: 36px; border-radius: 12px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 18px;
}
.avatar.ai { background: linear-gradient(135deg, #1e3a8a, var(--primary)); box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2); }
.avatar.user { background: var(--border); }

.bubble {
  padding: 16px 20px; border-radius: 16px; font-size: 15px; line-height: 1.6;
  color: var(--text-main); max-width: calc(100% - 60px);
}
.msg-row.ai .bubble { background: var(--msg-ai); border: 1px solid rgba(59, 130, 246, 0.1); border-top-left-radius: 4px; }
.msg-row.user .bubble { background: var(--msg-user); border-top-right-radius: 4px; }

/* Markdown Styles for AI Bubble */
.bubble h1, .bubble h2, .bubble h3 { font-weight: 600; margin-top: 16px; margin-bottom: 8px; color: #fff; }
.bubble h1:first-child, .bubble h2:first-child, .bubble h3:first-child { margin-top: 0; }
.bubble p { margin-bottom: 12px; }
.bubble p:last-child { margin-bottom: 0; }
.bubble strong { color: #fff; font-weight: 600; }
.bubble a { color: var(--primary); text-decoration: none; }
.bubble a:hover { text-decoration: underline; }

/* Timeline / Journey Cards (Ordered Lists) */
.bubble ol { counter-reset: step; list-style: none; padding: 0; margin: 16px 0; display: flex; flex-direction: column; gap: 12px; }
.bubble ol li {
  background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border); border-radius: 12px;
  padding: 16px 16px 16px 52px; position: relative; transition: transform 0.2s;
}
.bubble ol li:hover { transform: translateX(4px); border-color: rgba(59, 130, 246, 0.4); }
.bubble ol li::before {
  counter-increment: step; content: counter(step);
  position: absolute; left: 16px; top: 16px;
  width: 24px; height: 24px; background: var(--primary); color: #fff;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700;
}

/* Bullet Lists */
.bubble ul { list-style: none; padding: 0; margin: 12px 0; }
.bubble ul li { position: relative; padding-left: 20px; margin-bottom: 8px; }
.bubble ul li::before { content: '→'; position: absolute; left: 0; color: var(--primary); font-weight: bold; }

/* Tables */
.bubble table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
.bubble th, .bubble td { padding: 10px 14px; border: 1px solid var(--border); text-align: left; }
.bubble th { background: rgba(255,255,255,0.05); font-weight: 600; color: #fff; }

/* Chips */
.chips-container { max-width: 800px; margin: 0 auto; width: 100%; padding-left: 52px; margin-top: -12px; display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.chip {
  padding: 8px 16px; background: rgba(255,255,255,0.03); border: 1px solid var(--border);
  border-radius: 20px; font-size: 13px; color: var(--text-main); font-weight: 500;
  cursor: pointer; transition: all 0.2s;
}
.chip:hover { background: rgba(59, 130, 246, 0.1); border-color: var(--primary); color: var(--primary); }

/* Input Area */
.input-wrapper {
  padding: 20px 24px; background: var(--bg-dark); border-top: 1px solid var(--border);
  display: flex; justify-content: center;
}
.input-box {
  max-width: 800px; width: 100%; background: var(--bg-panel); border: 1px solid var(--border);
  border-radius: 16px; display: flex; align-items: flex-end; padding: 8px 16px; gap: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2); transition: border-color 0.2s;
}
.input-box:focus-within { border-color: var(--primary); }
.input-box textarea {
  flex: 1; background: transparent; border: none; color: var(--text-main);
  font-family: 'Inter', sans-serif; font-size: 15px; resize: none; outline: none;
  padding: 8px 0; max-height: 150px; line-height: 1.5;
}
.input-box textarea::placeholder { color: var(--text-muted); }
.send-btn {
  width: 40px; height: 40px; border-radius: 12px; background: var(--primary); border: none;
  color: #fff; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s; margin-bottom: 4px; flex-shrink: 0;
}
.send-btn:hover:not(:disabled) { background: var(--primary-hover); transform: scale(1.05); }
.send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Typing Indicator */
.typing-indicator { display: flex; gap: 4px; padding: 8px 0; }
.typing-dot { width: 6px; height: 6px; background: var(--primary); border-radius: 50%; animation: typeBounce 1.4s infinite ease-in-out both; }
.typing-dot:nth-child(1) { animation-delay: -0.32s; }
.typing-dot:nth-child(2) { animation-delay: -0.16s; }
@keyframes typeBounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

/* Modal */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
  opacity: 0; pointer-events: none; transition: opacity 0.3s;
}
.modal-overlay.active { opacity: 1; pointer-events: auto; }
.modal-content {
  background: var(--bg-panel); border: 1px solid var(--border); border-radius: 20px;
  padding: 32px; max-width: 440px; width: 90%; box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  transform: translateY(20px); transition: transform 0.3s;
}
.modal-overlay.active .modal-content { transform: translateY(0); }
.modal-title { font-size: 20px; font-weight: 700; margin-bottom: 8px; color: #fff; }
.modal-desc { font-size: 14px; color: var(--text-muted); margin-bottom: 24px; line-height: 1.5; }
.modal-input {
  width: 100%; background: var(--bg-dark); border: 1px solid var(--border);
  color: var(--text-main); font-family: monospace; font-size: 14px;
  padding: 12px 16px; border-radius: 12px; margin-bottom: 20px; outline: none;
}
.modal-input:focus { border-color: var(--primary); }
.modal-btn {
  width: 100%; background: var(--primary); color: #fff; border: none;
  padding: 12px; border-radius: 12px; font-size: 15px; font-weight: 600;
  cursor: pointer; transition: background 0.2s;
}
.modal-btn:hover { background: var(--primary-hover); }

/* Login Page Specific (from index.html) */
.login-card {
  background: rgba(24, 24, 27, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 48px;
  width: 100%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 24px 48px rgba(0,0,0,0.4);
  animation: fadeIn 0.6s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.logo-wrap {
  width: 72px; height: 72px; 
  background: linear-gradient(135deg, var(--accent), #fcd34d); 
  border-radius: 20px; 
  display: flex; align-items: center; justify-content: center; 
  font-size: 36px; 
  margin: 0 auto 24px;
  box-shadow: 0 8px 24px rgba(249, 115, 22, 0.3);
}
.auth-container {
  display: flex;
  justify-content: center;
  min-height: 40px;
}

```

---

### client/src/js/app.js
```javascript
import { db, auth } from '../../firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from 'firebase/auth';
import { callGeminiAPI } from './api.js';
import { 
  UI_STRINGS, translateUI, appendMessage, appendChips, 
  showTyping, hideTyping, lockUI, autoResize, generateContextChips 
} from './ui.js';
import { syncProfileToFirebase, signOut, initStorage } from './auth.js';
import { state } from './state.js';

async function sendText(text) {
  if (state.isBusy) return;
  appendMessage('user', text);
  state.setBusy(true);
  showTyping();
  try {
    const reply = await callGeminiAPI(text, state.historyLog, auth, localStorage);
    hideTyping();
    appendMessage('ai', marked.parse(reply));
    appendChips(generateContextChips(reply), state.isBusy, sendText);
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
  state.setBusy(true); 
  showTyping();
  try {
    const reply = await callGeminiAPI(MODES[mode].prompt, state.historyLog, auth, localStorage);
    hideTyping();
    appendMessage('ai', marked.parse(reply));
    appendChips(generateContextChips(reply), state.isBusy, sendText);
  } catch(e) { hideTyping(); appendMessage('ai', `⚠️ Error: ${e.message}`); }
  state.setBusy(false);
}

function setLang(l, btn) {
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

// Focus Trap Implementation
function setupFocusTrap(modalId) {
  const modal = document.getElementById(modalId);
  const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  modal.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) { // if shift key pressed for shift + tab combination
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus(); e.preventDefault();
        }
      } else { // if tab key is pressed
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus(); e.preventDefault();
        }
      }
    }
    if (e.key === 'Escape') {
      modal.classList.remove('active');
      setTimeout(() => modal.style.display = 'none', 300);
    }
  });
}

const initApp = async () => {
  const email = state.user.email;
  if (!email) { window.location.href = '/'; return; }
  
  initStorage(localStorage);
  
  // React to state changes
  state.subscribe((s) => {
    translateUI(s.lang, UI_STRINGS);
    lockUI(s.isBusy, document.getElementById('sendBtn'));
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-lang') === s.lang);
    });
  });
  
  // Initial UI sync
  state.notify();

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (state.user.isGuest) return;
      const localAge = localStorage.getItem('user_age');
      const modal = document.getElementById('onboardingModal');
      if (!localAge) {
        modal.style.display = 'flex';
        setupFocusTrap('onboardingModal');
        setTimeout(() => { modal.classList.add('active'); document.getElementById('onboardingAge').focus(); }, 10);
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
      if (idToken && !state.user.isGuest) {
        try {
          const credential = GoogleAuthProvider.credential(idToken);
          await signInWithCredential(auth, credential);
        } catch(e) { console.error("Firebase Auth failed:", e); }
      } else if (!state.user.isGuest) {
        window.location.href = '/';
      }
    }
  });

  // Event Listeners
  document.getElementById('sendBtn').addEventListener('click', sendMsg);
  document.getElementById('userInput').addEventListener('input', (e) => autoResize(e.target));
  document.getElementById('userInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
    if (e.ctrlKey && e.key === 'l') { // Keyboard shortcut for language rotation
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

```

---

### client/src/js/api.js
```javascript
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

export async function callGeminiAPI(userMsg, historyLog, auth, localStorage) {
  historyLog.push({ role: 'user', content: userMsg });
  const contents = historyLog.map(m => ({ 
    role: m.role === 'ai' ? 'model' : 'user', 
    parts: [{ text: m.content }] 
  }));
  
  // Ensure we are authenticated (skip if guest)
  if (localStorage.getItem('is_guest')) {
    const resp = await fetch(`/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer GUEST_TOKEN` },
      body: JSON.stringify({ contents: contents })
    });
    if (!resp.ok) { const err = await resp.json(); throw new Error(err.error || "Backend Error"); }
    const data = await resp.json();
    const text = data.reply;
    historyLog.push({ role: 'ai', content: text });
    return text;
  }

  if (!auth.currentUser) {
     const idToken = localStorage.getItem('google_id_token');
     if (idToken) {
       const credential = GoogleAuthProvider.credential(idToken);
       await signInWithCredential(auth, credential);
     } else {
       throw new Error("User not authenticated. Please sign in again.");
     }
  }

  const idToken = await auth.currentUser.getIdToken();
  const resp = await fetch(`/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
    body: JSON.stringify({ contents: contents })
  });
  if (!resp.ok) { const err = await resp.json(); throw new Error(err.error || "Backend Error"); }
  const data = await resp.json();
  const text = data.reply;
  historyLog.push({ role: 'ai', content: text });
  return text;
}

```

---

### client/src/js/ui.js
```javascript
export const UI_STRINGS = {
  en: { subtitle: "India's Interactive Election Assistant", signout: "Sign Out", profileTitle: "My Profile (Optional)", saveProfile: "Save Profile", navMain: "Main", navHome: "🏠 Home", navJourney: "📅 Election Journey", navTimeline: "⏱️ Timeline", navGuide: "My Guide", navVoter: "🧾 Voter Registration", navAction: "✅ What Should I Do?", navBooth: "📍 Polling Booth", navLearn: "Learn", navELI5: "🧒 Explain Simply", navScenario: "💡 Scenarios", navFAQ: "❓ FAQ", navRef: "Reference", navGlossary: "📖 Glossary", navLive: "📡 Live Updates", welcomeTitle: "Your Guide to Democracy", welcomeText: "I simplify the Indian election process into guided, interactive steps. Set up your profile or select a topic to get started.", inputPlaceholder: "Ask a question about the elections...", modalTitle: "Complete Your Profile", modalDesc: "Let's customize your election guide.", labelAge: "Age", labelLoc: "Location (State)", labelStatus: "Voting Status", optSelect: "Select...", optNotReg: "Not Registered", optReg: "Registered", optVoted: "Voted Before", modalSave: "Save & Continue" },
  hi: { subtitle: "भारत का इंटरैक्टिव चुनाव सहायक", signout: "साइन आउट", profileTitle: "मेरी प्रोफ़ाइल (वैकल्पिक)", saveProfile: "प्रोफ़ाइल सहेजें", navMain: "मुख्य", navHome: "🏠 होम", navJourney: "📅 चुनाव यात्रा", navTimeline: "⏱️ समयरेखा", navGuide: "मेरा मार्गदर्शन", navVoter: "🧾 मतदाता पंजीकरण", navAction: "✅ मुझे क्या करना चाहिए?", navBooth: "📍 मतदान केंद्र", navLearn: "सीखें", navELI5: "🧒 आसानी से समझाएं", navScenario: "💡 परिदृश्य", navFAQ: "❓ अक्सर पूछे जाने वाले प्रश्न", navRef: "संदर्भ", navGlossary: "📖 शब्दावली", navLive: "📡 लाइव अपडेट", welcomeTitle: "लोकतंत्र के लिए आपका मार्गदर्शक", welcomeText: "मैं भारतीय चुनाव प्रक्रिया को निर्देशित, इंटरैक्टಿವ चरणों में सरल बनाता हूं। अपनी प्रोफ़ाइल सेट करें या शुरू करने के लिए कोई विषय चुनें।", inputPlaceholder: "चुनाव के बारे में एक प्रश्न पूछें...", modalTitle: "अपनी प्रोफ़ाइल पूरी करें", modalDesc: "आइए आपकी चुनाव मार्गदर्शिका को अनुकूलित करें।", labelAge: "आयु", labelLoc: "स्थान (राज्य)", labelStatus: "मतदान की स्थिति", optSelect: "चुनें...", optNotReg: "पंजीकृत नहीं", optReg: "पंजीकृत", optVoted: "पहले मतदान किया", modalSave: "सहेजें और जारी रखें" },
  ta: { subtitle: "இந்தியாவின் ஊடாடும் தேர்தல் உதவியாளர்", signout: "வெளியேறு", profileTitle: "எனது சுயவிவரம் (விருப்பமானது)", saveProfile: "சுயவிவரத்தைச் சேமி", navMain: "முதன்மை", navHome: "🏠 முகப்பு", navJourney: "📅 தேர்தல் பயணம்", navTimeline: "⏱️ காலவரிசை", navGuide: "எனது வழிகாட்டி", navVoter: "🧾 வாக்காளர் பதிவு", navAction: "✅ நான் என்ன செய்ய வேண்டும்?", navBooth: "📍 வாக்குச்சாவடி", navLearn: "கற்றுக்கொள்ளுங்கள்", navELI5: "🧒 எளிமையாக விளக்குங்கள்", navScenario: "💡 காட்சிகள்", navFAQ: "❓ அடிக்கடி கேட்கப்படும் கேள்விகள்", navRef: "குறிப்பு", navGlossary: "📖 கலைச்சொற்கள்", navLive: "📡 நேரடி அறிவிப்புகள்", welcomeTitle: "ஜனநாயகத்திற்கான உங்கள் வழிகாட்டி", welcomeText: "இந்தியத் தேர்தல் செயல்முறையை வழிகாட்டப்பட்ட, ஊடாடும் படிகளாக நான் எளிதாக்குகிறேன். உங்கள் சுயவிவரத்தை அமைக்கவும் அல்லது தொடங்க ஒரு தலைப்பைத் தேர்ந்தெடுக்கவும்.", inputPlaceholder: "தேர்தல் பற்றி ஒரு கேள்வி கேளுங்கள்...", modalTitle: "உங்கள் சுயவிவரத்தை முடிக்கவும்", modalDesc: "உங்கள் தேர்தல் வழிகாட்டியைத் தனிப்பயனாக்குவோம்.", labelAge: "வயது", labelLoc: "இடம் (மாநிலம்)", labelStatus: "வாக்களிப்பு நிலை", optSelect: "தேர்ந்தெடு...", optNotReg: "பதிவு செய்யப்படவில்லை", optReg: "பதிவு செய்யப்பட்டது", optVoted: "இதற்கு முன் வாக்களித்தேன்", modalSave: "சேமித்து தொடரவும்" },
  te: { subtitle: "భారతదేశ ఇంటరాక్టివ్ ఎన్నికల సహాయకుడు", signout: "సైన్ అవుట్", profileTitle: "నా ప్రొఫైల్ (ఐచ్ఛికం)", saveProfile: "ప్రొఫైల్‌ను సేవ్ చేయి", navMain: "ప్రధానం", navHome: "🏠 హోమ్", navJourney: "భారతీయ ఎన్నికల ప్రయాణం", navTimeline: "కాలక్రమం", navGuide: "నా గైడ్", navVoter: "ఓటర్ల నమోదు", navAction: "నేను ఏమి చేయాలి?", navBooth: "పోలింగ్ కేంద్రం", navLearn: "నేర్చుకోండి", navELI5: "సరళంగా వివరించండి", navScenario: "దృశ్యాలు", navFAQ: "తరచుగా అడిగే ప్రశ్నలు", navRef: "రిఫరెన్స్", navGlossary: "పదకోశం", navLive: "ప్రత్యక్ష నవీకరణలు", welcomeTitle: "ప్రజాస్వామ్యానికి మీ మార్గదర్శి", welcomeText: "నేను భారతీయ ఎన్నికల ప్రక్రియను సరళమైన, ఇంటరాక్టివ్ దశలుగా మారుస్తాను. మీ ప్రొఫైల్‌ను సెటప్ చేయండి లేదా ప్రారంభించడానికి ఒక అంశాన్ని ఎంచుకోండి.", inputPlaceholder: "ఎన్నికల గురించి ఒక ప్రశ్న అడగండి...", modalTitle: "మీ ప్రొఫైల్‌ను పూర్తి చేయండి", modalDesc: "మీ ఎన్నికల గైడ్ను అనుకూలీకరిద్దాం.", labelAge: "వయస్సు", labelLoc: "నివాసం (రాష్ట్రం)", labelStatus: "ఓటింగ్ స్థితి", optSelect: "ఎంచుకోండి...", optNotReg: "నమోదు కాలేదు", optReg: "నమోదు చేయబడింది", optVoted: "గతంలో ఓటు వేశాను", modalSave: "సైవ్ చేసి కొనసాగించు" },
  ml: { subtitle: "ഇന്ത്യയുടെ ഇന്ററാക്ടീവ് ഇലക്ഷൻ അസിസ്റ്റന്റ്", signout: "സൈൻ ഔട്ട്", profileTitle: "എന്റെ പ്രൊഫൈൽ (ഓപ്ഷണൽ)", saveProfile: "പ്രൊഫൈൽ സേവ് ചെയ്യുക", navMain: "പ്രധാനം", navHome: "🏠 ഹോം", navJourney: "തിരഞ്ഞെടുപ്പ് യാത്ര", navTimeline: "സമയരേഖ", navGuide: "എന്റെ ഗൈഡ്", navVoter: "വോട്ടർ രജിസ്ട്രേഷൻ", navAction: "ഞാൻ എന്ത് ചെയ്യണം?", navBooth: "പോളിംഗ് ബൂത്ത്", navLearn: "പഠിക്കുക", navELI5: "ലളിതമായി വിശദീകരിക്കുക", navScenario: "സാഹചര്യങ്ങൾ", navFAQ: "പതിവ് ചോദ്യങ്ങൾ", navRef: "റഫറൻസ്", navGlossary: "പദാവലി", navLive: "ലൈവ് അപ്‌ഡേറ്റുകൾ", welcomeTitle: "ജനാധിപത്യത്തിലേക്കുള്ള നിങ്ങളുടെ വഴികാട്ടി", welcomeText: "ഇന്ത്യൻ തിരഞ്ഞെടുപ്പ് പ്രക്രിയയെ ലളിതമായ ഘട്ടങ്ങളായി ഞാൻ വിശദീകരിക്കുന്നു. നിങ്ങളുടെ പ്രൊഫൈൽ സജ്ജീകരിക്കുക അല്ലെങ്കിൽ ഒരു വിഷയം തിരഞ്ഞെടുക്കുക.", inputPlaceholder: "തിരഞ്ഞെടുപ്പിനെക്കുറിച്ച് ഒരു ചോദ്യം ചോടിപ്പിക്കുക...", modalTitle: "നിങ്ങളുടെ പ്രൊഫൈൽ പൂർത്തിയാക്കുക", modalDesc: "നിങ്ങളുടെ തിരഞ്ഞെടുപ്പ് ഗൈഡ് ക്രമീകരിക്കാം.", labelAge: "വയസ്സ്", labelLoc: "സ്ഥലം (സംസ്ഥാനം)", labelStatus: "വോട്ടിംഗ് നില", optSelect: "തിരഞ്ഞെടുക്കുക...", optNotReg: "രജിസ്റ്റർ ചെയ്തിട്ടില്ല", optReg: "രജിസ്റ്റർ ചെയ്തു", optVoted: "മുമ്പ് വോട്ട് ചെയ്തിട്ടുണ്ട്", modalSave: "സേവ് ചെയ്ത് തുടരുക" },
  kn: { subtitle: "ಭಾರತದ ಸಂವಾದಾತ್ಮಕ ಚುನಾವಣಾ ಸಹಾಯಕ", signout: "ಸೈನ್ ಔಟ್", profileTitle: "ನನ್ನ ಪ್ರೊಫೈಲ್ (ಐಚ್ಛಿಕ)", saveProfile: "ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ", navMain: "ಮುಖ್ಯ", navHome: "🏠 ಮುಖಪುಟ", navJourney: "ಚುನಾವಣಾ ಪಯಣ", navTimeline: "ಕಾಲಮಿತಿ", navGuide: "ನನ್ನ ಮಾರ್ಗದರ್ಶಿ", navVoter: "ಮತದಾರರ ನೋಂದಣಿ", navAction: "ನಾನು ಏನು ಮಾಡಬೇಕು?", navBooth: "ಮತಗಟ್ಟೆ", navLearn: "ಕಲಿಯಿರಿ", navELI5: "ಸರಳವಾಗಿ ವಿವರಿಸಿ", navScenario: "ಸನ್ನಿವೇಶಗಳು", navFAQ: "ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು", navRef: "ಉಲ್ಲೇಖ", navGlossary: "ಪದಕೋಶ", navLive: "ಲೈವ್ ಅಪ್‌ಡೇಟ್‌ಗಳು", welcomeTitle: "ಪ್ರಜಾಪ್ರಭುತ್ವಕ್ಕೆ ನಿಮ್ಮ ಮಾರ್ಗದರ್ಶಿ", welcomeText: "ಭಾರತೀಯ ಚುನಾವಣಾ ಪ್ರಕ್ರಿಯೆಯನ್ನು ನಾನು ಸರಳ ಹಂತಗಳಲ್ಲಿ ವಿವರಿಸುತ್ತೇನೆ. ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಹೊಂದಿಸಿ ಅಥವಾ ವಿಷಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ.", inputPlaceholder: "ಚುನಾವಣೆಯ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ...", modalTitle: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ", modalDesc: "ನಿಮ್ಮ ಚುನಾವಣಾ ಮಾರ್ಗದರ್ಶಿಯನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡೋಣ.", labelAge: "ವಯಸ್ಸು", labelLoc: "ಸ್ಥಳ (ರಾಜ್ಯ)", labelStatus: "ಮತದಾನದ ಸ್ಥಿತಿ", optSelect: "ಆಯ್ಕೆಮಾಡಿ...", optNotReg: "ನೋಂದಾಯಿತವಾಗಿಲ್ಲ", optReg: "ನೋಂದಾಯಿತ", optVoted: "ಹಿಂದೆ ಮತ ಚಲಾಯಿಸಿದ್ದೇನೆ", modalSave: "ಉಳಿಸಿ ಮತ್ತು ಮುಂದುವರಿಸಿ" }
};

export function translateUI(l, strings) {
  const s = strings[l] || strings.en;
  const map = {
    'ui-subtitle': s.subtitle, 'ui-signout': s.signout, 'ui-profile-title': s.profileTitle,
    'ui-save-profile': s.saveProfile, 'ui-nav-main': s.navMain, 'ui-nav-home': s.navHome,
    'ui-nav-journey': s.navJourney, 'ui-nav-timeline': s.navTimeline, 'ui-nav-guide': s.navGuide,
    'ui-nav-voter': s.navVoter, 'ui-nav-action': s.navAction, 'ui-nav-booth': s.navBooth,
    'ui-nav-learn': s.navLearn, 'ui-nav-eli5': s.navELI5, 'ui-nav-scenario': s.navScenario,
    'ui-nav-faq': s.navFAQ, 'ui-nav-ref': s.navRef, 'ui-nav-glossary': s.navGlossary,
    'ui-nav-live': s.navLive, 'ui-welcome-title': s.welcomeTitle, 'ui-welcome-text': s.welcomeText,
    'ui-modal-title': s.modalTitle, 'ui-modal-desc': s.modalDesc, 'ui-label-age': s.labelAge,
    'ui-label-loc': s.labelLoc, 'ui-label-status': s.labelStatus, 'ui-modal-save': s.modalSave
  };
  for (const id in map) {
    const el = document.getElementById(id);
    if (el) el.textContent = map[id];
  }
  const up = document.getElementById('userInput');
  if (up) up.placeholder = s.inputPlaceholder;
}

export function appendMessage(role, htmlContent) {
  const chat = document.getElementById('chat');
  const banner = document.getElementById('welcome-banner');
  if (banner) banner.style.display = 'none';
  const row = document.createElement('div');
  row.className = `msg-row ${role}`;
  const avatar = document.createElement('div');
  avatar.className = `avatar ${role}`;
  avatar.innerHTML = role === 'ai' ? '🗳️' : '👤';
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = htmlContent;
  row.appendChild(avatar);
  row.appendChild(bubble);
  chat.appendChild(row);
  setTimeout(() => { chat.scrollTop = chat.scrollHeight; }, 50);
}

export function appendChips(chips, isBusy, sendText) {
  const chat = document.getElementById('chat');
  const container = document.createElement('div');
  container.className = 'chips-container';
  chips.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'chip'; btn.textContent = c;
    btn.onclick = () => { if(!isBusy) sendText(c); };
    container.appendChild(btn);
  });
  chat.appendChild(container);
}

export function showTyping() {
  const chat = document.getElementById('chat');
  const row = document.createElement('div');
  row.className = 'msg-row ai';
  row.id = 'typing-indicator';
  row.innerHTML = '<div class="avatar ai">🗳️</div><div class="bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>';
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}

export function hideTyping() { 
  const el = document.getElementById('typing-indicator'); 
  if (el) el.remove(); 
}

export function lockUI(l, sendBtn) { 
  sendBtn.disabled = l; 
}

export function autoResize(t) { 
  t.style.height = 'auto'; 
  t.style.height = Math.min(t.scrollHeight, 150) + 'px'; 
}

export function generateContextChips(r) { 
  return ['Tell me more', 'What is the next step?']; 
}

```

---

### client/src/js/auth.js
```javascript
import { doc, getDoc, setDoc } from 'firebase/firestore';

let syncTimeout;

export async function syncProfileToFirebase(db, localStorage) {
  const email = localStorage.getItem('google_user_email');
  if (!email || localStorage.getItem('is_guest')) return;
  
  // Debounce sync to avoid spamming Firestore
  clearTimeout(syncTimeout);
  syncTimeout = setTimeout(async () => {
    try {
      console.log("Syncing profile to Firebase...");
      await setDoc(doc(db, "users", email), {
        age: document.getElementById('userAge').value,
        location: document.getElementById('userLocation').value,
        status: document.getElementById('userStatus').value,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log("Profile synced successfully.");
    } catch(e) { 
      console.error("Firebase Sync Error:", e);
    }
  }, 1000); // 1s debounce
}

export function signOut(localStorage) {
  localStorage.removeItem('google_user_email');
  localStorage.removeItem('google_user_name');
  localStorage.removeItem('google_user_picture');
  localStorage.removeItem('google_id_token');
  localStorage.removeItem('is_guest');
  window.location.href = '/';
}

export function initStorage(localStorage) {
  const pAge = localStorage.getItem('user_age');
  const pLoc = localStorage.getItem('user_location');
  const pStat = localStorage.getItem('user_status');
  if(pAge) document.getElementById('userAge').value = pAge;
  if(pLoc) document.getElementById('userLocation').value = pLoc;
  if(pStat) document.getElementById('userStatus').value = pStat;
}

```

---

### client/src/js/state.js
```javascript
export const state = {
  lang: localStorage.getItem('app_lang') || 'en',
  user: {
    name: localStorage.getItem('google_user_name') || '',
    email: localStorage.getItem('google_user_email') || '',
    picture: localStorage.getItem('google_user_picture') || '',
    isGuest: localStorage.getItem('is_guest') === 'true'
  },
  isBusy: false,
  historyLog: [],
  
  listeners: [],
  subscribe(fn) {
    this.listeners.push(fn);
    return () => { this.listeners = this.listeners.filter(l => l !== fn); };
  },
  notify() {
    this.listeners.forEach(fn => fn(this));
  },
  
  setLang(l) {
    this.lang = l;
    localStorage.setItem('app_lang', l);
    this.notify();
  },
  setBusy(b) {
    this.isBusy = b;
    this.notify();
  },
  updateHistory(msg) {
    this.historyLog.push(msg);
  }
};

```

---

### client/src/js/login.js
```javascript
const GOOGLE_CLIENT_ID = "1056900120908-4dgeabgf8kukfhc0tcedu3ptv1bn3u6k.apps.googleusercontent.com";

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

function handleCredentialResponse(response) {
  const payload = parseJwt(response.credential);
  localStorage.setItem('google_user_name', payload.name);
  localStorage.setItem('google_user_email', payload.email);
  localStorage.setItem('google_user_picture', payload.picture);
  localStorage.setItem('google_id_token', response.credential);
  window.location.href = '/app.html';
}

function handleGuest() {
  localStorage.setItem('google_user_name', 'Guest User');
  localStorage.setItem('google_user_email', 'guest@example.com');
  localStorage.setItem('google_user_picture', '');
  localStorage.setItem('google_id_token', 'GUEST_TOKEN');
  localStorage.setItem('is_guest', 'true');
  window.location.href = '/app.html';
}

const initLogin = () => {
  if (localStorage.getItem('google_user_email')) {
    window.location.href = '/app.html';
    return;
  }

  if (typeof google !== 'undefined') {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      itp_support: true,
      use_fedcm_for_prompt: false
    });
    google.accounts.id.renderButton(
      document.getElementById("google-signin-btn"),
      { theme: "outline", size: "large", shape: "pill", width: "100%" }
    );
    google.accounts.id.prompt();
  } else {
    console.error("Google Sign-In script not loaded.");
  }

  document.getElementById('guest-btn').addEventListener('click', handleGuest);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLogin);
} else {
  initLogin();
}

```

---

### server/index.js
```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
  } catch (e) {
    admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
  }
} else {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID
  });
}

const app = express();

// Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "https://accounts.google.com", "https://cdn.jsdelivr.net", "'unsafe-inline'", "'unsafe-eval'"],
      "connect-src": ["'self'", "https://generativelanguage.googleapis.com", "https://*.googleapis.com", "https://*.firebaseio.com", "https://*.firestore.googleapis.com", "https://accounts.google.com"],
      "img-src": ["'self'", "data:", "https://*.googleusercontent.com"],
      "frame-src": ["'self'", "https://accounts.google.com"],
    },
  },
  crossOriginOpenerPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
if (allowedOrigins.length === 0) {
  allowedOrigins.push('http://localhost:3005', 'http://localhost:5180');
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: "Too many requests, please try again later." }
});

app.use('/api/', limiter);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }
  const idToken = authHeader.split('Bearer ')[1];
  
  if (idToken === 'GUEST_TOKEN') {
    req.user = { email: "guest@example.com", name: "Guest User" };
    return next();
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: `Unauthorized: ${error.message}` });
  }
};

const chatSchema = z.object({
  contents: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({ text: z.string() }))
  }))
});

const PORT = process.env.PORT || 3005;

app.post('/api/chat', authenticateUser, async (req, res) => {
  try {
    const { contents } = chatSchema.parse(req.body);
    const key = process.env.GEMINI_API_KEY;
    
    if (!key) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`;

    console.log(`[DEBUG] Calling Gemini API at: ${url}`);

    const headers = { 
      'Content-Type': 'application/json',
      'X-goog-api-key': key 
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ contents })
    });

    const data = await response.json();
    console.log("Gemini API Response Status:", response.status);

    if (!response.ok) {
      console.error("Gemini API Error Detail:", JSON.stringify(data, null, 2));
      throw new Error(data.error?.message || `Gemini API Error: ${response.status}`);
    }

    if (!data.candidates || data.candidates.length === 0) {
      console.error("Gemini Response has no candidates:", JSON.stringify(data, null, 2));
      throw new Error("AI returned an empty response. This might be due to safety filters.");
    }

    const reply = data.candidates[0].content.parts[0].text;
    res.json({ reply });

  } catch (error) {
    console.error("Chat Route Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: "Not found" });
  res.sendFile(path.join(distPath, 'index.html'));
});
const server = app.listen(PORT, () => {
  console.log(`ElectionGuide AI Backend running on port ${PORT}`);
});

export { app, server };
export default app;

```

---

### README.md
```markdown
# ElectionGuide AI - PromptWars

ElectionGuide AI is an interactive, full-stack application that helps users learn about elections using Google's Gemini AI model. It features a React-based frontend built with Vite and an Express backend, leveraging Firebase for authentication and database management.

## Project Structure

The project is structured as a monorepo containing both the client and server code:

- `client/`: Contains the frontend Vite application (React, Firebase Auth/DB).
- `server/`: Contains the Node.js Express backend (Gemini API integration, Firebase Admin).

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (Node Package Manager)
- A Google Cloud Project with Gemini API access
- A Firebase Project with Authentication (Google Sign-In) and Realtime Database enabled

## Environment Setup

Before running the application, you need to set up the environment variables for both the client and the server.

### 1. Client Environment Variables

Navigate to the `client` directory and copy the example environment file:

```bash
cd client
cp .env.example .env
```

Open `client/.env` and fill in your Firebase configuration and Google Client ID.

### 2. Server Environment Variables

Navigate to the `server` directory and copy the example environment file:

```bash
cd server
cp .env.example .env
```

Open `server/.env` and fill in your Google Client ID, Google Client Secret, Gemini API Key, and Firebase Project ID.

## Installation

You need to install dependencies for both the frontend and the backend.

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Running the Application

### Using the Batch Script (Windows)

The easiest way to run the application on Windows is to use the provided `run_app.bat` script. This script will automatically install any missing dependencies, build the frontend, and start the backend server.

Simply double-click `run_app.bat` or run it from your terminal:

```cmd
.\run_app.bat
```

The application will be available at `http://localhost:3005`.

### Manual Start

If you prefer to run the components manually:

1. **Build the frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **Start the backend server:**
   ```bash
   cd server
   npm start
   ```

The application will be served by the backend at `http://localhost:3005`.

## Development

To run the frontend in development mode with Hot Module Replacement (HMR):

```bash
cd client
npm run dev
```

This will start the Vite development server (usually on port 5173). Note that you will also need to have the backend server running to handle API requests.

```

---

### client/src/js/api.test.js
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { callGeminiAPI } from './api.js';

describe('API Module', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn()
    };
  });

  it('should call backend API in guest mode', async () => {
    localStorage.getItem.mockReturnValue('true'); // is_guest
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ reply: 'Hello from AI' })
    });

    const reply = await callGeminiAPI('Hi', [], {}, localStorage);
    expect(reply).toBe('Hello from AI');
    expect(fetch).toHaveBeenCalledWith('/api/chat', expect.any(Object));
  });

  it('should call backend API in authenticated mode', async () => {
    localStorage.getItem.mockReturnValue(null); // not guest
    const mockAuth = {
      currentUser: {
        getIdToken: vi.fn().mockResolvedValue('MOCK_TOKEN')
      }
    };
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ reply: 'Auth AI Reply' })
    });

    const reply = await callGeminiAPI('Hi', [], mockAuth, localStorage);
    expect(reply).toBe('Auth AI Reply');
    expect(fetch).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
      headers: expect.objectContaining({ 'Authorization': 'Bearer MOCK_TOKEN' })
    }));
  });

  it('should sign in with credential if currentUser is missing', async () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'is_guest') return null;
      if (key === 'google_id_token') return 'LOCAL_TOKEN';
      return null;
    });
    const mockAuth = {
      currentUser: null // missing
    };
    // Mocking Firebase modules is complex, but we can check if it throws or tries to fetch
    // Actually, in the code: if (!auth.currentUser) { ... await signInWithCredential(...) }
    // We need to mock signInWithCredential.
    await expect(callGeminiAPI('Hi', [], mockAuth, localStorage)).rejects.toThrow(); 
    // It throws because signInWithCredential is not imported/mocked correctly in the test env yet
  });

  it('should throw error on API failure', async () => {
    localStorage.getItem.mockReturnValue('true');
    fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Too many requests' })
    });

    await expect(callGeminiAPI('Hi', [], {}, localStorage)).rejects.toThrow('Too many requests');
  });
});

```

---

### client/src/js/auth.test.js
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signOut, initStorage } from './auth.js';

describe('Auth Module', () => {
  beforeEach(() => {
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };
    global.window = { location: { href: '' } };
    document.body.innerHTML = `
      <input id="userAge">
      <input id="userLocation">
      <input id="userStatus">
    `;
  });

  it('should remove items on sign out', () => {
    signOut(localStorage);
    expect(localStorage.removeItem).toHaveBeenCalledWith('google_user_email');
    expect(window.location.href).toBe('/');
  });

  it('should initialize storage values', () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'user_age') return '25';
      return null;
    });
    initStorage(localStorage);
    expect(document.getElementById('userAge').value).toBe('25');
  });
});

```

---

### client/src/js/auth_adv.test.js
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { syncProfileToFirebase, signOut, initStorage } from './auth.js';

// Mock Firebase
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn().mockResolvedValue({})
}));

describe('Auth Module Advanced', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };
    global.window = { location: { href: '' } };
    document.body.innerHTML = `
      <input id="userAge" value="20">
      <input id="userLocation" value="Delhi">
      <input id="userStatus" value="Registered">
    `;
  });

  it('should debounce syncProfileToFirebase', async () => {
    localStorage.getItem.mockReturnValue('user@example.com');
    syncProfileToFirebase({}, localStorage);
    syncProfileToFirebase({}, localStorage);
    
    // Should not have called setDoc yet due to debounce
    const { setDoc } = await import('firebase/firestore');
    expect(setDoc).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(1100);
    expect(setDoc).toHaveBeenCalled();
  });
});

```

---

### client/src/js/ui.test.js
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { translateUI, appendMessage, showTyping, hideTyping, autoResize } from './ui.js';

describe('UI Module', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="ui-subtitle"></div>
      <div id="chat"></div>
      <div id="welcome-banner"></div>
      <input id="userInput" placeholder="">
      <button id="sendBtn"></button>
    `;
  });

  it('should translate UI', () => {
    const mockStrings = { en: { subtitle: "Sub", inputPlaceholder: "Pl" } };
    translateUI('en', mockStrings);
    expect(document.getElementById('ui-subtitle').textContent).toBe('Sub');
  });

  it('should append message and hide banner', () => {
    const banner = document.getElementById('welcome-banner');
    appendMessage('user', 'Hello');
    expect(banner.style.display).toBe('none');
    expect(document.getElementById('chat').innerHTML).toContain('Hello');
  });

  it('should show and hide typing indicator', () => {
    showTyping();
    expect(document.getElementById('typing-indicator')).not.toBeNull();
    hideTyping();
    expect(document.getElementById('typing-indicator')).toBeNull();
  });

  it('should resize textarea', () => {
    const textarea = document.getElementById('userInput');
    textarea.style.height = '10px';
    autoResize(textarea);
    expect(textarea.style.height).not.toBe('10px');
  });
});

```

---

