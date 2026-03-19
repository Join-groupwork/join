import { pushTask } from '../../scripts/firebase/push-task.js';
import { auth, database } from '../../scripts/firebase/firebase.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

const AVATAR_COLORS = [
  '#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF',
  '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E',
  '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B'
];

/**
 * Initializes the task creation page after the DOM is fully loaded.
 *
 * Sets up:
 * - Priority button selection handling
 * - Create task button logic (including validation and Firebase push)
 * - Cancel button navigation behavior
 * - Populating the "Assigned to" dropdown with existing contacts
 *
 * @event DOMContentLoaded
 */



document.addEventListener('DOMContentLoaded', () => {
  const createBtn = document.querySelector('.Create_button_add_task');
  const cancelBtn = document.querySelector('.clear_button_add_task');
  const titleInput = document.getElementById('title');
  const descInput = document.getElementById('description');
  const dueInput = document.getElementById('due_date');
  const assignedContainer = document.getElementById('assigned_to');
  const assignedInput = document.getElementById('assigned_to_input');
  const assignedTrigger = document.getElementById('assigned_to_trigger');
  const assignedOptions = document.getElementById('assigned_to_options');
  const selectedDisplay = document.getElementById('selected_assignees_display');
  const categorySelect = document.getElementById('category');
  const subtaskInput = document.getElementById('subtask');
  const priorityButtons = document.querySelectorAll('.priority_button');

  let selectedPriority = null;
  let selectedAssignees = [];
  let currentContacts = {};

  /**
   * Populates the "Assigned to" dropdown with contacts belonging to the current user.
   *
   * @param {Object} contacts - The contacts object from Firebase.
   */
  function getInitials(name) {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  function hashString(value) {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = value.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  }

  function getAvatarColor(name) {
    return AVATAR_COLORS[hashString(name || '') % AVATAR_COLORS.length];
  }

  function getContactData(id, contact) {
    const name = contact.name || `Contact (${id})`;
    return { id, name, initials: getInitials(name), avatarColor: getAvatarColor(name) };
  }

  function isSelected(id) {
    return selectedAssignees.some((item) => item.id === id);
  }

  function updateAssignedInput() {
    assignedInput.value = selectedAssignees.map((item) => item.name).join(', ');
  }

  function renderSelectedAssignees() {
    if (!selectedDisplay) return;
    selectedDisplay.innerHTML = selectedAssignees
      .map((item) => `<span class="contact_avatar" title="${item.name}" style="background-color: ${item.avatarColor}">${item.initials}</span>`)
      .join('');
  }

  function toggleAssignee(contactData) {
    selectedAssignees = isSelected(contactData.id)
      ? selectedAssignees.filter((item) => item.id !== contactData.id)
      : [...selectedAssignees, contactData];
    updateAssignedInput();
    renderSelectedAssignees();
  }

  function buildCheckbox(checked) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'custom-select__checkbox';
    checkbox.checked = checked;
    return checkbox;
  }

  function buildOptionMain(data) {
    const main = document.createElement('div');
    main.className = 'custom-select__option-main';
    main.innerHTML = `<span class="contact_avatar" style="background-color: ${data.avatarColor}">${data.initials}</span><span class="custom-select__option-label">${data.name}</span>`;
    return main;
  }

  function syncOptionToggle(data, checkbox) {
    toggleAssignee(data);
    checkbox.checked = isSelected(data.id);
  }

  function clearSelectedAssignees() {
    selectedAssignees = [];
    updateAssignedInput();
    renderSelectedAssignees();
    populateAssignedToDropdown(currentContacts);
  }

  // function setAssignedContact(name, initials, avatarColor) {
  //   assignedInput.value = name;
  //   assignedTrigger.innerHTML = `
  //     <span class="contact_avatar" style="background-color: ${avatarColor}">${initials}</span>
  //     ${name}
  //     <span class="custom-select__arrow">▾</span>
  //   `;
  //   assignedOptions.classList.add('d_none');
  // }

  function buildContactOptionElement(id, contact) {
    const data = getContactData(id, contact);
    const option = document.createElement('div');
    const main = buildOptionMain(data);
    const checkbox = buildCheckbox(isSelected(id));
    option.className = 'custom-select__option';
    option.append(main, checkbox);
    option.addEventListener('click', () => syncOptionToggle(data, checkbox));
    checkbox.addEventListener('click', (e) => e.stopPropagation());
    checkbox.addEventListener('change', () => toggleAssignee(data));
    return option;
  }

  function getSortedContacts(contacts) {
    return Object.entries(contacts || {}).sort(
      ([, a], [, b]) => (a.name || '').localeCompare(b.name || '')
    );
  }

  function renderNoContacts() {
    const empty = document.createElement('div');
    empty.className = 'custom-select__empty';
    empty.textContent = 'No contacts found (add a contact first)';
    assignedOptions.appendChild(empty);
  }

  function renderContactOptions(entries) {
    entries.forEach(([id, contact]) => {
      assignedOptions.appendChild(buildContactOptionElement(id, contact));
    });
  }

  function populateAssignedToDropdown(contacts) {
    if (!assignedOptions || !assignedTrigger || !assignedInput) return;
    currentContacts = contacts || {};
    assignedOptions.innerHTML = '';
    const entries = getSortedContacts(currentContacts);
    if (entries.length === 0) return renderNoContacts();
    renderContactOptions(entries);
  }

  /**
   * Starts listening to contact changes in Firebase and updates the dropdown.
   *
   * @param {string} userId
   */
  function trackContactsForUser(userId) {
    const contactsRef = ref(database, 'contacts');
    onValue(contactsRef, (snapshot) => {
      const contactsData = snapshot.val() || {};
      populateAssignedToDropdown(contactsData);
    });
  }

  function closeAssignedOptions() {
    assignedOptions?.classList.add('d_none');
  }

  function toggleAssignedOptions() {
    if (!assignedOptions) return;
    assignedOptions.classList.toggle('d_none');
  }

  document.addEventListener('click', (event) => {
    if (!assignedContainer) return;
    if (assignedContainer.contains(event.target)) return;
    closeAssignedOptions();
  });

  if (assignedTrigger) {
    assignedTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      toggleAssignedOptions();
    });
  }

  auth.onAuthStateChanged((user) => {
    if (user) {
      trackContactsForUser(user.uid);
    }
  });

  // If the user is already signed in before this script runs, ensure we still populate.
  if (auth.currentUser) {
    trackContactsForUser(auth.currentUser.uid);
  }


  /**
   * Handles priority button selection.
   *
   * Removes the "selected" class from all priority buttons,
   * assigns it to the clicked button and stores the selected value.
   *
   * @param {MouseEvent} e - The click event object.
   */

  // priorityButtons.forEach(btn => {
  //   btn.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     priorityButtons.forEach(b => b.classList.remove('selected'));
  //     btn.classList.add('selected');
  //     selectedPriority = btn.value || btn.getAttribute('value') || btn.textContent.trim();
  //   });
  // });

  // if (createBtn) {

  //   /**
  //    * Handles the task creation process.
  //    *
  //    * Validates input, constructs the task object,
  //    * sends it to Firebase using pushTask(),
  //    * and redirects to the board page on success.
  //    *
  //    * @async
  //    * @param {MouseEvent} e - The click event object.
  //    * @returns {Promise<void>}
  //    */

  //     createBtn.addEventListener('click', async (e) => {
  //       e.preventDefault();
  //       const title = titleInput?.value?.trim();
  //       if (!title) { alert('Title required'); return; }
  //       const taskData = {
  //         title,
  //         description: descInput?.value?.trim() || '',
  //         due_date: dueInput?.value || '',
  //         priority: selectedPriority || 'low',
  //         assigned_to: assignedSelect?.value || '',
  //         category: categorySelect?.value || '',
  //         subtask: subtaskInput?.value?.trim() || "",
  //         status: 'todo',
  //         createdAt: new Date().toISOString()
  //       };
  //       try {
  //         createBtn.disabled = true;
  //         const key = await pushTask(taskData);
  //         console.log('Pushed task, key:', key);
  //         alert('Task created successfully');
  //         window.location.href = './board.html';
  //       } catch (err) {
  //         console.error(err);
  //         alert('Failed to create task');
  //       } finally {
  //         createBtn.disabled = false;
  //       }
  //     });
  //   }

  //   if (cancelBtn) {

  //     /**
  //      * Handles cancel button click.
  //      *
  //      * Prevents default behavior and navigates back
  //      * to the previous page in browser history.
  //      *
  //      * @param {MouseEvent} e - The click event object.
  //      */

  //     cancelBtn.addEventListener('click', (e) => {
  //       e.preventDefault();
  //       window.history.back();
  //     });
  //   }
  // });


function clearAddTaskForm() {
  document.querySelector('.form_add_task')?.reset();
  document.querySelector('.select_add_task')?.reset();
  priorityButtons.forEach((button) => button.classList.remove('selected'));
  selectedPriority = null;
  clearSelectedAssignees();
}


  priorityButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      priorityButtons.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedPriority = btn.value || btn.getAttribute('value') || btn.textContent.trim();
    });
  });

  function buildTaskData() {
    const title = titleInput?.value?.trim();
    if (!title) return null;

    return {
      title,
      description: descInput?.value?.trim() || '',
      due_date: dueInput?.value || '',
      priority: selectedPriority || 'low',
      assigned_to: assignedInput?.value || '',
      category: categorySelect?.value || '',
      subtask: subtaskInput?.value?.trim() || '',
      status: 'todo',
      createdAt: new Date().toISOString()
    };
  }

  async function submitTask(taskData) {
    createBtn.disabled = true;
    try {
      const key = await pushTask(taskData);
      console.log('Pushed task, key:', key);
      alert('Task created successfully');
      window.location.href = './board.html';
    } catch (err) {
      console.error(err);
      alert('Failed to create task');
    } finally {
      createBtn.disabled = false;
    }
  }

  if (createBtn) {
    createBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const taskData = buildTaskData();
      if (!taskData) {
        alert('Title required');
        return;
      }
      await submitTask(taskData);
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      clearAddTaskForm();
    });
  }

});