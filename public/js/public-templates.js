/**
 * @file HTML template factory functions for public pages.
 *
 * Provides template helpers that return HTML strings for shared public UI parts:
 * header, sidebar, and a signup success message.
 *
 * @module public-templates
 */

/**
 * Generates the header HTML for public pages.
 *
 * Includes:
 * - Help icon (currently just a div, no link)
 * - Profile button with a dropdown menu (Legal Notice / Privacy Policy / Logout)
 *
 * DOM hooks created by this template:
 * - `#headerMenue` (toggle button)
 * - `#headerMenueNav` (dropdown container)
 * - `#logoutBtn` (logout trigger)
 *
 * @returns {string} HTML string representing the public header.
 */
export function getHeaderTemplate() {
  return `
        <div class="topbar-left">Kanban Project Management Tool</div>
        <div class="topbar__mobile">
          <img class="topbar__mobile--logo" src="../assets/img/logo-dark.svg" alt="Logo">
        </div>
      `;

};


/**
 * Generates the sidebar HTML for public pages.
 *
 * Includes:
 * - Logo
 * - Navigation links (Summary / Add Task / Board / Contacts)
 * - Footer/legal links (Privacy Policy / Legal Notice)
 *
 * @returns {string} HTML string representing the public sidebar.
 */
export function getSidebarTemplate() {
  return `
      <div class="logo">
        <img src="../assets/img/logo-bright.svg" alt="" srcset="">
      </div>

      <nav class="nav">
        <a href="../index.html" class="nav-item"><img src="../assets/icons/side-menu/login-icon.svg" alt="Summary" class="nav-icon">Log In</a>
      </nav>

      <div class="legal">
        <a href="./privacy-policy-public.html">Privacy Policy</a>
        <a href="./legal-notice-public.html">Legal Notice</a>
      </div>
    `;
};


/**
 * Generates a success message shown after a successful signup.
 *
 * @returns {string} HTML string representing a signup success message.
 */
export function signupMassegeTemplate() {
  return `
        <aside class="signup-massege-box">
            <p>
                You Signed Up successfully
            </p>
        </aside>
    `
};

export function getPublicFooterTemplate() {
  return `
    <footer class="footer__responsive">
    <a href="../../index.html" class="button button__mobile">
      <img class="icon__mobile" src="../../assets/icons/menu/login__mobile.svg" alt="login mobile">
    </a>

    <a href="../privacy-policy-public.html" class="button button__mobile">
      <img class="icon__mobile" src="../../assets/icons/menu/privacy__mobile.svg alt="privacy policy mobile">
    </a>
    <a href="../legal-notice-public.html" class="button button__mobile">
      <img class="icon__mobile" src="../../assets/icons/menu/legal__mobile.svg" alt="legal notice mobile">
    </a>

  </footer>
  `
}
