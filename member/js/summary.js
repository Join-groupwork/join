import { auth } from '../../scripts/firebase/firebase.js';
import { loadTasks, getContacts, loadData } from '../../scripts/firebase/get-firebase.js';

/**
 * Counts the number of tasks with the status "todo" or "to do"
 * and updates the corresponding value in the summary UI.
 *
 * The function also ensures backward compatibility by checking
 * if a task uses the old `subtask` property instead of `status`
 * and assigns it accordingly.
 *
 * @async
 * @function todoTasks
 * @param {Array<Object>} tasks - Array of task objects retrieved from the database.
 * @param {string} [tasks[].status] - The current status of the task.
 * @param {string} [tasks[].subtask] - Legacy property used as a fallback for the task status.
 * @returns {Promise<void>} Resolves after the UI has been updated.
 */
async function todoTasks(tasks) {
  tasks.forEach(task => {
    if (!task.status && task.subtask) {
      task.status = task.subtask;
    }
  });

  const count = tasks.filter(task => {
    const s = (task.status || '').toLowerCase().trim();
    return s === 'todo' || s === 'to do';
  }).length;

  const element = document.querySelector('.todo .card-title');
  if (element) {
    element.textContent = count;
  } else {
    console.warn("Element '.todo .card-title' nicht gefunden!");
  }
}

/**
 * Counts tasks with status "done" and updates the summary UI.
 *
 * @async
 * @param {Array<Object>} tasks - Array of task objects.
 * @returns {Promise<void>}
 */
async function doneTasks(tasks) {
  tasks.forEach(task => {
    if (!task.status && task.subtask) {
      task.status = task.subtask;
    }
  });
  const count = tasks.filter(task => {
    const s = (task.status || '').toLowerCase().trim();
    return s === 'done';
  }).length;
  const element = document.querySelector('.done .card-title');
  if (element) {
    element.textContent = count;
  } else {
    console.warn("Element '.done .card-title' nicht gefunden!");
  }
}

/**
 * Counts urgent tasks and updates the summary UI.
 *
 * @async
 * @param {Array<Object>} tasks - Array of task objects.
 * @returns {Promise<void>}
 */
async function urgentTasks(tasks) {
  const count = tasks.filter(task => {
    const s = (task.priority || '').toLowerCase().trim();
    return s === 'urgent';
  }).length;
  const element = document.querySelector('.urgent-info .card-title');
  if (element) {
    element.textContent = count;
  } else {
    console.warn("Element '.urgent-info .card-title' nicht gefunden!");
  }
}

/**
 * Counts tasks that are valid board tasks and updates the summary UI.
 *
 * @async
 * @param {Array<Object>} tasks - Array of task objects.
 * @returns {Promise<void>}
 */
async function tasksInBoard(tasks) {
  const validStatuses = new Set(['todo', 'in-progress', 'await-feedback', 'done']);
  const count = tasks.filter(task => {
    const status = (task.status || '').toLowerCase().trim();
    return validStatuses.has(status);
  }).length;
  const element = document.querySelector('.all-tasks .big');
  if (element) {
    element.textContent = count;
  } else {
    console.warn("Element '.all-tasks .big' nicht gefunden!");
  }
}

/**
 * Counts tasks with status "in-progress" and updates the summary UI.
 *
 * @async
 * @param {Array<Object>} tasks - Array of task objects.
 * @returns {Promise<void>}
 */
async function tasksInProgress(tasks) {
  const count = tasks.filter(task => {
    const status = (task.status || '').toLowerCase().trim();
    return status === 'in-progress';
  }).length;
  const element = document.querySelector('.tasks-in-progress .big');
  if (element) {
    element.textContent = count;
  } else {
    console.warn("Element '.tasks-in-progress .big' nicht gefunden!");
  }
}

/**
 * Counts tasks with status "await-feedback" and updates the summary UI.
 *
 * @async
 * @param {Array<Object>} tasks - Array of task objects.
 * @returns {Promise<void>}
 */
async function awaitFeedbackTasks(tasks) {
  tasks.forEach(task => {
    if (!task.status && task.subtask) {
      task.status = task.subtask;
    }
  });
  const count = tasks.filter(task => {
    const s = (task.status || '').toLowerCase().trim();
    return s === 'await-feedback';
  }).length;
  const element = document.querySelector('.await-feedback-info .big');
  if (element) {
    element.textContent = count;
  } else {
    console.warn("Element '.await-feedback-info .big' nicht gefunden!");
  }
}

/**
 * Displays the greeting text based on the current time of day.
 *
 * @returns {void}
 */
function greetings() {
  const daytimeElem = document.getElementById('greetingTime');
  if (!daytimeElem) return;
  const hour = new Date().getHours();
  let greetingText = 'Good evening';
  if (hour < 12) greetingText = 'Good morning';
  else if (hour < 18) greetingText = 'Good afternoon';
  daytimeElem.textContent = greetingText;
}

/**
 * Assigns the displayed username depending on the authentication state.
 *
 * If a logged-in user exists and is not anonymous, their contact name
 * will be shown. Otherwise, the label "Guest" will be used.
 *
 * @param {Object|null} user - The authenticated user object from Firebase Auth.
 * @param {HTMLElement|null} nameElem - DOM element for the greeting name.
 * @returns {void}
 */
export function assignName(user, nameElem) {
  if (!nameElem) {
    console.warn('Kein nameElem vorhanden!');
    return;
  }
  if (user && !user.isAnonymous) {
    const contacts = getContacts();
    const contact = Object.values(contacts || {}).find(c => c.uid === user.uid);
    nameElem.textContent = contact?.name || 'User';
    return;
  }
  nameElem.textContent = 'Guest';
}

/**
 * Finds the next upcoming deadline among urgent tasks
 * and renders it into the summary UI.
 *
 * @param {Array<Object>} tasks - Array of task objects.
 * @returns {void}
 */
function urgentTasksDeadLine(tasks) {
  const urgentTasks = tasks
    .filter(task => task.priority === 'urgent' && task.due_date)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  const deadlineElement = document.getElementById('urgentTasks-dead-line');
  if (!deadlineElement) return;
  if (urgentTasks.length > 0) {
    const nextDate = new Date(urgentTasks[0].due_date);
    deadlineElement.textContent = nextDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

/**
 * Shows the greeting overlay on mobile devices for a short time
 * and then hides it.
 *
 * Copies the already rendered desktop greeting text into the
 * mobile overlay elements before hiding the overlay.
 *
 * @returns {void}
 */
function initMobileGreetingOverlay() {
  const overlay = document.getElementById('mobileGreetingOverlay');
  const desktopTime = document.getElementById('greetingTime');
  const desktopName = document.getElementById('greetingName');
  const mobileTime = document.getElementById('mobileGreetingTime');
  const mobileName = document.getElementById('mobileGreetingName');
  if (!overlay || !desktopTime || !desktopName || !mobileTime || !mobileName) return;
  if (window.innerWidth > 600) return;
  if (overlay.dataset.started === 'true') return;
  const timeText = desktopTime.textContent.trim();
  const nameText = desktopName.textContent.trim();
  if (!timeText || !nameText) return;
  mobileTime.textContent = timeText;
  mobileName.textContent = nameText;
  overlay.dataset.started = 'true';
  overlay.classList.remove('hide');
  overlay.classList.add('show');
  setTimeout(() => {
    overlay.classList.remove('show');
    overlay.classList.add('hide');
  }, 200);
}

/**
 * Initializes the summary page:
 * - loads tasks
 * - updates all counters
 * - sets greeting text
 * - loads contact data
 * - resolves and renders the current user's name
 * - starts the mobile greeting overlay
 *
 * @async
 * @returns {Promise<void>}
 */
export async function initSummary() {
  const tasksData = await loadTasks();
  const tasks = Object.values(tasksData || {});
  await todoTasks(tasks);
  await doneTasks(tasks);
  await urgentTasks(tasks);
  await tasksInBoard(tasks);
  await tasksInProgress(tasks);
  await awaitFeedbackTasks(tasks);
  urgentTasksDeadLine(tasks);
  greetings();
  const nameElem = document.getElementById('greetingName');
  auth.onAuthStateChanged((user) => {
    if (user) {
      loadData(() => {
        assignName(user, nameElem);
        initMobileGreetingOverlay();
      });
    } else {
      assignName(null, nameElem);
      initMobileGreetingOverlay();
    }
  });
}

window.addEventListener('load', initSummary);
