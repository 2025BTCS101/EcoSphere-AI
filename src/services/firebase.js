import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

let app = null;
let db = null;
let auth = null;
let isFirebaseConnected = false;

export function initFirebase(config) {
  if (!config || !config.apiKey || config.apiKey === '' || !config.projectId || config.projectId === '') {
    isFirebaseConnected = false;
    return { isConnected: false };
  }
  
  try {
    if (getApps().length === 0) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }
    db = getFirestore(app);
    auth = getAuth(app);
    isFirebaseConnected = true;
    console.log("Firebase initialized successfully in Cloud Mode.");
    return { app, db, auth, isConnected: true };
  } catch (error) {
    console.error("Firebase init failed:", error);
    isFirebaseConnected = false;
    return { isConnected: false, error };
  }
}

export function getFirebaseInstances() {
  return { app, db, auth, isFirebaseConnected };
}
