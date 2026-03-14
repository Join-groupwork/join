/**
 * @file Member page bootstrapper: renders header/sidebar/task UI and wires up header menu + logout.
 *
 * This module initializes the member UI by injecting HTML templates into the page,
 * then triggers board rendering (currently via `updateHTML()` from the drag & drop module).
 *
 * DOM requirements (IDs must exist in the HTML):
 * - `header`       : container for the header template
 * - `sidebar`      : container for the sidebar template
 * - `add_task`     : container for the "add task" template
 * - `editC_overlay`: (optional) container for contact edit overlay
 * - `addC_overlay` : (optional) container for contact add overlay
 * - `headerMenue`  : profile/menu button in the header
 * - `headerMenueNav`: dropdown/navigation container toggled by profile button
 * - `logoutBtn`    : logout button
 *
 * External dependencies:
 * - Template functions from `member-templates.js`
 * - `updateHTML()` from `drag-n-drop.js`
 * - Firebase Auth instance `auth` and `signOut()`
 *
 * @module member-ui
 */
import { getHeaderTemplate, getSidebarTemplate, getTaskTemplate, getEditOverlayTemplate, getAddOverlayTemplate, generateTodosHTML } from './member-templates.js';
import { updateHTML } from './drag-n-drop.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "../../scripts/firebase/firebase.js";

init();


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
      window.location.href = "../index.html"; // target page after Logout
    } catch (error) {
      console.error("Logout Fehlgeschlagen:", error.message);
      alert("Logout fehlgeschlagen");
    }
  })
});



/**
 * Triggers the board rendering.
 *
 * Currently delegates to `updateHTML()` in `drag-n-drop.js`, which renders the
 * board columns based on the current in-memory tasks.
 *
 * @async
 * @returns {Promise<void>}
 */
async function renderBoard() {
  updateHTML();
}
