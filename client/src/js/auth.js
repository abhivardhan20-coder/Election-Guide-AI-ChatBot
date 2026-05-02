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

export async function syncProfileToFirebase(db, auth, localStorage) {
  if (!auth.currentUser || localStorage.getItem('is_guest')) return;
  
  const email = auth.currentUser.email; 
  
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
  }, 1000); 
}

export const signOut = async (localStorage) => {
  try {
    await firebaseSignOut(auth);
    localStorage.clear();
    window.location.href = '/';
  } catch (error) {
    console.error("Sign Out Error:", error);
  }
};
