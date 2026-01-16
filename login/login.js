import { auth } from "/scripts/firebase/firebase.js";
import { signInWithEmailAndPassword, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

console.log("Auth object:", auth);
if (location.protocol === 'https:') {
  console.log("Seite läuft über HTTPS ✅");
} else {
  console.log("Seite läuft NICHT über HTTPS ❌");
}

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const guestBtn = document.getElementById("guestBtn");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  loginBtn.addEventListener("click", async () => {
    event.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Check your email and password. Pleasy try again.");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Login erforlgreich:", userCredential.user);
      window.location.href = "/member/summary_user.html"; // target page after login
    } catch (error) {
      console.error("Login Fehlgeschlagen:", error.message);
      alert("Login fehlgeschlagen");
    }
    console.log("LOGIN CLICK");
    console.log("Email:", email);
    console.log("Password:", password);
  })

  guestBtn.addEventListener("click", async () => {
    try {
      const userCredential = await signInAnonymously(auth);
      console.log("GUEST LOGIN CLICK");
      window.location.href = "/member/summary_guest.html"; // target page after login
    } catch (error) {
      console.error(error.message);
      alert("Gast-Login fehlgeschlagen");
    }
  });

})

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

