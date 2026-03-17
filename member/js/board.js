import { loadTasks } from '../../scripts/firebase/get-firebase.js';
import { generateTodosHTML } from './member-templates.js';
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
 * Task collection indexed by id.
 * NOTE: Placeholder data until Firebase is connected.
 *
 * @type {Record<string, Todo>}
 */
export let todos = {};

export async function initBoard() {
  try {
    todos = await loadTasks();
    updateHTML();
  } catch (error) {
    console.error('Fehler bei Laden der Tasks:', error);
  }
}
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
 * @property {SubtaskStatus} status - Current board column/status.
 */
export function updateHTML() {
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
    if (element.status === 'todo') {
      container.innerHTML += generateTodosHTML(id, element.title, element.category, element.description, element.priority);
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
    if (element.status === 'in-progress') {
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
    if (element.status === 'await-feedback') {
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
    if (element.status === 'done') {
      document.getElementById('done').innerHTML += generateTodosHTML(id, element.title, element.category, element.description, element.priority);
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
    let hasTask = Object.values(todos).some(task => task.status === status);
    if (hasTask) {
      placeholder.classList.add('d-none')
    } else {
      placeholder.classList.remove('d-none');
    }
  });
};
