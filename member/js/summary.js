import { loadData, loadTasks } from '../../scripts/firebase/get-firebase';
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

// [ ] greetings for user
// [ ] greetings for guests
// [ ] greetings for daytime
async function greetings(signInWithEmailAndPassword, signInAnonymously) {
  let daytime = document.getElementById('greetingTime');
  let name = document.getElementById('greetingName');

}
