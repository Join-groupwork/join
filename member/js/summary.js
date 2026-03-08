import { loadTasks } from '/scripts/firebase/get-firebase.js';
import { signInWithEmailAndPassword, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// INFO die tasks von firebase müssen abgerufen werden
// INFO firebase tasks auslesen "subtask"
// INFO need greetings for user and guest

// [ ] Show how much tasks "todo"
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
async function greetings(signInWithEmailAndPassword, signInAnonymously) {
  let daytime = document.getElementById('greetingTime');
  let name = document.getElementById('greetingName');

}

async function initSummary() {
    const tasks = await loadTasks();
    todoTasks(tasks);
    // Call other functions here when implemented
}

window.addEventListener('load', initSummary);
