/**
 * @file Handles user registration including form validation,
 * Firebase authentication, and contact persistence.
 *
 * @module signup
 */

import { auth } from "../../scripts/firebase/firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { pushContact } from "../../scripts/firebase/push-contact.js";

/**
 * Name input field of the signup form.
 *
 * @type {HTMLInputElement|null}
 */
const signupName = document.getElementById('signupName');

/**
 * Email input field of the signup form.
 *
 * @type {HTMLInputElement|null}
 */
const signupEmail = document.getElementById('loginEmail');

/**
 * Password input field of the signup form.
 *
 * @type {HTMLInputElement|null}
 */
const signupPassword = document.getElementById('loginPassword');

/**
 * Password confirmation input field of the signup form.
 *
 * @type {HTMLInputElement|null}
 */
const signupConfirmPassword = document.getElementById('signupConfirmPassword');

/**
 * Terms acceptance checkbox of the signup form.
 *
 * @type {HTMLInputElement|null}
 */
const termsCheckbox = document.getElementById('termsCheckbox');

/**
 * Submit button of the signup form.
 *
 * @type {HTMLButtonElement|null}
 */
const signupBtn = document.getElementById('signupBtn');

/**
 * Signup form element.
 *
 * @type {HTMLFormElement|null}
 */
const signupForm = document.getElementById('signupForm');

/**
 * Registers the signup form validation and submit event handlers.
 *
 * @returns {void}
 */
signupName?.addEventListener('input', validateForm);
signupEmail?.addEventListener('input', validateForm);
signupPassword?.addEventListener('input', validateForm);
signupConfirmPassword?.addEventListener('input', validateForm);
termsCheckbox?.addEventListener('change', validateForm);
signupForm?.addEventListener('submit', handleSignup);

/**
 * Validates the signup form and enables or disables the submit button.
 *
 * @returns {void}
 */
function validateForm() {
  if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword || !termsCheckbox || !signupBtn) return;

  const nameFilled = signupName.value.trim() !== '';
  const emailFilled = signupEmail.value.trim() !== '';
  const passwordFilled = signupPassword.value !== '';
  const passwordsMatch = signupPassword.value === signupConfirmPassword.value && signupConfirmPassword.value !== '';
  const termsAccepted = termsCheckbox.checked;
  const formIsValid = nameFilled && emailFilled && passwordFilled && passwordsMatch && termsAccepted;
  signupBtn.disabled = !formIsValid;
}

/**
 * Returns a user-friendly signup error message for a Firebase auth error code.
 *
 * @param {string} errorCode - The Firebase auth error code.
 * @returns {string} Human-readable error message.
 */
function getSignupErrorMessage(errorCode) {
  const messages = {
    "auth/email-already-in-use": "Diese E-Mail ist bereits registriert. Bitte logge dich ein oder nutze eine andere E-Mail.",
    "auth/invalid-email": "Bitte gib eine gültige E-Mail-Adresse ein.",
    "auth/weak-password": "Das Passwort ist zu schwach (mindestens 6 Zeichen).",
    "auth/network-request-failed": "Netzwerkfehler. Bitte prüfe deine Verbindung und versuche es erneut."
  };

  return messages[errorCode] || "Registrierung fehlgeschlagen. Bitte erneut versuchen.";
}

/**
 * Handles signup form submission.
 *
 * Creates a Firebase user account and stores the related contact data.
 *
 * @async
 * @param {SubmitEvent} event - The signup form submit event.
 * @returns {Promise<void>} Resolves when the signup flow is complete.
 */
async function handleSignup(event) {
  event.preventDefault();

  if (!signupName || !signupEmail || !signupPassword || !signupBtn) return;

  const email = signupEmail.value.trim();
  const password = signupPassword.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    /**
     * Contact data stored in the database for the newly registered user.
     *
     * @type {{ uid: string, name: string, email: string, createdAT: number }}
     */
    const contactData = {
      uid: uid,
      name: signupName.value.trim(),
      email: email,
      createdAT: Date.now()
    };

    await pushContact(contactData);

    setTimeout(() => {
      window.location.href = "/index.html";
    }, 1500);
  } catch (error) {
    signupBtn.disabled = false;
    console.error("Fehler beim Speichern:", error.code, error.message);
    alert(getSignupErrorMessage(error.code));
  }
}
