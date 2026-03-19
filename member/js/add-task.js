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
 * - Create task button logic
 * - Cancel button reset behavior
 * - Contact dropdown rendering
 * - Multi-assignee selection
 * - Subtask creation, editing and deletion
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

  function getInitials(name) {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
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
      .map((item) => {
        return `<span class="contact_avatar" title="${item.name}" style="background-color: ${item.avatarColor}">${item.initials}</span>`;
      })
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
    main.innerHTML = `
      <span class="contact_avatar" style="background-color: ${data.avatarColor}">${data.initials}</span>
      <span class="custom-select__option-label">${data.name}</span>
    `;
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

  function toggleSubtaskActions() {
    if (!subtaskActions || !subtaskInput) return;
    subtaskActions.classList.toggle('d_none', !subtaskInput.value.trim());
  }

  function clearSubtaskInput() {
    subtaskInput.value = '';
    editingSubtaskIndex = -1;
    toggleSubtaskActions();
  }

  function saveNewSubtask(value) {
    subtasks = [...subtasks, value];
  }

  function saveEditedSubtask(value) {
    subtasks[editingSubtaskIndex] = value;
    editingSubtaskIndex = -1;
  }

  function saveSubtaskValue(value) {
    if (editingSubtaskIndex > -1) return saveEditedSubtask(value);
    saveNewSubtask(value);
  }

  function createSubtaskText(text) {
    const span = document.createElement('span');
    span.className = 'subtask-item-text';
    span.textContent = text;
    return span;
  }

  function createSubtaskActions(index) {
    const actions = document.createElement('div');
    actions.className = 'subtask-item-actions';
    actions.innerHTML = `
      <button type="button" class="subtask-icon-btn" data-edit="${index}">✎</button>
      <button type="button" class="subtask-icon-btn" data-delete="${index}">🗑</button>
    `;
    return actions;
  }

  function buildSubtaskItem(text, index) {
    const item = document.createElement('div');
    item.className = 'subtask-item';
    item.append(createSubtaskText(text), createSubtaskActions(index));
    return item;
  }

  function renderSubtasks() {
    if (!subtaskList) return;
    subtaskList.innerHTML = '';
    subtasks.forEach((text, index) => {
      subtaskList.appendChild(buildSubtaskItem(text, index));
    });
  }

  function addSubtask() {
    const value = subtaskInput?.value.trim();
    if (!value) return;
    saveSubtaskValue(value);
    renderSubtasks();
    clearSubtaskInput();
  }

  function editSubtask(index) {
    subtaskInput.value = subtasks[index] || '';
    editingSubtaskIndex = index;
    toggleSubtaskActions();
    subtaskInput.focus();
  }

  function deleteSubtask(index) {
    subtasks = subtasks.filter((_, i) => i !== index);
    renderSubtasks();
  }

  function handleSubtaskListClick(event) {
    const editIndex = event.target.dataset.edit;
    const deleteIndex = event.target.dataset.delete;
    if (editIndex !== undefined) editSubtask(Number(editIndex));
    if (deleteIndex !== undefined) deleteSubtask(Number(deleteIndex));
  }

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