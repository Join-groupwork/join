/**
 * @file HTML template factory functions for member pages.
 *
 * Provides functions that return HTML strings for commonly used UI parts:
 * header, sidebar, add-task form, contact overlays, signup message, and board task cards.
 *
 * @module member-templates
 */

/**
 * Task categories supported by the board UI.
 * Used for CSS class naming (e.g. `task__category--user-story`).
 *
 * @typedef {"user-story" | "technical-task" | string} Category
 */

/**
 * Priority values supported by the board UI.
 * Used for icon naming (e.g. `/assets/icons/urgent-prio-icon.svg`).
 *
 * @typedef {"low" | "medium" | "urgent" | string} Priority
 */

/**
 * Generates the header HTML for member pages.
 *
 * Includes:
 * - Help link
 * - Profile button with a dropdown menu (Legal Notice / Privacy Policy / Logout)
 *
 * DOM hooks created by this template:
 * - `#headerMenue` (toggle button)
 * - `#headerMenueNav` (dropdown container)
 * - `#logoutBtn` (logout trigger)
 *
 * @returns {string} HTML string representing the member header.
 */
export function getHeaderTemplate() {
  return `
        <header>
          <div class="topbar-left f-s-20">Kanban Project Management Tool</div>
          <div class="topbar-right">
              <a href="./help.html"class="help-circle" title="Help">?</a>
              <div id="headerMenue" class="profile">
                  SM
                  <nav id="headerMenueNav" class="header-menue-nav bg-menue color-menue d_none">
                      <ul>
                          <a href="./legal-notice-user.html">Legal Notice</a>
                      </ul>
                      <ul>
                          <a href="./privacy-policy-user.html">Privacy Policy</a>
                      </ul>
                      <ul>
                          <a id="logoutBtn">
                              Log out
                          </a>
                      <ul/>
                  </nav>
              </div>
          </div>
        </header>
      `;
};


/**
 * Generates the sidebar HTML for member pages.
 *
 * Includes:
 * - Logo
 * - Navigation links (Summary / Add Task / Board / Contacts)
 * - Footer links (Privacy Policy / Legal Notice)
 *
 * @returns {string} HTML string representing the member sidebar.
 */
export function getSidebarTemplate() {
  return `
      <div class="logo">
        <img src="../assets/img/logo-bright.svg" alt="" >
      </div>

      <nav class="nav">
        <a class="nav-item" href="./summary.html"><img src="../assets/icons/side-menu/summary-icon.svg" alt="Summary" class="nav-icon">Summary</a>
        <a class="nav-item" href="./add-task.html"><img src="../assets/icons/side-menu/add-task-icon.svg" alt="Add Task" class="nav-icon">Add Task</a>
        <a class="nav-item" href="./board.html"><img src="../assets/icons/side-menu/board-icon.svg" alt="Board" class="nav-icon">Board</a>
        <a class="nav-item" href="./contacts.html"><img src="../assets/icons/side-menu/contacts-icon.svg" alt="Contacts" class="nav-icon">Contacts</a>
      </nav>

      <div class="footer">
        <a href="./privacy-policy-user.html">Privacy Policy</a>
        <a href="./legal-notice-user.html">Legal Notice</a>
      </div>
    `;
};

// FIXME Line 129 - 131: icons in assets folder wrong. We musst change to correct icons or rename icons to BEM.
/**
 * Generates the "Add Task" form HTML.
 *
 * NOTE:
 * This function only returns markup. Event handling (submit, priority button selection,
 * form validation, etc.) should be implemented in the page/controller script.
 *
 * @returns {string} HTML string representing the add-task form section.
 */
export function getTaskTemplate() {
  return `
     <section class="overlay_add_task">
        <button class="add-task-close-btn" type="button" aria-label="Close">
          <img src="../assets/icons/close-icon.svg" alt="">
        </button>
        <h1 class="h1_add_task">Add Task</h1>
            <section class="section_add_task">

            <section>
                <form class="form_add_task">
                    <label for="title">Title*</label>
                    <input class="input_add_task" type="text" id="title" name="title" required placeholder="Enter a title">

                    <label for="description">Description</label>
                    <textarea class="textarea_add_task" id="description" name="description" required placeholder="Enter a Description"></textarea>

                    <label for="due_date">Due date*</label>
                    <input class="input_add_task" type="date" id="due_date" name="due_date" required placeholder="dd/mm/yyyy">
                </form>
            </section>
            <hr class="hr_add_task">
            <form class="select_add_task">
                <section class="section_priority">
                    <label for="priority">Priority</label>
                    <div id="priority" class="priority" name="priority">
                        <button class="priority_button" value="urgent">Urgent <img src="../assets/icons/urgent-prio-icon.svg" alt=""></button>
                        <button class="priority_button" value="medium">Medium <img src="../assets/icons/medium-prio-icon.svg" alt=""></button>
                        <button class="priority_button" value="low">Low <img src="../assets/icons/low-prio-icon.svg" alt=""></button>
                    </div>
                </section>

                <label for="">Assigned to</label>
                <select class="input_add_task margin_bottom_add_task" id="assigned_to" name="assigned_to" required>
                    <option value="select_contact" disabled selected>Select contacts to assign</option>
                </select>

                <label for="">Category</label>
                <select class="input_add_task margin_bottom_add_task" id="category" name="category" required placeholder="">
                    <option value="select_task_category">Select task category</option>
                    <option value="technical-task">Technical Task</option>
                    <option value="user-story">User Story</option>
                </select>

                <label for="">Subtasks</label>
                <input class="input_add_task" type="text" id="subtask" name="subtask" placeholder="Add new subtask">
            </form>
        </section>
        <section class="section_add_task_button">
            <button class="clear_button_add_task" type="button">Cancel <img src="../assets/icons/close-icon.svg" alt=""></button>
            <button class="Create_button_add_task" type="submit">Create Task <img src="../assets/icons/check-icon-white.svg" alt=""></button>
        </section>
    </section>
    `;
};

// contact overlays einbinden --->id="editC_overlay" oder id="addC_overlay" in den <body> einfügen,
// (siehe contact_add_overlay.html/contact_edit_overlay.html <-- können danach gelöscht werden)
// je nachdem welches overlay gebraucht wird --- ansonsten bis auf css fertig
/**
 * Generates the contact edit overlay HTML.
 *
 * Intended to be injected into a container element like `#editC_overlay`.
 *
 * @returns {string} HTML string representing the edit-contact overlay.
 */

// CHECK Line 192: Why not with pseudoclass ::after?
/**
 * Generates the contact add overlay HTML.
 *
 * Intended to be injected into a container element like `#addC_overlay`.
 *
 * @returns {string} HTML string representing the add-contact overlay.
 */
export function getAddOverlayTemplate() {
  return `
     <main class="addContact_overlay">
          <section class="overlay_add_contact">

            <div class="overlay_add_contact_left">
                <img class="join_logo_overlay" src="../../assets/img/logo-bright.svg" alt="Join Logo">
                <div>
                <h2 class="heading_add_contact">Add Contact</h2>
                <p>Tasks are better with a team!</p>
                <img class="h2_underline" style="margin: unset; height: unset; width: 90px;" src="../../assets/icons/underline-blue.svg" alt="">
                </div>
            </div>

            <div class="overlay_add_contact_right">

                <div class="close_overlay_icon_container">
                    <img class="close_overlay_icon" src="../../assets/icons/close-icon.svg" alt="Close Overlay Icon" onclick="hideAddContactOverlay()">
                </div>
                <div class="addContact_form_container">

                    <div>
                        <img class="overlay_avatar" src="../../assets/icons/contact-icon.svg" alt="Contact Icon">
                    </div>
                    <form class="form_add_contact" id="add_contact_form">
                        <input type="text" id="contact_name" name="contact_name" class="input_add_contact" required>
                        <input type="email" id="contact_email" name="contact_email" class="input_add_contact" required>
                        <input type="tel" id="contact_phone" name="contact_phone" class="input_add_contact">
                    </form>
                </div>

                <div class="buttons_add_contact">
                    <button type="button" class="btn_save_contact" onclick="hideAddContactOverlay()">Cancel <img src="../../assets/icons/close-icon.svg" alt="Close Icon"></button>
                    <button type="submit" form="add_contact_form" class="btn_cancel_contact">Create contact <img src="../../assets/icons/check-icon-white.svg" alt="Check Icon"></button>
                </div>

            </div>

        </section>

    </main>
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
    `;
};


/**
 * Generates a task card HTML string for the board (drag-and-drop).
 *
 * NOTE:
 * - `category` is used to build the CSS class name `task__category--${category}`
 * - `priority` is used to build the icon path `/assets/icons/${priority}-prio-icon.svg`
 *
 * @param {string} id - Task ID (used as DOM element `id` and for drag & drop).
 * @param {string} title - Task title.
 * @param {Category} category - Task category label.
 * @param {string} description - Task description.
 * @param {Priority} priority - Task priority label.
 * @returns {string} HTML string representing the task card.
 */
export function generateTodosHTML(id, title, category, description, priority) {
  const categoryLabel =
    category === "user-story"
      ? "User Story"
      : category === "technical-task"
      ? "Technical Task"
      : category;

  return `
            <div class="task__card" id="${id}" draggable="true">
              <span class="task__category--${category}">${categoryLabel}</span><br>
              <h4 class="task__title">${title}</h4><br>
              <p class="task__text">${description}</p><br>
              <div class="task__bar">
                <progress></progress>
              </div><br>
              <div class="task__footer">
                <div>users</div>
                <img src="../assets/icons/${priority}-prio-icon.svg" alt="">
              </div>
            </div>
          `;
};

/**
 * Two show contact details overlay.
 *
 * @param {string} contact - Name frome Contact
 * @param {string} initials - Initials from Contact Name
 * @param {string} bgColor - Background Color for Avatar
 * @param {number} phone - Phonenumber from Contact
 * @returns {string} - HTML string representing the contact details
 */
export function getActiveContactTemplate(contact, initials, bgColor, phone) {
  return `
    <section class="contact_detail_card contact_detail_card--enter">
      <div class="contact_detail_header">
        <div class="contact_avatar contact_avatar--large" style="background-color:${bgColor}">
          ${initials}
        </div>
        <div>
          <h2 class="contact_detail_name">${contact.name || ''}</h2>
          <div class="contact_detail_actions">
            <button type="button" class="link_btn" onclick="editContact('${contact.id}')">
              <img src="../../assets/icons/pencil-icon.svg" alt="Pencil icon to edit contact details"><span>Edit</span>
            </button>

            <button type="button" class="link_btn" onclick="deleteContact('${contact.id}')">
              <img src="../../assets/icons/trash-icon.svg" alt="Trash can icon to delete contact"><span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      <h3 class="contact_detail_subtitle">Contact Information</h3>

      <div class="contact_detail_info">
        <strong>Email</strong>
        <a href="mailto:${contact.email || ''}">${contact.email || ''}</a>
      </div>

      <div class="contact_detail_info">
        <strong>Phone</strong>
        <a href="tel:${phone}">${phone}</a>
      </div>
    </section>
  `;
}

/**
 * Show the overlay to editing contact details.
 *
 * @param {string} contactId
 * @param {string} contact
 * @param {string} initials
 * @param {string} color
 * @returns {string} - HTML string representing the contact editing overlay.
 */
export function getEditOverlayTemplate(contactId, contact, initials, color) {
  return `
    <section class="overlay_add_contact" onclick="event.stopPropagation()">
      <div class="overlay_add_contact_left">
        <img class="join_logo_overlay" src="../../assets/img/logo-bright.svg" alt="Join Logo">
        <h2 class="heading_add_contact">Edit Contact</h2>
        <img class="h2_underline" src="../../assets/icons/underline-blue.svg" alt="">
      </div>

      <div class="overlay_add_contact_right">
       <div class="close_overlay_icon_container">
                    <img class="close_overlay_icon" src="../../assets/icons/close-icon.svg" alt="Close Overlay Icon" onclick="closeEditOverlay()">
                </div>
        <div class="addContact_form_container">
            <div class="contact_avatar contact_avatar--large edit_overlay_avatar overlay_avatar" style="background-color:${color}">
                ${initials}
            </div>
          <form class="form_add_contact" id="edit_contact_form">
            <input type="text" id="contact_name" class="input_add_contact" placeholder="Name" value="${contact.name || ''}" required>
            <input type="email" id="contact_email" class="input_add_contact" placeholder="Email" value="${contact.email || ''}" required>
            <input type="tel" id="contact_phone" class="input_add_contact" placeholder="Phone" value="${contact.phone || ''}">
            <div class="buttons_add_contact">
              <button type="button" class="btn_save_contact" onclick="deleteContact('${contactId}')">Delete</button>
              <button type="submit" class="btn_cancel_contact">Save<img src="../../assets/icons/check-icon-white.svg" alt=""></button>
            </div>
          </form>
        </div>
      </div>
    </section>
  `;
}

