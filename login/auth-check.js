import { auth } from "/script/firebase/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com7/firebasejs/10.7.1/firebase-auth.js";

// Funktion zum Überprüfen des Authentifizierungsstatus
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Weiterleitung geschützte Seite
        window.location.href = "puclic/summary_user.html";
    } else {
        console.log("Nicht eingeloggt");
    }
});