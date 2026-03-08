import { loadData, loadTasks, tasks } from "../../scripts/firebase/get-firebase";
import { auth } from "/script/firebase/firebase.js";
import { signInWithEmailAndPassword, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// INFO die tasks von firebase müssen abgerufen werden
// INFO firebase tasks auslesen "subtask"
// INFO need greetings for user and guest

// [ ] Show how much tasks "todo"
async function todoTasks(tasks) {

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
// [ ] greetings for daytime
function greetTime() {
  let greetTimeRef = document.getElementById('greetingTime');

}

// [ ] greetings for user
// [ ] greetings for guests

/**
 *
 * @param {string} signInWithEmailAndPassword
 * @param {string} signInAnonymously
 */
async function greetings(auth) {

  let name = document.getElementById('greetingName');
  if (signInWithEmailAndPassword == true) {

  } else {

  }
};


function renderSummary() {
  // todoTasks();
  // doneTasks();
  // urgentTasks();
  // tasksInBoard();
  // tasksInProgress();
  // awaitFeedbackTasks();
  greetTime();
  greetings();
};

renderSummary();
