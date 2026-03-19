let subtaskInput;
let subtaskActions;
let confirmSubtaskBtn;
let clearSubtaskBtn;
let subtaskList;

let subtasks = [];
let editingSubtaskIndex = -1;

/**
 * Initializes the subtask module with all required DOM elements.
 *
 * Stores references to the subtask UI elements
 * and registers the required event listeners.
 *
 * @function initSubtasks
 * @param {Object} elements - The DOM elements used by the subtask module.
 * @param {HTMLInputElement|null} elements.subtaskInput - The subtask text input.
 * @param {HTMLElement|null} elements.subtaskActions - The container for the subtask action buttons.
 * @param {HTMLButtonElement|null} elements.confirmSubtaskBtn - The confirm button for adding a subtask.
 * @param {HTMLButtonElement|null} elements.clearSubtaskBtn - The clear button for resetting the subtask input.
 * @param {HTMLElement|null} elements.subtaskList - The container for the rendered subtask list.
 * @returns {void}
 */
export function initSubtasks(elements) {
  subtaskInput = elements.subtaskInput;
  subtaskActions = elements.subtaskActions;
  confirmSubtaskBtn = elements.confirmSubtaskBtn;
  clearSubtaskBtn = elements.clearSubtaskBtn;
  subtaskList = elements.subtaskList;
  bindSubtaskEvents();
}

/**
 * Transforms the internal subtask array into a structured object
 * suitable for Firebase storage.
 *
 * Each subtask is converted into an object containing:
 * - a unique key (e.g. "Subtask1", "Subtask2")
 * - a boolean status (default: false)
 * - the subtask title
 *
 * Example output:
 * {
 *   Subtask1: { status: false, title: "First subtask" },
 *   Subtask2: { status: false, title: "Second subtask" }
 * }
 *
 * @function getSubtasks
 * @returns {Object<string, {status: boolean, title: string}>}
 * An object containing all subtasks formatted for Firebase.
 */
export function getSubtasks() {
  return subtasks.reduce((result, title, index) => {
    result[`Subtask${index + 1}`] = {
      status: false,
      title
    };
    return result;
  }, {});
}

/**
 * Clears all subtasks and resets the editing state.
 *
 * Re-renders the list and clears the input field.
 *
 * @function clearSubtasks
 * @returns {void}
 */
export function clearSubtasks() {
  subtasks = [];
  editingSubtaskIndex = -1;
  renderSubtasks();
  clearSubtaskInput();
}

/**
 * Registers all event listeners for the subtask UI.
 *
 * @function bindSubtaskEvents
 * @returns {void}
 */
function bindSubtaskEvents() {
  subtaskInput?.addEventListener('input', toggleSubtaskActions);
  subtaskInput?.addEventListener('keydown', handleSubtaskKeydown);
  confirmSubtaskBtn?.addEventListener('click', addSubtask);
  clearSubtaskBtn?.addEventListener('click', clearSubtaskInput);
  subtaskList?.addEventListener('click', handleSubtaskListClick);
}

/**
 * Handles the Enter key inside the subtask input.
 *
 * Prevents the default behavior and adds the current subtask.
 *
 * @function handleSubtaskKeydown
 * @param {KeyboardEvent} event - The keyboard event from the subtask input.
 * @returns {void}
 */
function handleSubtaskKeydown(event) {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  addSubtask();
}

/**
 * Shows or hides the subtask action buttons
 * depending on whether the input contains text.
 *
 * @function toggleSubtaskActions
 * @returns {void}
 */
function toggleSubtaskActions() {
  if (!subtaskActions || !subtaskInput) return;
  subtaskActions.classList.toggle('d_none', !subtaskInput.value.trim());
}

/**
 * Clears the subtask input and resets edit mode.
 *
 * @function clearSubtaskInput
 * @returns {void}
 */
function clearSubtaskInput() {
  if (!subtaskInput) return;
  subtaskInput.value = '';
  editingSubtaskIndex = -1;
  toggleSubtaskActions();
}

/**
 * Adds a new subtask to the list.
 *
 * @function saveNewSubtask
 * @param {string} value - The subtask text to add.
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
 * Saves a subtask either as a new entry
 * or as an edited existing entry.
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
 * Creates the text element for a rendered subtask item.
 *
 * @function createSubtaskText
 * @param {string} text - The subtask text.
 * @returns {HTMLSpanElement} The created subtask text element.
 */
function createSubtaskText(text) {
  const span = document.createElement('span');
  span.className = 'subtask-item-text';
  span.textContent = text;
  return span;
}

/**
 * Creates the action button container for one subtask item.
 *
 * Includes the edit and delete buttons.
 *
 * @function createSubtaskActions
 * @param {number} index - The index of the subtask.
 * @returns {HTMLDivElement} The created action container.
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
 * Builds one rendered subtask item.
 *
 * @function buildSubtaskItem
 * @param {string} text - The subtask text.
 * @param {number} index - The index of the subtask.
 * @returns {HTMLDivElement} The rendered subtask item element.
 */
function buildSubtaskItem(text, index) {
  const item = document.createElement('div');
  item.className = 'subtask-item';
  item.append(createSubtaskText(text), createSubtaskActions(index));
  return item;
}

/**
 * Renders all subtasks into the subtask list container.
 *
 * @function renderSubtasks
 * @returns {void}
 */
function renderSubtasks() {
  if (!subtaskList) return;
  subtaskList.innerHTML = '';
  subtasks.forEach((text, index) => subtaskList.appendChild(buildSubtaskItem(text, index)));
}

/**
 * Adds a new subtask or saves the currently edited subtask.
 *
 * Uses the current input value, updates the list,
 * re-renders the UI and clears the input afterward.
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
 * Sets the current edit index, shows the action buttons
 * and focuses the input field.
 *
 * @function editSubtask
 * @param {number} index - The index of the subtask to edit.
 * @returns {void}
 */
function editSubtask(index) {
  if (!subtaskInput) return;
  subtaskInput.value = subtasks[index] || '';
  editingSubtaskIndex = index;
  toggleSubtaskActions();
  subtaskInput.focus();
}

/**
 * Deletes a subtask by its index and re-renders the list.
 *
 * @function deleteSubtask
 * @param {number} index - The index of the subtask to delete.
 * @returns {void}
 */
function deleteSubtask(index) {
  subtasks = subtasks.filter((_, i) => i !== index);
  renderSubtasks();
}

/**
 * Handles clicks on edit and delete buttons inside the subtask list.
 *
 * Detects the clicked action using the data attributes
 * and forwards the action to the correct handler.
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