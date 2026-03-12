/**
 * @file Handles authentication state and user redirections.
 *
 * @module member-auth-check
 */
import { auth } from "/scripts/firebase/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/**
 * Listens for Firebase authentication state changes
 * and redirects depending on user type.
 *
 * @param {Object | null} user - Firebase user object or null if not logges in
 * @property {boolean} [isAnonymous] - true if user is logged in as guest
 * @property {string} [uid] - user's unique id
 * @returns {void}
 */
onAuthStateChanged(auth, (user) => {
  if (user.isAnonymous === false) {
    // Weiterleitung geschützte Seite
    window.location.href = "/member/summary.html";
  } if (user.isAnonymous === true) {
    window.location.href = "/member/summary.html";
  } else {
    console.log("Nicht eingeloggt");
  }
});
