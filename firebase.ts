
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  TwitterAuthProvider,
  sendPasswordResetEmail
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAomglf0z4GEdFV8YQ8jrW-OwKlqzvG7g4",
  authDomain: "student-housing-ea907.firebaseapp.com",
  projectId: "student-housing-ea907",
  storageBucket: "student-housing-ea907.firebasestorage.app",
  messagingSenderId: "645350531563",
  appId: "1:645350531563:web:0931cd5782879f3339b9ae"
};

const app = initializeApp(firebaseConfig);

// Export instances using standard modular API
export const db = getFirestore(app);
export const auth = getAuth(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
export const twitterProvider = new TwitterAuthProvider();

// Profile Helpers
export const saveUserProfile = async (uid: string, data: any) => {
  const userRef = doc(db, "users", uid);
  const profileData = {
    ...data,
    uid,
    updatedAt: serverTimestamp(),
  };
  await setDoc(userRef, profileData, { merge: true });
  localStorage.setItem('currentUser', JSON.stringify(profileData));
  return profileData;
};

export const getUserProfile = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    localStorage.setItem('currentUser', JSON.stringify(data));
    return data;
  }
  return null;
};

export const sendPasswordResetEmailWithSettings = async (email: string) => {
  const actionCodeSettings = {
    url: window.location.origin + '/signin?passwordReset=success',
    handleCodeInApp: true,
  };
  return sendPasswordResetEmail(auth, email, actionCodeSettings);
};
