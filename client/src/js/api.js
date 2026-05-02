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
