# ElectionGuide AI - Code Snapshot (Version 11)
*Generated on: 2026-05-02 16:48:12*

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
  <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js"></script>
</head>
<body>

<main class="login-page">
  <div class="login-card">
    <div class="logo-wrap" role="img" aria-label="Election Logo">🗳️</div>
    <h1>ElectionGuide AI</h1>
    <p>Sign in to access your personalized, interactive guide to the Indian democratic process.</p>
    
    <div class="auth-container" id="google-signin-btn"></div>
    
    <div class="login-guest-footer">
      <button id="guest-btn" class="btn-guest">Continue without an account</button>
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
  <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js"></script>
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
    <div id="user-profile" class="user-profile-info"></div>
    <button class="lang-btn active" data-lang="en" aria-label="English">EN</button>
    <button class="lang-btn" data-lang="hi" aria-label="Hindi">HI</button>
    <button class="lang-btn" data-lang="ta" aria-label="Tamil">TA</button>
    <button class="lang-btn" data-lang="te" aria-label="Telugu">TE</button>
    <button class="lang-btn" data-lang="ml" aria-label="Malayalam">ML</button>
    <button class="lang-btn" data-lang="kn" aria-label="Kannada">KN</button>
    <button class="settings-btn settings-btn--danger" id="ui-signout">Sign Out</button>
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
    <div class="chat-container" id="chat" aria-live="polite" tabindex="-1">
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
<div class="modal-overlay" id="onboardingModal">
  <div class="modal-content" role="dialog" aria-labelledby="ui-modal-title" aria-describedby="ui-modal-desc">
    <h2 id="ui-modal-title">Complete Your Profile</h2>
    <p id="ui-modal-desc">Let's customize your election guide.</p>
    
    <div class="profile-field">
      <label for="onboardingAge" id="ui-label-age">Age</label>
      <input type="number" id="onboardingAge" class="modal-input" placeholder="e.g. 18">
    </div>
    <div class="profile-field">
      <label for="onboardingLocation" id="ui-label-loc">Location (State)</label>
      <input type="text" id="onboardingLocation" class="modal-input" placeholder="e.g. Maharashtra">
    </div>
    <div class="profile-field large">
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
</body>
</html>

```

---

### client/firebase.js
```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

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

.login-guest-footer {
  margin-top: 24px; 
  border-top: 1px solid var(--border); 
  padding-top: 24px;
}

.btn-guest {
  width: 100%; 
  padding: 12px; 
  background: transparent; 
  border: 1px solid var(--border); 
  border-radius: 50px; 
  color: var(--text-muted); 
  cursor: pointer; 
  font-weight: 500; 
  transition: all 0.2s;
}
.btn-guest:hover {
  background: var(--surface);
  border-color: var(--primary);
  color: var(--text);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.bubble--booth { flex: 1; }
.booth-intro { margin-bottom: 12px; }
.booth-map { border: 0; border-radius: 12px; }

```

---

### client/src/js/app.js
```javascript
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

// Configure DOMPurify to ensure all AI-generated links open in a new tab for SPA stability
DOMPurify.addHook('afterSanitizeAttributes', function(node) {
  if ('target' in node) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

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

async function sendText(text) {
  if (state.isBusy) return;
  logEvent(analytics, 'message_sent', { char_count: text.length, is_guest: state.user.isGuest });
  appendMessage('user', text);
  state.setBusy(true);
  showTyping();
  try {
    const data = await callGeminiAPI(text, state.historyLog, auth, state.user.isGuest);
    hideTyping();
    const cleanHTML = DOMPurify.sanitize(marked.parse(data.reply || data));
    appendMessage('ai', cleanHTML);
    const chips = data.suggestedQuestions || [];
    appendChips(chips, state.isBusy, sendText);
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

  if (mode === 'booth') {
    appendMessage('user', MODES.booth.prompt);
    const loc = localStorage.getItem('user_location') || 'India';
    const safeLoc = DOMPurify.sanitize(loc);
    const mapsQuery = encodeURIComponent(`election polling booth ${loc}`);
    const embedUrl = `https://www.google.com/maps/embed/v1/search?key=${import.meta.env.VITE_MAPS_API_KEY}&q=${mapsQuery}`;
    
    const chat = document.getElementById('chat');
    const wrapper = document.createElement('div');
    wrapper.className = 'msg-row ai';
    wrapper.innerHTML = `
      <div class="avatar ai" aria-hidden="true">🗳️</div>
      <div class="bubble bubble--booth">
        <p class="booth-intro">Here are polling locations near <strong>${safeLoc}</strong>:</p>
        <iframe
          title="Polling booths near ${safeLoc}"
          class="booth-map"
          width="100%" height="300"
          loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"
          src="${embedUrl}">
        </iframe>
      </div>`;
    chat.appendChild(wrapper);
    chat.scrollTop = chat.scrollHeight;
    return;
  }

  appendMessage('user', MODES[mode].prompt);
  state.setBusy(true); 
  showTyping();
  try {
    const data = await callGeminiAPI(MODES[mode].prompt, state.historyLog, auth, state.user.isGuest);
    hideTyping();
    const cleanHTML = DOMPurify.sanitize(marked.parse(data.reply || data));
    appendMessage('ai', cleanHTML);
    const chips = data.suggestedQuestions || [];
    appendChips(chips, state.isBusy, sendText);
  } catch(e) { hideTyping(); appendMessage('ai', `⚠️ Error: ${e.message}`); }
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
      closeModal(modalId);
    }
  });
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  const triggerEl = document.querySelector('[data-mode="home"]');
  modal.classList.remove('active');
  setTimeout(() => {
    modal.style.display = 'none';
    triggerEl?.focus();
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
        // Listener is already attached, just trigger visibility and focus
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
         errorMsg.style.color = '#ef4444';
         errorMsg.style.fontSize = '13px';
         errorMsg.style.marginBottom = '12px';
         const btn = document.getElementById('ui-modal-save');
         btn.parentNode.insertBefore(errorMsg, btn);
       }
       errorMsg.textContent = "Please fill out all fields to continue.";
       return;
     }

     if (errorMsg) errorMsg.remove();

     document.getElementById('userAge').value = age;
     document.getElementById('userLocation').value = loc;
     document.getElementById('userStatus').value = status;
     localStorage.setItem('user_age', age);
     localStorage.setItem('user_location', loc);
     localStorage.setItem('user_status', status);
     closeModal('onboardingModal');
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
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => console.error('SW Reg failed:', err));
  });
}

```

---

### client/src/js/api.js
```javascript
const MAX_HISTORY = 20;

export async function callGeminiAPI(text, historyLog, auth, isGuest) {
  let idToken = 'GUEST_TOKEN';

  if (!isGuest) {
    if (!auth.currentUser) {
      throw new Error("Unauthorized: session expired. Please sign in again.");
    }
    idToken = await auth.currentUser.getIdToken();
  }

  // Trim history to prevent unbounded growth
  const trimmedHistory = historyLog.slice(-MAX_HISTORY);
  
  // Format history for Gemini
  const contents = trimmedHistory.map(msg => ({
    role: msg.role === 'ai' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  // Add the current user message
  contents.push({
    role: 'user',
    parts: [{ text }]
  });

  let response;
  try {
    response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ contents })
    });
  } catch (networkError) {
    throw new Error("Network error: Please check your internet connection and try again.");
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch AI response');
  }

  // Locally log history
  historyLog.push({ role: 'user', content: text });
  historyLog.push({ role: 'ai', content: data.reply });

  // Enforce memory limit on the client side
  while (historyLog.length > MAX_HISTORY) {
    historyLog.shift();
  }

  return data;
}

```

---

### client/src/js/ui.js
```javascript
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

const uiElements = {};
export function clearCache() {
  for (const key in uiElements) delete uiElements[key];
}
function getCachedElement(id) {
  if (!uiElements[id]) uiElements[id] = document.getElementById(id);
  return uiElements[id];
}

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
    const el = getCachedElement(id);
    if (el) {
      if (el.tagName === 'INPUT') el.placeholder = mapping[id];
      else el.textContent = mapping[id];
    }
  });
  
  const up = getCachedElement('userInput');
  if (up) up.placeholder = s.inputPlaceholder;
}

export function appendMessage(role, content) {
  const chat = getCachedElement('chat');
  const banner = getCachedElement('welcome-banner');
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
  const chat = getCachedElement('chat');
  const row = document.createElement('div');
  row.className = 'msg-row ai';
  row.id = 'typing-indicator';
  row.setAttribute('role', 'status');
  row.innerHTML = `
    <div class="avatar ai" aria-hidden="true">🗳️</div>
    <div class="bubble">
      <div class="typing-indicator" aria-hidden="true">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
      <span class="sr-only">The AI is typing a response...</span>
    </div>`;
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}

export function hideTyping() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) indicator.remove();
}

export function appendChips(chips, isBusy, sendText) {
  const chat = getCachedElement('chat');
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

```

---

### client/src/js/auth.js
```javascript
import { doc, setDoc } from 'firebase/firestore';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../../firebase.js';

let syncTimeout;

export const initStorage = (localStorage) => {
  const user = {
    name: localStorage.getItem('google_user_name') || 'Guest User',
    email: localStorage.getItem('google_user_email') || '',
    picture: localStorage.getItem('google_user_picture') || '',
    isGuest: localStorage.getItem('is_guest') === 'true'
  };
  return user;
};

export async function syncProfileToFirebase(db, localStorage) {
  if (!auth.currentUser || localStorage.getItem('is_guest')) return;
  
  const email = auth.currentUser.email; 
  
  // Extract values immediately before the delay to avoid race conditions
  const age = document.getElementById('userAge')?.value || '';
  const location = document.getElementById('userLocation')?.value || '';
  const status = document.getElementById('userStatus')?.value || '';
  
  clearTimeout(syncTimeout);
  syncTimeout = setTimeout(async () => {
    try {
      console.log("Syncing profile to Firebase...");
      await setDoc(doc(db, "users", email), {
        age,
        location,
        status,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log("Profile synced successfully.");
    } catch(e) { 
      console.error("Firebase Sync Error:", e);
    }
  }, 1000); 
}

export const signOut = async (localStorage) => {
  try {
    await firebaseSignOut(auth);
    // Explicitly remove user-specific keys to preserve application preferences like language
    localStorage.removeItem('google_user_name');
    localStorage.removeItem('google_user_email');
    localStorage.removeItem('google_user_picture');
    localStorage.removeItem('is_guest');
    localStorage.removeItem('user_age');
    localStorage.removeItem('user_location');
    localStorage.removeItem('user_status');
    
    window.location.href = '/';
  } catch (error) {
    console.error("Sign Out Error:", error);
  }
};

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
import { auth } from '../../firebase.js';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) throw new Error("VITE_GOOGLE_CLIENT_ID is not set");

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
  
  const credential = GoogleAuthProvider.credential(response.credential);
  signInWithCredential(auth, credential)
    .then(() => {
      window.location.href = '/app.html';
    })
    .catch((error) => {
      console.error("Firebase Auth Error:", error);
      alert("Authentication failed. Please try again.");
    });
}

function handleGuestLogin() {
  localStorage.setItem('is_guest', 'true');
  localStorage.setItem('google_user_name', 'Guest User');
  localStorage.setItem('google_user_email', 'guest@example.com');
  window.location.href = '/app.html';
}

const initLogin = () => {
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
    itp_support: true,
    use_fedcm_for_prompt: false
  });
  google.accounts.id.renderButton(
    document.getElementById("google-signin-btn"),
    { theme: "outline", size: "large", shape: "pill", width: 340 }
  );
  
  const guestBtn = document.getElementById('guest-btn');
  if (guestBtn) guestBtn.addEventListener('click', handleGuestLogin);
};

// Safe event attachment using DOMContentLoaded instead of window.onload
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
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

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

app.set('trust proxy', 1);

// Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "https://accounts.google.com", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
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
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." }
});

const guestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Guest limit reached. Please sign in for more access." }
});

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
    req.user = { email: "guest@example.com", name: "Guest User", isGuest: true };
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
    parts: z.array(z.object({ text: z.string().max(8000) }))
  })).max(50)
});

const SYSTEM_INSTRUCTION = `You are ElectionGuide AI, a helpful assistant explaining the Indian democratic and electoral process. 
Answer only questions related to Indian elections, voting, democracy, and civic participation. 
Be concise, factual, and cite the Election Commission of India (ECI) where relevant.
Format step-by-step information as numbered lists.
Always provide 3-4 suggested follow-up questions that help the user explore the topic deeper.`;

const responseSchema = {
  description: "The AI's response including text and suggested follow-up questions",
  type: SchemaType.OBJECT,
  properties: {
    reply: {
      type: SchemaType.STRING,
      description: "The main answer to the user's question, formatted in Markdown."
    },
    suggestedQuestions: {
      type: SchemaType.ARRAY,
      description: "3-4 context-aware follow-up questions.",
      items: { type: SchemaType.STRING }
    }
  },
  required: ["reply", "suggestedQuestions"]
};

const PORT = process.env.PORT || 3005;

app.post('/api/chat', (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (token === 'GUEST_TOKEN') return guestLimiter(req, res, next);
  limiter(req, res, next);
}, authenticateUser, async (req, res) => {
  try {
    const { contents } = chatSchema.parse(req.body);
    const key = process.env.GEMINI_API_KEY;
    
    if (!key) return res.status(500).json({ error: "Gemini API key not configured" });

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });

    const history = contents.slice(0, -1).map(msg => ({
      role: msg.role,
      parts: msg.parts
    }));
    const latestMessage = contents[contents.length - 1].parts[0].text;

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(latestMessage);
    
    let rawText;
    try {
      rawText = result.response.text();
    } catch (e) {
      return res.json({ 
        reply: "I cannot fulfill this request as it violates safety guidelines regarding political or sensitive content.", 
        suggestedQuestions: ["How does voting work?", "What is the Election Commission?"] 
      });
    }

    // Safely extract JSON even if the AI wraps it in markdown formatting
    rawText = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    
    const data = JSON.parse(rawText);

    res.json(data);

  } catch (error) {
    console.error("Chat Error:", error);
    const isValidationErr = error instanceof z.ZodError;
    res.status(isValidationErr ? 400 : 500).json({ 
      error: isValidationErr ? error.message : "An internal server error occurred. Please try again later." 
    });
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

vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: {
    credential: vi.fn().mockReturnValue('MOCK_CREDENTIAL')
  },
  signInWithCredential: vi.fn().mockResolvedValue({
    user: { getIdToken: () => Promise.resolve('MOCK_NEW_TOKEN') }
  })
}));

describe('API Module', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn()
    };
  });

  it('should call backend API in guest mode', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ reply: 'Hello from AI', suggestedQuestions: [] })
    });

    const reply = await callGeminiAPI('Hi', [], {}, true);
    expect(reply.reply).toBe('Hello from AI');
    expect(fetch).toHaveBeenCalledWith('/api/chat', expect.any(Object));
  });

  it('should call backend API in authenticated mode', async () => {
    const mockAuth = {
      currentUser: {
        getIdToken: vi.fn().mockResolvedValue('MOCK_TOKEN')
      }
    };
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ reply: 'Auth AI Reply', suggestedQuestions: [] })
    });

    const reply = await callGeminiAPI('Hi', [], mockAuth, false);
    expect(reply.reply).toBe('Auth AI Reply');
    expect(fetch).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
      headers: expect.objectContaining({ 'Authorization': 'Bearer MOCK_TOKEN' })
    }));
  });

  it('should throw an offline error on network failure', async () => {
    fetch.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(callGeminiAPI('Hi', [], {}, true)).rejects.toThrow('Network error: Please check your internet connection and try again.');
  });

  it('should throw error if currentUser is missing in authenticated mode', async () => {
    const mockAuth = {
      currentUser: null
    };
    
    await expect(callGeminiAPI('Hi', [], mockAuth, false)).rejects.toThrow("Unauthorized: session expired");
  });

  it('should throw error on API failure', async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Too many requests' })
    });

    await expect(callGeminiAPI('Hi', [], {}, true)).rejects.toThrow('Too many requests');
  });
});

```

---

### client/src/js/auth.test.js
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signOut, initStorage } from './auth.js';

vi.mock('firebase/auth', () => ({
  signOut: vi.fn().mockResolvedValue(),
  getAuth: vi.fn()
}));

vi.mock('../../firebase.js', () => ({
  auth: {}
}));

describe('Auth Module', () => {
  let localStorage;

  beforeEach(() => {
    localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    };
    delete window.location;
    window.location = { href: '' };
  });

  it('should remove items on sign out', async () => {
    await signOut(localStorage);
    expect(localStorage.removeItem).toHaveBeenCalledWith('google_user_email');
    expect(localStorage.removeItem).toHaveBeenCalledWith('is_guest');
    expect(window.location.href).toBe('/');
  });

  it('should initialize storage values', () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'google_user_name') return 'Test User';
      if (key === 'google_user_email') return 'test@example.com';
      return null;
    });
    const user = initStorage(localStorage);
    expect(user.name).toBe('Test User');
    expect(user.email).toBe('test@example.com');
  });
});

```

---

### client/src/js/auth_adv.test.js
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { syncProfileToFirebase } from './auth.js';

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  getFirestore: vi.fn()
}));

vi.mock('../../firebase.js', () => ({
  db: {},
  auth: { currentUser: { email: 'user@example.com' } },
  analytics: {}
}));

describe('Auth Module Advanced', () => {
  let localStorage;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn()
    };
    
    // Mock DOM elements
    document.body.innerHTML = `
      <input id="userAge" value="30">
      <input id="userLocation" value="Berlin">
      <select id="userStatus"><option value="voted">voted</option></select>
    `;
    document.getElementById('userStatus').value = 'voted';
  });

  it('should debounce syncProfileToFirebase', async () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'is_guest') return null;
      return null;
    });

    // Removed mockAuth from call as per new signature
    syncProfileToFirebase({}, localStorage);
    syncProfileToFirebase({}, localStorage);
    
    const { setDoc } = await import('firebase/firestore');
    expect(setDoc).not.toHaveBeenCalled();
    
    await vi.runAllTimersAsync();
    expect(setDoc).toHaveBeenCalledTimes(1);
  });
});

```

---

### client/src/js/ui.test.js
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { translateUI, appendMessage, showTyping, hideTyping, autoResize, clearCache, appendChips } from './ui.js';

describe('UI Module', () => {
  beforeEach(() => {
    clearCache();
    document.body.innerHTML = `
      <div id="ui-subtitle"></div>
      <div id="chat"></div>
      <div id="welcome-banner"></div>
      <textarea id="userInput"></textarea>
    `;
  });

  it('should translate UI', () => {
    const strings = { en: { subtitle: 'Test Subtitle', inputPlaceholder: 'Ask...' } };
    translateUI('en', strings);
    expect(document.getElementById('ui-subtitle').textContent).toBe('Test Subtitle');
  });

  it('should append message and hide banner', () => {
    appendMessage('user', 'Hello');
    expect(document.getElementById('welcome-banner').style.display).toBe('none');
    expect(document.querySelector('.msg-row.user')).not.toBeNull();
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

  it('should render context-aware chips', () => {
    appendChips(['How do I register?', 'Next step?'], false, vi.fn());
    const chips = document.querySelectorAll('.chip');
    expect(chips.length).toBe(2);
    expect(chips[0].textContent).toBe('How do I register?');
    expect(chips[0].getAttribute('aria-label')).toBe('Ask: How do I register?');
  });
});

```

---

