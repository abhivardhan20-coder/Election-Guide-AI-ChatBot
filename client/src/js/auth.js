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
