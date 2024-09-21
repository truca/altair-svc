import { initializeApp } from "firebase/app";

export const firebaseConfig = {
  apiKey: "AIzaSyCIFDKxVLH1MbrFgGpevZCNO3N0-6TEirs",
  authDomain: "tripdivider.firebaseapp.com",
  projectId: "tripdivider",
  storageBucket: "tripdivider.appspot.com",
  messagingSenderId: "678866553615",
  appId: "1:678866553615:web:600ee06811b14d436fcc7a",
};

export const app = initializeApp(firebaseConfig);
