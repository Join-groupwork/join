/**
 * @file Member page bootstrapper: renders header, sidebar and task UI,
 * then initializes the board and wires up header menu + logout.
 *
 * This module injects shared HTML templates into the page and starts
 * board rendering via `initBoard()` from `board.js`.
 *
 * DOM requirements (IDs must exist in the HTML):
 * - `header`        : container for the header template
 * - `sidebar`       : container for the sidebar template
 * - `add_task`      : container for the "add task" template
 * - `editC_overlay` : optional container for contact edit overlay
 * - `addC_overlay`  : optional container for contact add overlay
 * - `headerMenue`   : profile/menu button in the header
 * - `headerMenueNav`: dropdown container toggled by profile button
 * - `logoutBtn`     : logout button
 *
 * External dependencies:
 * - Template functions from `member-templates.js`
 * - `initBoard()` from `board.js`
 * - Firebase Auth instance `auth` and `signOut()`
 *
 * @module member-ui
 */
import { getHeaderTemplate, getSidebarTemplate, getTaskTemplate, getEditOverlayTemplate } from './member-templates.js';
import { initBoard } from './board.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "../../scripts/firebase/firebase.js";

init();


async function renderBoard() {
  await initBoard();
}

/**
 * Entry point for module initialization.
 * Renders all UI parts in sequence.
 *
 * @async
 * @returns {Promise<void>}
 */
async function init() {
  await render();
  // renderBoard();
};


/**
 * Renders all static UI sections and the board.
 *
 * @async
 * @returns {Promise<void>}
 */
async function render() {
  await renderHeader();
  await renderSidebar();

  // only attempt to render the add‑task button if the placeholder exists
  if (document.getElementById('add_task')) {
    await renderAddTask();
  }

  // renderContactAddOverlay();   <-- Aktivieren, um das Overlay zum Hinzufügen von Kontakten anzuzeigen
  // renderContactEditOverlay(); Contact
  await renderBoard();
};


/**
 * Injects the header template into `#header`.
 *
 * @returns {void}
 */
function renderHeader() {
  const headerRef = document.getElementById('header');
  if (headerRef) {
    headerRef.innerHTML = getHeaderTemplate();
  } else {
    console.error('Header-Element nicht gefunden!');
  }
};


/**
 * Injects the sidebar template into `#sidebar`.
 *
 * @returns {void}
 */
function renderSidebar() {
  const sidebarRef = document.getElementById('sidebar');
  if (sidebarRef) {
    sidebarRef.innerHTML = getSidebarTemplate();
  } else {
    console.error('Sidebar-Element nicht gefunden!');
  }
};



/**
 * Injects the add-task template into `#add_task`.
 *
 * @returns {void}
 */
function renderAddTask() {
  const addTaskRef = document.getElementById('add_task');
  if (addTaskRef) {
    addTaskRef.innerHTML = getTaskTemplate();
  } else {
    console.error('Add Task-Element nicht gefunden!');
  }
};


/**
 * Injects the contact edit overlay template into `#editC_overlay`.
 *
 * @returns {void}
 */
function renderContactEditOverlay() {
  const editContactRef = document.getElementById('editC_overlay');
  if (editContactRef) {
    editContactRef.innerHTML = getEditOverlayTemplate();
  } else {
    console.error('ContactOverlay-Element nicht gefunden!');
  }
};



/**
 * Registers UI event listeners after the DOM is ready:
 * - Toggle header dropdown menu
 * - Sign out user and redirect to index page
 *
 * @event DOMContentLoaded
 * @listens Document#DOMContentLoaded
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', () => {
  const profileBtn = document.getElementById('headerMenue');
  const logoutBtn = document.getElementById('logoutBtn');
  const headerMenueNav = document.getElementById('headerMenueNav');
  profileBtn.addEventListener('click', () => {
    headerMenueNav.classList.toggle('d_none');
  })
  logoutBtn.addEventListener('click', () => {
    try {
      const userCredential = signOut(auth);
      console.log("Logout erfolgreich:", userCredential.user);
      window.location.href = "./index.html"; // target page after Logout
    } catch (error) {
      console.error("Logout Fehlgeschlagen:", error.message);
      alert("Logout fehlgeschlagen");
    }
  })
});
