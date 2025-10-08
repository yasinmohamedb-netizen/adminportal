import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCgFYvI28awAPDGQq7fT34h1s2BkD8HvI4",
  authDomain: "healthmate-21117.firebaseapp.com",
  projectId: "healthmate-21117",
  storageBucket: "healthmate-21117.appspot.com",
  messagingSenderId: "932947283420",
  appId: "1:932947283420:web:90c58b64473a305e429319",
  measurementId: "G-N8QTVMEF87",
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
