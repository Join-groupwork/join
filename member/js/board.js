import { loadTasks } from '/scripts/firebase/get-firebase.js';
import { getTaskOverlayTemplate, getEditTaskOverlayTemplate } from './member-templates.js';
import { ref, onValue, remove, update } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { database } from "../../scripts/firebase/firebase.js";
import { updateHTML,todos  } from './drag-n-drop.js';
import { initAssignees, trackContactsForUser, getAssignedNames } from './add-task-assignees.js';
import { initSubtasks, getSubtasks } from './add-task-subtasks.js';

export let tasks = {};


export async function initTasks() {
  tasks = await loadTasks();
}

/**
 * Syncs tasks and todos objects
 */
function syncTasksAndTodos() {
  Object.keys(tasks).forEach(taskId => {
    if (todos[taskId]) {
      todos[taskId] = { ...tasks[taskId] };
    }
  });
}

initTasks();

/**
 * References to the DOM containers (board columns) where tasks are rendered.
 *
 * Why this exists:
 * - You query the DOM *once* (instead of repeating `document.getElementById(...)` everywhere).
 * - Your code becomes cleaner: `columns.todo` is easier to read than `"todo"` strings everywhere.
 * - It centralizes the “IDs must exist” assumption in one place (good for debugging).
 *
 * Note: These can be `null` if the elements don’t exist in the current HTML page.
 *
 * @type {{
 *   todo: HTMLElement|null,
 *   inProgress: HTMLElement|null,
 *   awaitFeedback: HTMLElement|null,
 *   done: HTMLElement|null
 * }}
 */
const columns = {
  /** @type {HTMLElement|null} */ todo: document.getElementById('todo'),
  /** @type {HTMLElement|null} */ inProgress: document.getElementById('inProgress'),
  /** @type {HTMLElement|null} */ awaitFeedback: document.getElementById('awaitFeedback'),
  /** @type {HTMLElement|null} */ done: document.getElementById('done'),
};

/**
 * Fetches all tasks and renders them
 * based on their status.
 *
 * This function:
 * - Loads tasks from the Firebase
 * - Matches each task to the appropriate column
 * - Removes placeholder elements if present
 * - Appends the generated task card HTML to the column
 *
 * @async
 * @returns {Promise<void>}
 */

function openTaskOverlay(taskId) {
  const task = tasks[taskId];
  if (!task) return console.warn("Task nicht gefunden:", taskId);

  const overlayContainer = document.getElementById("overlay_container");

  overlayContainer.innerHTML = getTaskOverlayTemplate(
    taskId,
    task.category,
    task.title,
    task.description,
    task.due_date,
    task.priority,
    task.assigned_to,
    task.subtasks,
  );

  overlayContainer.classList.remove('d_none');
   setTimeout(() => {
    overlayContainer.classList.add('show');
  }, 10);

  overlayContainer.addEventListener('click', handleOverlayClick);
}
window.openTaskOverlay = openTaskOverlay;


function handleOverlayClick(event) {
  const overlayContainer = document.getElementById("overlay_container");
  if (event.target === overlayContainer) {
    closeTaskOverlay();
  }
}

function closeTaskOverlay() {
  const overlayContainer = document.getElementById("overlay_container");
  overlayContainer.classList.remove('show');
  overlayContainer.classList.add('d_none');
  overlayContainer.removeEventListener('click', handleOverlayClick);
}

window.closeTaskOverlay = closeTaskOverlay;


async function toggleCheckbox(img) {
  const taskId = img.dataset.taskId;
  const subtaskKey = img.dataset.subtaskKey;

  if (!taskId || !subtaskKey) return;

  try {
    const currentStatus = tasks[taskId]?.subtasks?.[subtaskKey]?.status || false;
    const newStatus = !currentStatus;

    await update(ref(database, `tasks/${taskId}/subtasks/${subtaskKey}`), {
      status: newStatus
    });

    if (tasks[taskId]?.subtasks?.[subtaskKey]) {
      tasks[taskId].subtasks[subtaskKey].status = newStatus;
    }

    if (todos[taskId]?.subtasks?.[subtaskKey]) {
      todos[taskId].subtasks[subtaskKey].status = newStatus;
    }

    img.src = newStatus
      ? "../assets/icons/checkbox/checkbox-icon-checked.svg"
      : "../assets/icons/checkbox/checkbox-icon unchecked.svg";

    updateHTML();
  } catch (error) {
    console.error("Error toggling subtask:", error);
  }
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("checkbox-icon")) {
    toggleCheckbox(e.target);
  }
});

async function deleteTask(taskId) {
  try {
    await remove(ref(database, `tasks/${taskId}`));
    delete todos[taskId];

    closeTaskOverlay();
    updateHTML();

  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

window.deleteTask = deleteTask;

/** editTask
 * @param {string} taskId
 * @param {Object} task - Task object
 */
function renderEditOverlay(taskId, task) {
  const overlayContainer = document.getElementById("overlay_container");
  overlayContainer.innerHTML = getEditTaskOverlayTemplate(
    taskId, task.category, task.title, task.description,
    task.due_date, task.priority, task.assigned_to, task.subtasks
  );
}


function setupPriorityButtons() {
  document.querySelectorAll('.add-task__priority-button').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.add-task__priority-button').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
}

/**
 * @returns {Object} Assignee state
  */
function initializeEditAssignees() {
  const assigneeState = initAssignees({
    assignedContainer: document.getElementById('edit_assigned_to'),
    assignedInput: document.getElementById('edit_assigned_to_input'),
    assignedTrigger: document.getElementById('edit_assigned_to_trigger'),
    assignedOptions: document.getElementById('edit_assigned_to_options'),
    selectedDisplay: document.getElementById('edit_selected_assignees_display')
  });
  trackContactsForUser(assigneeState);
  return assigneeState;
}

/**
 * Initializes the subtasks module for edit mode.
 * @param {HTMLElement} container - Overlay container
 * @returns {Object} Subtask state
 */
function initializeEditSubtasks(container) {
  return initSubtasks(container, {
    subtaskInput: document.getElementById('edit_subtask'),
    subtaskActions: document.getElementById('edit_subtask_actions'),
    confirmSubtaskBtn: document.getElementById('edit_confirm_subtask_btn'),
    clearSubtaskBtn: document.getElementById('edit_clear_subtask_btn'),
    subtaskList: document.getElementById('edit_subtask_list_new')
  });
}

/**
 * Opens the edit task overlay.
 * @param {string} taskId
 */
function editTask(taskId) {
  const task = tasks[taskId];
  if (!task) return console.warn("Task nicht gefunden:", taskId);

  renderEditOverlay(taskId, task);
  setupPriorityButtons();

  window.editAssigneeState = initializeEditAssignees();
  window.editSubtaskState = initializeEditSubtasks(document.getElementById("overlay_container"));
  window.currentTaskId = taskId;
}

window.editTask = editTask;

/**
 * Collects form data from edit overlay.
 * @returns {Object} Form data
 */
function collectEditFormData() {
  return {
    title: document.getElementById('edit_title').value,
    description: document.getElementById('edit_description').value,
    due_date: document.getElementById('edit_due_date').value,
    priority: document.querySelector('.add-task__priority-button.selected')?.dataset.priority || 'medium',
    assignedNames: window.editAssigneeState ? getAssignedNames(window.editAssigneeState) : {},
    newSubtasks: window.editSubtaskState ? getSubtasks(window.editSubtaskState) : {}
  };
}

/**
 * Builds the task update object.
 * @param {string} taskId
 * @param {Object} formData
 * @returns {Object} Update object
 */
function buildTaskUpdateObject(taskId, formData) {
  const updatedTask = {
    title: formData.title,
    description: formData.description,
    due_date: formData.due_date,
    priority: formData.priority
  };

  if (Object.keys(formData.assignedNames).length > 0) {
    updatedTask.assigned_to = formData.assignedNames;
  }

  const existingSubtasks = tasks[taskId]?.subtasks || {};
  const mergedSubtasks = { ...existingSubtasks, ...formData.newSubtasks };
  if (Object.keys(mergedSubtasks).length > 0) {
    updatedTask.subtasks = mergedSubtasks;
  }
  return updatedTask;
}

/**
 * Updates task in Firebase and local storage.
 * @param {string} taskId
 * @param {Object} updatedTask
 */
async function updateTaskInFirebase(taskId, updatedTask) {
  await update(ref(database, `tasks/${taskId}`), updatedTask);
  tasks[taskId] = { ...tasks[taskId], ...updatedTask };
}

/**
 * Refreshes board and shows updated task.
 * @param {string} taskId
 */
async function refreshBoardAndShowTask(taskId) {
  await initTasks();
  syncTasksAndTodos();
  updateHTML();
  openTaskOverlay(taskId);
}

/**
 * Saves the edited task.
 * @param {string} taskId
 */
async function saveEditedTask(taskId) {
  try {
    const formData = collectEditFormData();
    const updatedTask = buildTaskUpdateObject(taskId, formData);
    await updateTaskInFirebase(taskId, updatedTask);
    await refreshBoardAndShowTask(taskId);
  } catch (error) {
    console.error("Error saving task:", error);
  }
}

window.saveEditedTask = saveEditedTask;

/**
 * Deletes an existing subtask from a task.
 * @param {string} taskId
 * @param {string} subtaskKey
 */
async function deleteExistingSubtask(taskId, subtaskKey) {
  try {
    const task = tasks[taskId];
    if (!task || !task.subtasks) return;

    const updatedSubtasks = { ...task.subtasks };
    delete updatedSubtasks[subtaskKey];

    await update(ref(database, `tasks/${taskId}/subtasks`), updatedSubtasks);
    tasks[taskId].subtasks = updatedSubtasks;

    if (todos[taskId]) {
      todos[taskId].subtasks = updatedSubtasks;
    }

    updateHTML();
    editTask(taskId);
  } catch (error) {
    console.error("Error deleting subtask:", error);
  }
}

window.deleteExistingSubtask = deleteExistingSubtask;

/**
 * Creates an input element for editing a subtask.
 * @param {string} currentText
 * @returns {HTMLInputElement}
 */
function createSubtaskEditInput(currentText) {
  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentText;
  input.className = 'add-task__input';
  input.style.fontSize = '16px';
  input.style.marginBottom = '0';
  return input;
}

/**
 * Sets up event listeners for subtask edit
 * @param {HTMLInputElement} input
 * @param {string} taskId
 * @param {string} subtaskKey
 */
function setupSubtaskEditListeners(input, taskId, subtaskKey) {
  input.addEventListener('blur', () => saveSubtaskEdit(taskId, subtaskKey, input));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveSubtaskEdit(taskId, subtaskKey, input);
    if (e.key === 'Escape') editTask(taskId);
  });
}

/**
 * Enables editing mode for an existing subtask.
 * @param {string} taskId
 * @param {string} subtaskKey
 */
function editExistingSubtask(taskId, subtaskKey) {
  const textElement = document.getElementById(`subtask_text_${subtaskKey}`);
  if (!textElement) return;

  const input = createSubtaskEditInput(textElement.textContent);
  textElement.replaceWith(input);
  input.focus();
  input.select();
  setupSubtaskEditListeners(input, taskId, subtaskKey);
}

window.editExistingSubtask = editExistingSubtask;

/**
 * Saves the edited subtask
 * @param {string} taskId
 * @param {string} subtaskKey
 * @param {HTMLInputElement} input
 */
async function saveSubtaskEdit(taskId, subtaskKey, input) {
  const newText = input.value.trim();
  if (!newText) return editTask(taskId);

  try {
    await update(ref(database, `tasks/${taskId}/subtasks/${subtaskKey}`), {
      title: newText,
      status: tasks[taskId].subtasks[subtaskKey].status
    });

    tasks[taskId].subtasks[subtaskKey].title = newText;

    if (todos[taskId]?.subtasks?.[subtaskKey]) {
      todos[taskId].subtasks[subtaskKey].title = newText;
    }

    updateHTML();
    editTask(taskId);
  } catch (error) {
    console.error("Error saving subtask:", error);
  }
}



/* renderBoard(); */

