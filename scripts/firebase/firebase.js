import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

export const firebaseConfig = {
  apiKey: "AIzaSyCMfwkqntiepXstDBQzi42RSGVnwLuOqQc",
  authDomain: "join-ae525.firebaseapp.com",
  databaseURL: "https://join-ae525-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "join-ae525",
  storageBucket: "join-ae525.firebasestorage.app",
  messagingSenderId: "964887306998",
  appId: "1:964887306998:web:a0f66c2b30a9207a42c2d7",
  measurementId: "G-2PYNHVKRHH"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);

export const BASE_URL = app.options.databaseURL.endsWith("/")
  ? app.options.databaseURL
  : `${app.options.databaseURL}/`;
