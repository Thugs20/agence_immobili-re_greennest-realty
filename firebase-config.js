// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDb7y807LAXmV2ST_EdA_L-LdBcbc6SKN8",
  authDomain: "green-nest-realty-immobilier.firebaseapp.com",
  projectId: "green-nest-realty-immobilier",
  storageBucket: "green-nest-realty-immobilier.firebasestorage.app",
  messagingSenderId: "1037762102556",
  appId: "1:1037762102556:web:f78e8d720783bbbdf426d9"
};

export const app = initializeApp(firebaseConfig);