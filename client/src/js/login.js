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
  // Save user metadata, but NOT the raw ID token in localStorage
  localStorage.setItem('google_user_name', payload.name);
  localStorage.setItem('google_user_email', payload.email);
  localStorage.setItem('google_user_picture', payload.picture);
  // Redirect to app - Firebase will handle token management
  window.location.href = '/app.html';
}

function handleGuest() {
  localStorage.setItem('google_user_name', 'Guest User');
  localStorage.setItem('google_user_email', 'guest@example.com');
  localStorage.setItem('google_user_picture', '');
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
