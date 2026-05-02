import { auth } from '../../firebase.js';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) throw new Error("VITE_GOOGLE_CLIENT_ID is not set");

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to parse JWT:", error);
    return null;
  }
}

function handleCredentialResponse(response) {
  const payload = parseJwt(response.credential);
  if (!payload) {
    alert("Received an invalid authentication token. Please try again.");
    return;
  }

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
