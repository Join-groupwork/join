import { auth } from "/script/firebase/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com7/firebasejs/10.7.1/firebase-auth.js";

// Funktion zum Überprüfen des Authentifizierungsstatus
onAuthStateChanged(auth, (user) => {
  if (user.isAnonymous === false) {
    // Weiterleitung geschützte Seite
    window.location.href = "/member/summary-user.html";
  } if (user.isAnonymous === true) {
    window.location.href = "/member/summary-guest.html";
  } else {
    console.log("Nicht eingeloggt");
  }
});
