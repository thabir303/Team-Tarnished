import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
};

// const firebaseConfig = {
//   apiKey: "AIzaSyDYdA6-jbo7hb5zoWCHdCoC6zfxNA9gNJU",
//   authDomain: "bitfest-7c910.firebaseapp.com",
//   projectId: "bitfest-7c910",
//   storageBucket: "bitfest-7c910.firebasestorage.app",
//   messagingSenderId: "1029466686954",
//   appId: "1:1029466686954:web:6c1dd195a6e2adddfc9e93"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
