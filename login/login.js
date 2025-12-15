import { auth } from "../firebase.js";
import { signInWithEmailAndPassword, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// email/password login
export function loginWithEmail(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            console.log("Login erfolgreich:", userCredential.user);
            window.location.href = "board.html";
        })
        .catch(error => {
            console.log("Login Fehlgeschlagen", error.message);
            alert("Login Fehlgeschlagen: " + error.message);
        });
}

//guest.login
export function loginAsGuest() {
    signInAnonymously(auth)
        .then(userCredential => {
            console.log("Gast eingeloggt:", userCredential.user);
            window.location.href = "board.html";
        })
        .catch(error => {
            console.error("Gast Login Fehlgeschlagen:", error.message);
            alert("Gast Login Fehlgeschlagen:" + error.message);
        });
}

document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("loginBtn");
    const guestBtn = document.getElementById("guestBtn");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    loginBtn.addEventListener("click", () => {
        const email = emailInput.value;
        const password = passwordInput.value;

        console.log("LOGIN CLICK");
        console.log("Email:", email);
        console.log("Password:", password);
    })

    guestBtn.addEventListener("click", () => {
        console.log("GUEST LOGIN CLICK");
    });

})