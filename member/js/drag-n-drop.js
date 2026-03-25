/**
 * @file Provides drag-and-drop handling for board tasks.
 *
 * This module:
 * - Tracks the currently dragged task card
 * - Highlights valid drop zones during dragging
 * - Updates the task status locally and in Firebase on drop
 * - Clears drag preview and highlight states after drag operations
 *
 * DOM expectations:
 * - Drop zones with class `.task__area` and `data-status` values matching task.status
 * - Placeholder/task container `.task__list` inside each `.task__area`
 * - Task cards with class `.task__card` and an `id` matching the task key
 *
 * @module drag-n-drop
 */
import { database } from '../../scripts/firebase/firebase.js';
import { todos, updateHTML } from './board.js';
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
// let todos = {};

/**
 * ID (key in {@link todos}) of the currently dragged task card.
 * Set on `dragstart`, consumed on `drop`.
 *
 * @type {string|undefined}
 */
export let currentDraggedElement;


/**
 * Persists a task status change to Firebase.
 *
 * Updates `tasks/{taskId}` with the new `status` value.
 *
 * @param {string} taskId - ID of the task to update.
 * @param {string} newStatus - New board status for the task.
 * @returns {Promise<void>}
 */
export async function updateTaskStatus(taskId, newStatus) {
  await update(ref(database, `tasks/${taskId}`), {
    status: newStatus,
  });
}

/**
 * Removes the highlight class from all drop zones.
 *
 * @returns {void}
 */
function clearDropHighlights() {
  document.querySelectorAll(".task__area--highlight").forEach(zone => {
    zone.classList.remove("task__area--highlight");
  });
}

/**
 * Removes the preview class from all task lists.
 *
 * @returns {void}
 */
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
  dropZone.classList.add("task__area--highlight");
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


window.searchTask = searchTask;
