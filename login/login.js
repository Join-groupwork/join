/**
 * @file Handle authentication logic (email/password and anonymous login).
 *
 * Binds UI event listenerss after DOM is ready and provides exported helper functions for logging in with email/password or as an anonymous guest.
 *
 * @module join-login
 */
import { auth } from "../scripts/firebase/firebase.js";
import { signInWithEmailAndPassword, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


/**
 * Initializes login UI handlers once the DOM is loaded.
 *
 * Looks up required from elements and attaches click handlers:
 *  - Login button: validates input, signs in via Firabase Auth, redirects on success
 *  - Guest button: signs in anonymously, redirects on success
 *
 * @event DOMContentLoaded
 * @listens Document#DOMContentLoaded
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", initLoginPage);

function initLoginPage() {
  const elements = getLoginElements();
  syncSplashLogoTarget(elements);
  bindLoginButton(elements);
  bindGuestButton(elements);
}

function getLoginElements() {
  return {
    loginBtn: document.getElementById("loginBtn"),
    guestBtn: document.getElementById("guestBtn"),
    emailInput: document.getElementById("email"),
    passwordInput: document.getElementById("password"),
    splashLogo: document.querySelector(".logo-splash__img"),
    targetLogo: document.querySelector(".join__logo")
  };
}

function syncSplashLogoTarget(elements) {
  if (!elements.splashLogo || !elements.targetLogo) return;

  const { top, left, width } = elements.targetLogo.getBoundingClientRect();
  const root = document.documentElement;

  root.style.setProperty("--logo-target-top", `${top}px`);
  root.style.setProperty("--logo-target-left", `${left}px`);
  root.style.setProperty("--logo-target-width", `${width}px`);
}

function bindLoginButton(elements) {
  if (!elements.loginBtn) return;
  elements.loginBtn.addEventListener("click", (event) => {
    void handleLoginClick(event, elements);
  });
}

function bindGuestButton(elements) {
  if (!elements.guestBtn) return;
  elements.guestBtn.addEventListener("click", () => {
    void loginAsGuest();
  });
}

async function handleLoginClick(event, elements) {
  event.preventDefault();

  const email = elements.emailInput.value.trim();
  const password = elements.passwordInput.value;

  if (!hasLoginData(email, password)) return;
  await loginWithEmail(email, password);
}

function hasLoginData(email, password) {
  if (email && password) return true;
  alert("Check your email and password. Pleasy try again.");
  return false;
}


/**
 * Login as user with email and password.
 *
 * @param {string} email - Email adress for login
 * @param {string} password - Password for login
 * @returns {Promise<void>} Resolves when login flow is complete
 */
export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      window.location.href = "./member/summary.html";
    })
    .catch(error => {
      console.log("Login Fehlgeschlagen", error.message);
      alert("Login Fehlgeschlagen: " + error.message);
    });
}

/**
 * Login as guest without mail and password
 *
 * @returns {Promise<void>} Resolves when login flow is complete
 */
export function loginAsGuest() {
  return signInAnonymously(auth)
    .then(userCredential => {
      window.location.href = "./member/summary.html";
    })
    .catch(error => {
      console.error("Gast Login Fehlgeschlagen:", error.message);
      alert("Gast Login Fehlgeschlagen:" + error.message);
    });
}

