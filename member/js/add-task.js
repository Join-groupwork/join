import { pushTask } from '../../scripts/firebase/push-task.js';
import { auth } from '../../scripts/firebase/firebase.js';
import {
  initAssignees,
  trackContactsForUser,
  getAssignedNames,
  clearSelectedAssignees
} from './add-task-assignees.js';
import {
  initSubtasks,
  getSubtasks,
  clearSubtasks
} from './add-task-subtasks.js';

/**
 * Initializes the Add Task page after the DOM is fully loaded.
 *
 * Sets up:
 * - Assignee module (contacts dropdown & selection)
 * - Subtask module (create, edit, delete)
 * - Firebase auth listener for loading contacts
 * - Priority button handling
 * - Create and cancel button behavior
 *
 * @event DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
  const createBtn = document.querySelector('.Create_button_add_task');
  const cancelBtn = document.querySelector('.clear_button_add_task');
  const titleInput = document.getElementById('title');
  const descInput = document.getElementById('description');
  const dueInput = document.getElementById('due_date');
  const categorySelect = document.getElementById('category');
  const priorityButtons = document.querySelectorAll('.priority_button');

  const requiredFields = [titleInput, dueInput];
  setupRequiredFieldValidation(requiredFields);

  let selectedPriority = null;

  initAssignees({
    assignedContainer: document.getElementById('assigned_to'),
    assignedInput: document.getElementById('assigned_to_input'),
    assignedTrigger: document.getElementById('assigned_to_trigger'),
    assignedOptions: document.getElementById('assigned_to_options'),
    selectedDisplay: document.getElementById('selected_assignees_display')
  });

  initSubtasks({
    subtaskInput: document.getElementById('subtask'),
    subtaskActions: document.getElementById('subtask_actions'),
    confirmSubtaskBtn: document.getElementById('confirm_subtask_btn'),
    clearSubtaskBtn: document.getElementById('clear_subtask_btn'),
    subtaskList: document.getElementById('subtask_list')
  });

  auth.onAuthStateChanged((user) => {
    if (user) trackContactsForUser(user.uid);
  });

  if (auth.currentUser) {
    trackContactsForUser(auth.currentUser.uid);
  }

  priorityButtons.forEach((btn) => {
    btn.addEventListener('click', (event) =>
      selectPriority(event, btn, priorityButtons)
    );
  });

  createBtn?.addEventListener('click', async (event) => {
    event.preventDefault();

    const isTitleValid = validateRequiredField(titleInput);
    const isDueValid = validateRequiredField(dueInput);

    if (!isTitleValid || !isDueValid) return;

    const taskData = buildTaskData();
    if (!taskData) return;

    await submitTask(taskData, createBtn);
  });

  cancelBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    clearAddTaskForm(priorityButtons);
  });

  /**
   * Handles priority button selection.
   *
   * Removes the "selected" class from all buttons,
   * sets it on the clicked button and updates the selected priority value.
   *
   * @function selectPriority
   * @param {MouseEvent} event - The click event.
   * @param {HTMLButtonElement} button - The clicked button.
   * @param {NodeListOf<HTMLButtonElement>} buttons - All priority buttons.
   * @returns {void}
   */
  function selectPriority(event, button, buttons) {
    event.preventDefault();
    buttons.forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
    selectedPriority =
      button.value ||
      button.getAttribute('value') ||
      button.textContent.trim();
  }

  /**
   * Resets the entire add-task form.
   *
   * Clears:
   * - form inputs
   * - selected priority
   * - selected assignees
   * - subtasks
   *
   * @function clearAddTaskForm
   * @param {NodeListOf<HTMLButtonElement>} buttons - All priority buttons.
   * @returns {void}
   */
  function clearAddTaskForm(buttons) {
    document.querySelector('.form_add_task')?.reset();
    document.querySelector('.select_add_task')?.reset();
    buttons.forEach((button) => button.classList.remove('selected'));
    selectedPriority = null;
    clearSelectedAssignees();
    clearSubtasks();

    clearFieldError(titleInput);
    clearFieldError(dueInput);
  }

  /**
   * Builds the task object from current form values.
   *
   * Includes:
   * - title
   * - description
   * - due date
   * - priority
   * - assigned contacts
   * - category
   * - subtasks
   * - status
   * - creation timestamp
   *
   * @function buildTaskData
   * @returns {Object|null} The task data object, or null if required data is missing.
   */
  function buildTaskData() {
    const title = titleInput?.value?.trim();
    const dueDate = dueInput?.value || '';

    if (!title || !dueDate) return null;

    return {
      title,
      description: descInput?.value?.trim() || '',
      due_date: dueDate,
      priority: selectedPriority || 'low',
      assigned_to: getAssignedNames(),
      category: categorySelect?.value || '',
      subtasks: getSubtasks(),
      status: 'todo',
      createdAt: new Date().toISOString()
    };
  }
});

/**
 * Validates a required form field.
 *
 * Adds an error class and shows the related error message
 * when the field is empty. Removes the error state when valid.
 *
 * @function validateRequiredField
 * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} input - The field to validate.
 * @returns {boolean} True if the field is valid, otherwise false.
 */
function validateRequiredField(input) {
  const formField = input.closest('.form-field');
  if (!formField) return true;

  const isEmpty = input.value === '';

  if (isEmpty) {
    input.classList.add('input-error');
    formField.classList.add('error');
    return false;
  }

  input.classList.remove('input-error');
  formField.classList.remove('error');
  return true;
}

/**
 * Removes the visual error state from a field.
 *
 * @function clearFieldError
 * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} input - The field to reset.
 * @returns {void}
 */
function clearFieldError(input) {
  const formField = input.closest('.form-field');
  input.classList.remove('input-error');
  formField?.classList.remove('error');
}

/**
 * Sets up validation listeners for required fields.
 *
 * Validates fields on blur and removes the error state
 * while typing or changing the value.
 *
 * @function setupRequiredFieldValidation
 * @param {Array<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>} fields - Required fields.
 * @returns {void}
 */
function setupRequiredFieldValidation(fields) {
  fields.forEach((field) => {
    field?.addEventListener('blur', () => {
      validateRequiredField(field);
    });

    field?.addEventListener('input', () => {
      if (field.classList.contains('input-error')) {
        validateRequiredField(field);
      }
    });

    field?.addEventListener('change', () => {
      if (field.classList.contains('input-error')) {
        validateRequiredField(field);
      }
    });
  });
}

/**
 * Submits a task to Firebase and handles UI feedback.
 *
 * Disables the create button during submission,
 * pushes the task to the database,
 * and redirects to the board page on success.
 *
 * @async
 * @function submitTask
 * @param {Object} taskData - The task object to store.
 * @param {HTMLButtonElement} createBtn - The create button element.
 * @returns {Promise<void>}
 * @throws {Error} Throws if Firebase push fails.
 */
async function submitTask(taskData, createBtn) {
  createBtn.disabled = true;
  try {
    const key = await pushTask(taskData);
    console.log('Pushed task, key:', key);
    alert('Task created successfully');
    window.location.href = './board.html';
  } catch (error) {
    console.error(error);
    alert('Failed to create task');
  } finally {
    createBtn.disabled = false;
  }
}