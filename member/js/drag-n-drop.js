/**
 * @file Provides basic Kanban board rendering + drag-and-drop handling for tasks ("todos").
 *
 * This module:
 * - Keeps a temporary in-memory `todos` object (placeholder until Firebase is connected)
 * - Renders tasks into the four board columns (todo / in-progress / await-feedback / done)
 * - Toggles column placeholders when a column has no tasks
 * - Implements drag & drop using document-level event listeners
 *
 * DOM expectations:
 * - Columns with IDs: `todo`, `inProgress`, `awaitFeedback`, `done`
 * - Drop zones with class `.task__area` and `data-status` values matching todo.subtask
 * - Placeholder element inside each `.task__area`: `.task__area--placeholder`
 * - Task cards have class `.task__card` and an `id` that matches the todo key
 *
 * @module drag-n-drop
 */
import { database } from '../../scripts/firebase/firebase.js';
import { loadTasks } from '../../scripts/firebase/get-firebase.js';
import { generateTodosHTML } from './member-templates.js';
import { getInitials, getAvatarColor } from './contacts-render.js';
import { ref, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/**
 * Possible board states.
 * @typedef {"todo" | "in-progress" | "await-feedback" | "done"} SubtaskStatus
 */

/**
 * Possible task categories.
 * @typedef {"user-story" | "technical-task"} Category
 */

/**
 * Possible priority values.
 * @typedef {"low" | "medium" | "urgent"} Priority
 */


let activeSearchTerm = ''; // INFO This is currently only used in the search function
/**
 * Represents a board task.
 *
 * @typedef {Object} Todo
 * @property {string} title - Task title.
 * @property {string} description - Task description.
 * @property {string} date - Due date (YYYY-MM-DD) or empty string.
 * @property {Priority} priority - Task priority level.
 * @property {string} assignedTo - Person(s) assigned to this task (currently unused).
 * @property {Category} category - Task category.
 * @property {SubtaskStatus} status - Current board column/status.
 */


/**
 * Task collection indexed by id.
 * NOTE: Placeholder data until Firebase is connected.
 *
 * @type {Record<string, Todo>}
 */
export let todos = {};

/**
 * ID (key in {@link todos}) of the currently dragged task card.
 * Set on `dragstart`, consumed on `drop`.
 *
 * @type {string|undefined}
 */
let currentDraggedElement;

/**
 *
 */
async function initBoard() {
  try {
    todos = await loadTasks();
    updateHTML();
  } catch (error) {
    console.error('Fehler bei Laden der Tasks:', error);
  }
}

/**
 * Handles the upload to firebase after switch category.
 *
 * @param {string} taskId - ID from task
 * @param {string} newStatus - Status from task
 */
export async function updateTaskStatus(taskId, newStatus) {
  await update(ref(database, `tasks/${taskId}`), {
    status: newStatus,
  });
}

/**
 * Calculates subtask progress.
 * @param {Object} subtasks
 * @returns {string} HTML for progress bar
 */
function calculateSubtaskProgress(subtasks = {}) {
  const subtaskArray = Object.values(subtasks);
  const totalSubtasks = subtaskArray.length;
  if (totalSubtasks === 0) return '';

  const completedSubtasks = subtaskArray.filter(s => s.status === true || s.completed === true).length;
  const progressPercent = (completedSubtasks / totalSubtasks) * 100;

  return `
    <div class="task__progress">
      <div class="task__progress--bar">
        <div class="task__progress--fill" style="width: ${progressPercent}%"></div>
      </div>
      <span class="task__progress--text">${completedSubtasks}/${totalSubtasks} Subtasks</span>
    </div>`;
}

/**
 * Generates assignee avatars HTML.
 * @param {Object|Array|string} assigned_to
 * @returns {string} HTML for avatars
 */
function generateAssigneeAvatars(assigned_to = {}) {
  let assigneeArray = [];

  if (assigned_to && typeof assigned_to === 'object' && !Array.isArray(assigned_to)) {
    assigneeArray = Object.values(assigned_to);
  } else if (Array.isArray(assigned_to)) {
    assigneeArray = assigned_to;
  } else if (typeof assigned_to === 'string' && assigned_to.trim()) {
    assigneeArray = assigned_to.split(',').map(s => s.trim());
  }

  return assigneeArray
    .slice(0, 3)
    .map(contact => {
      const name = typeof contact === 'string' ? contact : (contact?.name || '');
      if (!name) return '';
      const initials = getInitials(name);
      const color = getAvatarColor(name);
      return `<div class="task__assignee--avatar" style="background-color: ${color}">${initials}</div>`;
    })
    .filter(html => html)
    .join('');
}


/**
 * Re-renders all board columns and updates placeholder visibility.
 *
 * @export
 * @returns {void}
 */
export async function updateHTML() {
  // if this page doesn’t have a todo column we’re not on the board,
  // so skip all DOM updates to avoid null errors
  if (!document.getElementById('todo')) return;

  updateTodo();
  updateInProgress();
  updateAwaitFeedback();
  updateDone();
  togglePlaceholder();
};


/**
 * Renders tasks with {@link Todo.subtask} === `"todo"` into the `#todo` column.
 *
 * @private
 * @returns {void}
 */
function updateTodo() {
  const container = document.getElementById('todo');
  if (!container) return;
  container.innerHTML = '';
  for (const [id, element] of Object.entries(todos)) {
    if (element.status === 'todo' && matchesSearch(element)) {
      const progressHTML = calculateSubtaskProgress(element.subtasks);
      const avatarsHTML = generateAssigneeAvatars(element.assigned_to);
      container.innerHTML += generateTodosHTML(id, element.title, element.category, element.description, element.priority, progressHTML, avatarsHTML);
    }
  }
};


/**
 * Renders tasks with {@link Todo.subtask} === `"in-progress"` into the `#inProgress` column.
 *
 * @private
 * @returns {void}
 */
function updateInProgress() {
  document.getElementById('inProgress').innerHTML = '';
  for (const [id, element] of Object.entries(todos)) {
    if (element.status === 'in-progress' && matchesSearch(element)) {
      const progressHTML = calculateSubtaskProgress(element.subtasks);
      const avatarsHTML = generateAssigneeAvatars(element.assigned_to);
      document.getElementById('inProgress').innerHTML += generateTodosHTML(id, element.title, element.category, element.description, element.priority, progressHTML, avatarsHTML);
    }
  }
};


/**
 * Renders tasks with {@link Todo.subtask} === `"await-feedback"` into the `#awaitFeedback` column.
 *
 * @private
 * @returns {void}
 */
function updateAwaitFeedback() {
  document.getElementById('awaitFeedback').innerHTML = '';
  for (const [id, element] of Object.entries(todos)) {
    if (element.status === 'await-feedback' && matchesSearch(element)) {
      const progressHTML = calculateSubtaskProgress(element.subtasks);
      const avatarsHTML = generateAssigneeAvatars(element.assigned_to);
      document.getElementById('awaitFeedback').innerHTML += generateTodosHTML(id, element.title, element.category, element.description, element.priority, progressHTML, avatarsHTML);
    }
  }
};


/**
 * Renders tasks with {@link Todo.subtask} === `"done"` into the `#done` column.
 *
 * @private
 * @returns {void}
 */
function updateDone() {
  document.getElementById('done').innerHTML = '';
  for (const [id, element] of Object.entries(todos)) {
    if (element.status === 'done' && matchesSearch(element)) {
      const progressHTML = calculateSubtaskProgress(element.subtasks);
      const avatarsHTML = generateAssigneeAvatars(element.assigned_to);
      document.getElementById('done').innerHTML += generateTodosHTML(id, element.title, element.category, element.description, element.priority, progressHTML, avatarsHTML);
    }
  }
};


/**
 * Shows/hides the placeholder inside each `.task__area` depending on whether
 * at least one task exists for that column.
 *
 * Uses `.task__area[data - status]` to match against {@link Todo.status}.
 *
 * @private
 * @returns {void}
 */
function togglePlaceholder() {
  const taskAres = document.querySelectorAll('.task__area');
  taskAres.forEach(area => {
    let status = area.dataset.status;
    const placeholder = area.querySelector('.task__area--placeholder');
    let hasTask = Object.values(todos).some(task => task.status === status && matchesSearch(task));
    if (hasTask) {
      placeholder.classList.add('d_none')
    } else {
      placeholder.classList.remove('d_none');
    }
  });
};


function clearDropHighlights() {
  document.querySelectorAll(".task__area--highlight").forEach(zone => {
    zone.classList.remove("task__area--highlight");
  });
}

function clearDropCardPreview() {
  document.querySelectorAll(".task__list--preview").forEach(list => {
    list.classList.remove("task__list--preview");
  });
}

/**
 * Handles `dragstart` on `.task__card`.
 * Stores dragged task id and adds a visual dragging class.
 *
 * @listens Document#dragstart
 * @param {DragEvent} event - Browser dragstart event.
 * @returns {void}
 */
document.addEventListener("dragstart", function (event) {
  const card = event.target.closest(".task__card");
  if (!card) return;

  currentDraggedElement = card.id;
  card.classList.add("task__card--dragging");
});


/**
 * Handles `dragend` on `.task__card`.
 * Removes the visual dragging class.
 *
 * @listens Document#dragend
 * @param {DragEvent} event - Browser dragend event.
 * @returns {void}
 */
document.addEventListener("dragend", function (event) {
  const card = event.target.closest(".task__card");
  if (!card) return;
  card.classList.remove("task__card--dragging");
  clearDropHighlights();
  clearDropCardPreview();
  currentDraggedElement = undefined
});


/**
 * Handles `dragover` within a `.task__area` drop zone.
 * Calls `preventDefault()` to allow dropping and highlights the drop zone.
 *
 * @listens Document#dragover
 * @param {DragEvent} event - Browser dragover event.
 * @returns {void}
 */
document.addEventListener("dragover", function (event) {
  event.preventDefault(); //INFO This prevents the browser from blocking the drop.
  const dropZone = event.target.closest(".task__area"); //INFO The columns are also found for child elements.
  clearDropHighlights();
  clearDropCardPreview();
  if (!dropZone) return; // INFO If there is no drop zone, cancel.
    const taskList = dropZone.querySelector(".task__list");
  if (!taskList) return;
  taskList.classList.add("task__list--preview");
});


/**
 * Handles `drop` within a `.task__area` drop zone.
 * Moves the dragged task into the drop zone's status and re-renders the board.
 *
 * @listens Document#drop
 * @param {DragEvent} event - Browser drop event.
 * @returns {void}
 */
document.addEventListener("drop", async function (event) {
  event.preventDefault();
  const dropZone = event.target.closest(".task__area");
  clearDropHighlights();
  clearDropCardPreview();
  if (!dropZone || !currentDraggedElement) return;
  const newStatus = dropZone.dataset.status;
  const oldStatus = todos[currentDraggedElement]?.status;
  dropZone.classList.remove("task__list--preview");
  todos[currentDraggedElement].status = newStatus;

  updateHTML();
  try {
    await updateTaskStatus(currentDraggedElement, newStatus)
  } catch (error) {
    console.error("Firebase-Update fehlgeschlagen:", error);

    // rollback
    if (todos[currentDraggedElement]) {
      todos[currentDraggedElement].status = oldStatus;
      updateHTML();
    }
    alert("Status konnte nicht gespeichert.");
  }
});


/**
 * Handles `dragleave` for `.task__area`.
 * Removes the drop zone highlight class.
 *
 * @listens Document#dragleave
 * @param {DragEvent} event - Browser dragleave event.
 * @returns {void}
 */
document.addEventListener("dragleave", function (event) {
  const dropZone = event.target.closest(".task__area");
  if (!dropZone) return;
  dropZone.classList.remove("task__area--highlight");
});



function matchesSearch(task) {
  if (!activeSearchTerm) return true;
  const haystack = [task.title, task.description, task.category, task.priority]
    .map(v => String(v || '').toLowerCase())
    .join(' ');
  return haystack.includes(activeSearchTerm);
}

function searchTask(value) {
  activeSearchTerm = String(value || '').toLowerCase().trim();
  updateHTML();
}

initBoard();


window.searchTask = searchTask;
