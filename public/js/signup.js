/**
 * @file  Handles user registration including form validation,
 * Firebase authentication and contact persistence.
 *
 * @module signup
 */

/**
 *
 */
import { auth } from "./join/firebase.js";
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { pushContact } from '../../scripts/firebase/pushContact.js';

const signupName = document.getElementById('signupName');
const signupEmail = document.getElementById('loginEmail');
const signupPassword = document.getElementById('loginPassword');
const signupConfirmPassword = document.getElementById('signupConfirmPassword');
const termsCheckbox = document.getElementById('termsCheckbox');
const signupBtn = document.getElementById('signupBtn');
const signupForm = document.getElementById('signupForm');


/**
 * @event Eventlistener
 */
signupName.addEventListener('input', validateForm);
signupEmail.addEventListener('input', validateForm);
signupPassword.addEventListener('input', validateForm);
signupConfirmPassword.addEventListener('input', validateForm);
termsCheckbox.addEventListener('change', validateForm);
signupForm.addEventListener('submit', handleSignup);

/**
 * Validates the signup form inputs and enables or disables the submit button.
 *
 * @returns {void}
 */
function validateForm() {
  const nameFilled = signupName.value.trim() !== '';
  const emailFilled = signupEmail.value.trim() !== '';
  const passwordFilled = signupPassword.value !== '';
  const passwordsMatch = signupPassword.value === signupConfirmPassword.value && signupConfirmPassword.value !== '';
  const termsAccepted = termsCheckbox.checked;

  const formIsValid = nameFilled && emailFilled && passwordFilled && passwordsMatch && termsAccepted;
  signupBtn.disabled = !formIsValid;

  console.log({
    nameFilled,
    emailFilled,
    passwordFilled,
    passwordsMatch,
    termsAccepted
  });
}
/**
 * Handles the signup form submission.
 * Create a Firebase user and stores additional contact data.
 *
 * @async
 * @param {SubmitEvent} event - Form submit event
 * @returns {Promise<void>}
 */
async function handleSignup(event) {
  event.preventDefault();

  const email = signupEmail.value.trim();
  const password = signupPassword.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    const uid = userCredential.user.uid;

    /**
    * Contact data that will be stored in your database.
    * @type {{ uid: string, name: string, email: string, createdAT: number }}
    */
    const contactData = {
      uid: uid,
      name: signupName.value.trim(),
      email: email,
      createdAT: Date.now()
    };

    console.log('Contact-Daten vorbereitet:', contactData);

    await pushContact(contactData);
    console.log('Contact erfolgreich gespeichert');
    // signupMassegeTemplate();
    // signupForm.reset();


    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  } catch (error) {
    signupBtn.disabled = true;
    console.error('Fehler beim Speichern:', error);
  }
}
