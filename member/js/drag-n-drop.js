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
import { generateTodosHTML } from './member-templates.js'
// import { renderBoard } from'./member-script.js';

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
 * @property {SubtaskStatus} subtask - Current board column/status.
 */




// [x]Create updateHTML function, examples for initial testing
// [x] Test drag and drop
// [ ] Style drag and drop
// [ ] Add Firebase update
// [ ] Retrieve data from Firebase and display in to-dos
// [ ] Test function with Firebase data

// let categorys = ['user-story', 'technical-task'];
// let subtask = ['todo', 'in-progress', 'await-feedback', 'done'];
// INFO  let = todos will be replaced later when the data is loaded from Firebase.

/**
 * Task collection indexed by id.
 * NOTE: Placeholder data until Firebase is connected.
 *
 * @type {Record<string, Todo>}
 */
let todos = {
  "0": {
    title: 'Kochwelt',
    description: 'Eine Kochwelt App erstellen',
    date: '2026-02-08',
    priority: 'urgent',
    assignedTo: '',
    category: 'user-story',
    subtask: 'todo'
  },
  "1": {
    title: 'Impressum',
    description: 'Das Impressum erstellen',
    date: '',
    priority: 'medium',
    assignedTo: '',
    category: 'user-story',
    subtask: 'in-progress'
  },
  "2": {
    title: 'Rezept Seite',
    description: 'Rezept Seite Designen',
    date: '',
    priority: 'low',
    assignedTo: '',
    category: 'technical-task',
    subtask: 'await-feedback'
  },
  "3": {
    title: 'Startseite erstellen',
    description: 'Erster Aufbau der Starsteite erstellen',
    date: '',
    priority: 'urgent',
    assignedTo: '',
    category: 'technical-task',
    subtask: 'done'
  }
};
/**
 * ID (key in {@link todos}) of the currently dragged task card.
 * Set on `dragstart`, consumed on `drop`.
 *
 * @type {string|undefined}
 */
let currentDraggedElement;

// INFO This function is only temporary until the first test is completed.
// INFO After that, this function will be replaced and the to-dos will be loaded from Firebase.
/**
 * Re-renders all board columns and updates placeholder visibility.
 *
 * @export
 * @returns {void}
 */
export function updateHTML() {
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
  document.getElementById('todo').innerHTML = '';
  for (const [id, element] of Object.entries(todos)) {
    if (element.subtask === 'todo') {
      document.getElementById('todo').innerHTML += generateTodosHTML(id, element.title, element.category, element.description, element.priority);
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
    if (element.subtask === 'in-progress') {
      document.getElementById('inProgress').innerHTML += generateTodosHTML(id, element.title, element.category, element.description, element.priority);
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
    if (element.subtask === 'await-feedback') {
      document.getElementById('awaitFeedback').innerHTML += generateTodosHTML(id, element.title, element.category, element.description, element.priority);
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
    if (element.subtask === 'done') {
      document.getElementById('done').innerHTML += generateTodosHTML(id, element.title, element.category, element.description, element.priority);
    }
  }
};

// INFO Used to show and hide a placeholder when no task is available. Used to show and hide a placeholder when no task is available.
// [ ] if no task, show
// [ ] if at least 1 task is hidden
/**
 * Shows/hides the placeholder inside each `.task__area` depending on whether
 * at least one task exists for that column.
 *
 * Uses `.task__area[data-status]` to match against {@link Todo.subtask}.
 *
 * @private
 * @returns {void}
 */
function togglePlaceholder() {
  const taskAres = document.querySelectorAll('.task__area');
  taskAres.forEach(area => {
    let status = area.dataset.status;
    const placeholder = area.querySelector('.task__area--placeholder');
    let hasTask = Object.values(todos).some(task => task.subtask === status);
    if (hasTask) {
      placeholder.classList.add('d-none')
    } else {
      placeholder.classList.remove('d-none');
    }
  });
};

// [x] You have to work with event listeners because you are working with modules.
// CHECK Where are animations or transforms entered?
// CHECK When drawing, the cards must turn slightly.
// [x] dragstart coden
/**
 * Handles `dragstart` on `.task__card`.
 * Stores dragged task id and adds a visual dragging class.
 *
 * @listens Document#dragstart
 * @param {DragEvent} event - Browser dragstart event.
 * @returns {void}
 */
document.addEventListener("dragstart", function (event) {
  if (event.target.classList.contains("task__card")) {
    currentDraggedElement = event.target.id; // INFO We remember the ID with event.target.id.
    event.target.classList.add("task__card--dragging"); // INFO We add a CSS class for the move so that it visually matches the design.
  }
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
  if (event.target.classList.contains("task__card")) {
    event.target.classList.remove("task__card--dragging"); // INFO Removes the CSS class for the visual appearance when moving.
  }
});
// [x] dragover coden
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
  const dropZone = event.target.closest(".task__area"); //INFO aThe columns are also found for child elements.
  if (!dropZone) return; // INFO If there is no drop zone, cancel.
  //  [ ] Visual feedback for the drop zone where it is pushed in must be determined here, via classlist.add.
  dropZone.classList.add("task__area--highlight");
});
// [x] drop coden
// [ ] togglePlaceholder() is on function?
/**
 * Handles `drop` within a `.task__area` drop zone.
 * Moves the dragged task into the drop zone's status and re-renders the board.
 *
 * @listens Document#drop
 * @param {DragEvent} event - Browser drop event.
 * @returns {void}
 */
document.addEventListener("drop", function (event) {
  event.preventDefault();
  const dropZone = event.target.closest(".task__area");
  if (!dropZone) return;
  const newSubtask = dropZone.dataset.status;
  dropZone.classList.remove("task__area--highlight");
  todos[currentDraggedElement].subtask = newSubtask;
  updateHTML();
  togglePlaceholder();
}
);
// [x] dragleave coden
// [ ] Check that “task__area--highlight” is removed.
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
