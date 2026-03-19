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
 * - priority button selection
 * - create task logic
 * - form reset behavior
 * - contact dropdown rendering
 * - multi-assignee selection
 * - subtask creation, editing and deletion
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
  const subtaskActions = document.getElementById('subtask_actions');
  const confirmSubtaskBtn = document.getElementById('confirm_subtask_btn');
  const clearSubtaskBtn = document.getElementById('clear_subtask_btn');
  const subtaskList = document.getElementById('subtask_list');
  const priorityButtons = document.querySelectorAll('.priority_button');

  let selectedPriority = null;
  let selectedAssignees = [];
  let currentContacts = {};
  let subtasks = [];
  let editingSubtaskIndex = -1;

  /**
   * Creates initials from a contact name.
   *
   * Uses the first character of up to two words and converts them to uppercase.
   *
   * @function getInitials
   * @param {string} name - The full contact name.
   * @returns {string} The generated initials.
   */
  function getInitials(name) {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  /**
   * Generates a numeric hash from a string value.
   *
   * @function hashString
   * @param {string} value - The string to hash.
   * @returns {number} A positive numeric hash.
   */
  function hashString(value) {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = value.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  }

  /**
   * Returns a stable avatar color based on a contact name.
   *
   * @function getAvatarColor
   * @param {string} name - The contact name.
   * @returns {string} A hex color value from the avatar color list.
   */
  function getAvatarColor(name) {
    return AVATAR_COLORS[hashString(name || '') % AVATAR_COLORS.length];
  }

  /**
   * Builds normalized contact data for dropdown rendering.
   *
   * @function getContactData
   * @param {string} id - The contact id.
   * @param {Object} contact - The contact object.
   * @param {string} [contact.name] - The display name of the contact.
   * @returns {{id: string, name: string, initials: string, avatarColor: string}} Normalized contact data.
   */
  function getContactData(id, contact) {
    const name = contact.name || `Contact (${id})`;
    return { id, name, initials: getInitials(name), avatarColor: getAvatarColor(name) };
  }

  /**
   * Checks whether a contact is currently selected.
   *
   * @function isSelected
   * @param {string} id - The contact id to check.
   * @returns {boolean} True if the contact is selected, otherwise false.
   */
  function isSelected(id) {
    return selectedAssignees.some((item) => item.id === id);
  }

  /**
   * Updates the hidden assigned-to input with selected contact names.
   *
   * Contact names are stored as a comma-separated string.
   *
   * @function updateAssignedInput
   * @returns {void}
   */
  function updateAssignedInput() {
    assignedInput.value = selectedAssignees.map((item) => item.name).join(', ');
  }

  /**
   * Renders the selected assignee avatars below the assigned-to field.
   *
   * @function renderSelectedAssignees
   * @returns {void}
   */
  function renderSelectedAssignees() {
    if (!selectedDisplay) return;
    selectedDisplay.innerHTML = selectedAssignees
      .map((item) => {
        return `<span class="contact_avatar" title="${item.name}" style="background-color: ${item.avatarColor}">${item.initials}</span>`;
      })
      .join('');
  }

  /**
   * Adds or removes a contact from the selected assignees list.
   *
   * After updating the selection, the hidden input and avatar display are refreshed.
   *
   * @function toggleAssignee
   * @param {{id: string, name: string, initials: string, avatarColor: string}} contactData - The contact to toggle.
   * @returns {void}
   */
  function toggleAssignee(contactData) {
    selectedAssignees = isSelected(contactData.id)
      ? selectedAssignees.filter((item) => item.id !== contactData.id)
      : [...selectedAssignees, contactData];
    updateAssignedInput();
    renderSelectedAssignees();
  }

  /**
   * Creates a checkbox element for a contact option.
   *
   * @function buildCheckbox
   * @param {boolean} checked - Whether the checkbox should be checked initially.
   * @returns {HTMLInputElement} The created checkbox element.
   */
  function buildCheckbox(checked) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'custom-select__checkbox';
    checkbox.checked = checked;
    return checkbox;
  }

  /**
   * Creates the main visual content for one contact option.
   *
   * @function buildOptionMain
   * @param {{name: string, initials: string, avatarColor: string}} data - Contact display data.
   * @returns {HTMLDivElement} The created option content element.
   */
  function buildOptionMain(data) {
    const main = document.createElement('div');
    main.className = 'custom-select__option-main';
    main.innerHTML = `
      <span class="contact_avatar" style="background-color: ${data.avatarColor}">${data.initials}</span>
      <span class="custom-select__option-label">${data.name}</span>
    `;
    return main;
  }

  /**
   * Toggles a contact option and synchronizes the checkbox state.
   *
   * @function syncOptionToggle
   * @param {{id: string, name: string, initials: string, avatarColor: string}} data - The contact data to toggle.
   * @param {HTMLInputElement} checkbox - The checkbox to synchronize.
   * @returns {void}
   */
  function syncOptionToggle(data, checkbox) {
    toggleAssignee(data);
    checkbox.checked = isSelected(data.id);
  }

  /**
   * Clears all selected assignees and refreshes the dropdown state.
   *
   * @function clearSelectedAssignees
   * @returns {void}
   */
  function clearSelectedAssignees() {
    selectedAssignees = [];
    updateAssignedInput();
    renderSelectedAssignees();
    populateAssignedToDropdown(currentContacts);
  }

  /**
   * Builds a selectable dropdown option for one contact.
   *
   * @function buildContactOptionElement
   * @param {string} id - The contact id.
   * @param {Object} contact - The contact object.
   * @returns {HTMLDivElement} The rendered contact option element.
   */
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

  /**
   * Sorts contact entries alphabetically by name.
   *
   * @function getSortedContacts
   * @param {Object<string, Object>} contacts - The contacts object from Firebase.
   * @returns {Array<[string, Object]>} Sorted contact entries.
   */
  function getSortedContacts(contacts) {
    return Object.entries(contacts || {}).sort(
      ([, a], [, b]) => (a.name || '').localeCompare(b.name || '')
    );
  }

  /**
   * Renders an empty-state message when no contacts are available.
   *
   * @function renderNoContacts
   * @returns {void}
   */
  function renderNoContacts() {
    const empty = document.createElement('div');
    empty.className = 'custom-select__empty';
    empty.textContent = 'No contacts found (add a contact first)';
    assignedOptions.appendChild(empty);
  }

  /**
   * Renders all contact options into the assigned-to dropdown.
   *
   * @function renderContactOptions
   * @param {Array<[string, Object]>} entries - Sorted contact entries.
   * @returns {void}
   */
  function renderContactOptions(entries) {
    entries.forEach(([id, contact]) => {
      assignedOptions.appendChild(buildContactOptionElement(id, contact));
    });
  }

  /**
   * Populates the assigned-to dropdown with contacts.
   *
   * Stores the current contact collection and renders all available options.
   *
   * @function populateAssignedToDropdown
   * @param {Object<string, Object>} contacts - The contacts object from Firebase.
   * @returns {void}
   */
  function populateAssignedToDropdown(contacts) {
    if (!assignedOptions || !assignedTrigger || !assignedInput) return;
    currentContacts = contacts || {};
    assignedOptions.innerHTML = '';
    const entries = getSortedContacts(currentContacts);
    if (entries.length === 0) return renderNoContacts();
    renderContactOptions(entries);
  }

  /**
   * Starts listening for contact changes in Firebase.
   *
   * @function trackContactsForUser
   * @param {string} userId - The current user's id.
   * @returns {void}
   */
  function trackContactsForUser(userId) {
    const contactsRef = ref(database, 'contacts');
    onValue(contactsRef, (snapshot) => {
      const contactsData = snapshot.val() || {};
      populateAssignedToDropdown(contactsData);
    });
  }

  /**
   * Closes the assigned-to dropdown menu.
   *
   * @function closeAssignedOptions
   * @returns {void}
   */
  function closeAssignedOptions() {
    assignedOptions?.classList.add('d_none');
  }

  /**
   * Toggles the assigned-to dropdown menu visibility.
   *
   * @function toggleAssignedOptions
   * @returns {void}
   */
  function toggleAssignedOptions() {
    if (!assignedOptions) return;
    assignedOptions.classList.toggle('d_none');
  }

  /**
   * Shows or hides the subtask action buttons depending on input content.
   *
   * @function toggleSubtaskActions
   * @returns {void}
   */
  function toggleSubtaskActions() {
    if (!subtaskActions || !subtaskInput) return;
    subtaskActions.classList.toggle('d_none', !subtaskInput.value.trim());
  }

  /**
   * Clears the subtask input field and resets edit mode.
   *
   * @function clearSubtaskInput
   * @returns {void}
   */
  function clearSubtaskInput() {
    subtaskInput.value = '';
    editingSubtaskIndex = -1;
    toggleSubtaskActions();
  }

  /**
   * Adds a new subtask to the subtask list.
   *
   * @function saveNewSubtask
   * @param {string} value - The new subtask text.
   * @returns {void}
   */
  function saveNewSubtask(value) {
    subtasks = [...subtasks, value];
  }

  /**
   * Updates an existing subtask at the current edit index.
   *
   * @function saveEditedSubtask
   * @param {string} value - The updated subtask text.
   * @returns {void}
   */
  function saveEditedSubtask(value) {
    subtasks[editingSubtaskIndex] = value;
    editingSubtaskIndex = -1;
  }

  /**
   * Saves a subtask either as new or as an edited entry.
   *
   * @function saveSubtaskValue
   * @param {string} value - The subtask text to save.
   * @returns {void}
   */
  function saveSubtaskValue(value) {
    if (editingSubtaskIndex > -1) return saveEditedSubtask(value);
    saveNewSubtask(value);
  }

  /**
   * Creates the text element for one subtask entry.
   *
   * @function createSubtaskText
   * @param {string} text - The subtask text.
   * @returns {HTMLSpanElement} The created text element.
   */
  function createSubtaskText(text) {
    const span = document.createElement('span');
    span.className = 'subtask-item-text';
    span.textContent = text;
    return span;
  }

  /**
   * Creates the action buttons for one subtask entry.
   *
   * @function createSubtaskActions
   * @param {number} index - The subtask index.
   * @returns {HTMLDivElement} The container holding edit and delete buttons.
   */
  function createSubtaskActions(index) {
    const actions = document.createElement('div');
    actions.className = 'subtask-item-actions';
    actions.innerHTML = `
      <button type="button" class="subtask-icon-btn" data-edit="${index}">✎</button>
      <button type="button" class="subtask-icon-btn" data-delete="${index}">🗑</button>
    `;
    return actions;
  }

  /**
   * Builds one rendered subtask list item.
   *
   * @function buildSubtaskItem
   * @param {string} text - The subtask text.
   * @param {number} index - The subtask index.
   * @returns {HTMLDivElement} The rendered subtask item.
   */
  function buildSubtaskItem(text, index) {
    const item = document.createElement('div');
    item.className = 'subtask-item';
    item.append(createSubtaskText(text), createSubtaskActions(index));
    return item;
  }

  /**
   * Renders all current subtasks below the input field.
   *
   * @function renderSubtasks
   * @returns {void}
   */
  function renderSubtasks() {
    if (!subtaskList) return;
    subtaskList.innerHTML = '';
    subtasks.forEach((text, index) => {
      subtaskList.appendChild(buildSubtaskItem(text, index));
    });
  }

  /**
   * Adds a new subtask or saves an edited subtask from the input field.
   *
   * @function addSubtask
   * @returns {void}
   */
  function addSubtask() {
    const value = subtaskInput?.value.trim();
    if (!value) return;
    saveSubtaskValue(value);
    renderSubtasks();
    clearSubtaskInput();
  }

  /**
   * Loads a subtask into the input field for editing.
   *
   * @function editSubtask
   * @param {number} index - The subtask index to edit.
   * @returns {void}
   */
  function editSubtask(index) {
    subtaskInput.value = subtasks[index] || '';
    editingSubtaskIndex = index;
    toggleSubtaskActions();
    subtaskInput.focus();
  }

  /**
   * Deletes a subtask by index and re-renders the subtask list.
   *
   * @function deleteSubtask
   * @param {number} index - The subtask index to delete.
   * @returns {void}
   */
  function deleteSubtask(index) {
    subtasks = subtasks.filter((_, i) => i !== index);
    renderSubtasks();
  }

  /**
   * Handles clicks on subtask edit and delete buttons.
   *
   * @function handleSubtaskListClick
   * @param {MouseEvent} event - The click event from the subtask list.
   * @returns {void}
   */
  function handleSubtaskListClick(event) {
    const editIndex = event.target.dataset.edit;
    const deleteIndex = event.target.dataset.delete;
    if (editIndex !== undefined) editSubtask(Number(editIndex));
    if (deleteIndex !== undefined) deleteSubtask(Number(deleteIndex));
  }

  /**
   * Resets the add-task form to its initial state.
   *
   * Clears form fields, selected priority, assignees and subtasks.
   *
   * @function clearAddTaskForm
   * @returns {void}
   */
  function clearAddTaskForm() {
    document.querySelector('.form_add_task')?.reset();
    document.querySelector('.select_add_task')?.reset();
    priorityButtons.forEach((button) => button.classList.remove('selected'));
    selectedPriority = null;
    subtasks = [];
    editingSubtaskIndex = -1;
    clearSelectedAssignees();
    renderSubtasks();
    clearSubtaskInput();
  }

  /**
   * Builds the task object from the current form values.
   *
   * @function buildTaskData
   * @returns {Object|null} The task data object, or null if the title is missing.
   */
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
      subtasks,
      status: 'todo',
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Submits a task to Firebase and redirects on success.
   *
   * @async
   * @function submitTask
   * @param {Object} taskData - The task data object to store.
   * @returns {Promise<void>}
   * @throws {Error} Rethrows any Firebase push error after logging it.
   */
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
    if (user) trackContactsForUser(user.uid);
  });

  if (auth.currentUser) {
    trackContactsForUser(auth.currentUser.uid);
  }

  priorityButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      priorityButtons.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedPriority = btn.value || btn.getAttribute('value') || btn.textContent.trim();
    });
  });

  if (subtaskInput) {
    subtaskInput.addEventListener('input', toggleSubtaskActions);
    subtaskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addSubtask();
      }
    });
  }

  if (confirmSubtaskBtn) {
    confirmSubtaskBtn.addEventListener('click', addSubtask);
  }

  if (clearSubtaskBtn) {
    clearSubtaskBtn.addEventListener('click', clearSubtaskInput);
  }

  if (subtaskList) {
    subtaskList.addEventListener('click', handleSubtaskListClick);
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