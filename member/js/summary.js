import { loadTasks } from '/scripts/firebase/get-firebase.js';
import { signInWithEmailAndPassword, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from '/scripts/firebase/firebase.js';
// INFO die tasks von firebase müssen abgerufen werden
// INFO firebase tasks auslesen "subtask"
// INFO need greetings for user and guest

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
 * @param {string} [tasks[].status] - The current status of the task (e.g. "todo", "in progress", "done").
 * @param {string} [tasks[].subtask] - Legacy property used as a fallback for the task status.
 *
 * @returns {Promise<void>} Resolves after the UI has been updated.
 */
async function todoTasks(tasks) {
    console.log('Fetched tasks for summary:', tasks);

    // ensure every task has a `status` property (else fall back to old `subtask`)
    tasks.forEach(task => {
        if (!task.status && task.subtask) {
            task.status = task.subtask;
        }
    });

    const count = tasks.filter(task => {
        const s = (task.status || '').toLowerCase().trim();
        return s === 'todo' || s === 'to do';
    }).length;

    console.log('Computed todo count:', count);
    document.querySelector('.todo .card-title').textContent = count;
}

// [ ] show how much tasks "done"
async function doneTasks(tasks) {

}
// INFO Urgent task
// INFO functoin for "when is the next deadline?"
// [ ] show how much task "urgent"
async function urgentTasks(tasks) {

}

// [ ] show how much "tasks in "board"
async function tasksInBoard(tasks) {

}

// [ ] show how much "task in progress"
async function tasksInProgress(tasks) {

}

// [ ] show how much tasks "await feedback"
async function awaitFeedbackTasks(tasks) {

}

// [ ] greetings for user
// [ ] greetings for guests
// [ ] greetings for daytime
async function greetings() {
  const daytimeElem = document.getElementById('greetingTime');
  const nameElem = document.getElementById('greetingName');

  // determine time-based message
  const hour = new Date().getHours();
  let greetingText;
  if (hour < 12) greetingText = 'Good morning';
  else if (hour < 18) greetingText = 'Good afternoon';
  else greetingText = 'Good evening';

  if (daytimeElem) {
    daytimeElem.textContent = greetingText;
  }

  // determine user or guest; do an immediate check then listen for state changes
  function assignName(user) {
    if (!nameElem) return;
    if (user && !user.isAnonymous) {
      nameElem.textContent = user.displayName || user.email || 'User';
    } else {
      nameElem.textContent = 'Guest';
    }
  }

  assignName(auth.currentUser);
  onAuthStateChanged(auth, assignName);
}

async function initSummary() {
    // show greetings first so user sees something even if tasks fail
    greetings();

    const tasks = await loadTasks();
    todoTasks(tasks);
    // Call other functions here when implemented
}

window.addEventListener('load', initSummary);
