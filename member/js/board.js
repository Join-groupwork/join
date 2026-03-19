import { loadTasks } from '../../scripts/firebase/get-firebase.js';
import { generateTodosHTML } from './member-templates.js';

/**
 * Possible board states.
 * @typedef {"todo" | "in-progress" | "await-feedback" | "done"} TaskStatus
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
 * @property {TaskStatus} status - Current board column/status.
 */

/**
 * References to the DOM containers (board columns) where tasks are rendered.
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


/**
 * Loads all tasks from Firebase and renders them into the board.
 *
 * @async
 * @returns {Promise<void>}
 */
export async function initBoard() {
  try {
    todos = await loadTasks();
    updateHTML();
  } catch (error) {
    console.error('Fehler bei Laden der Tasks:', error);
  }
}


/**
 * Re-renders all board columns and updates placeholder visibility.
 *
 * Skips rendering when the board DOM is not present.
 *
 * @returns {void}
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

function updateProgressBar() {
  let tasks = loadTasks();
  let progressPercent = ;
  let progressData = Object.values(tasks || {});
  progressBarData(tasks, id);
}

function progressBarData(tasks, id) {
  const progressRef = document.getElementById(taskProgressBar(${id}));

  if (!tasks[id].subtasks || tasks[id].subtasks.length == 0) {
    progressRef.classList.add('d-none');
    return;
  } else {
    let totalSubtasks = tasks[id].subtasks.length;
    let doneSubtasks = subtasksStatus(tasks, id);

    progressRef.classList.remove('d-none');
  }
}


function subtaskStatus( tasks, id) {
for await (const doneStatus of tasks[id].subtasks.status) {

}
}


/**
 * Renders tasks with {@link Todo.status} === "todo" into the `#todo` column.
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
      container.innerHTML += generateTodosHTML(id, element.title, element.category, element.description, element.subtask, element.priority);
      progressBarData(id);
    }
  }
};


/**
 * Renders tasks with {@link Todo.status} === `"in-progress"` into the `#inProgress` column.
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
 * Renders tasks with {@link Todo.status} === `"await-feedback"` into the `#awaitFeedback` column.
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
 * Renders tasks with {@link Todo.status} === `"done"` into the `#done` column.
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
 * Uses `.task__area[data-status]` to match against {@link Todo.status}.
 *
 * @private
 * @returns {void}
 */
function togglePlaceholder() {
  const taskAreas = document.querySelectorAll('.task__area');
  taskAreas.forEach(area => {
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
