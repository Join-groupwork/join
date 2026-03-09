import { loadTasks } from '/scripts/firebase/get-firebase.js';


async function initSummary() {
    const tasks = await loadTasks(); 
    todoTasks(tasks);
    doneTasks(tasks); 
    urgentTasks(tasks);
    tasksInBoard(tasks);
    tasksInProgress(tasks);
    awaitFeedbackTasks(tasks);            
}

// [ ] Show how much tasks "todo"
function todoTasks(tasks) {
    const count = tasks.filter(task => task.status === "todo").length;
    document.getElementById("todo-count").textContent = count;
}

// [ ] show how much tasks "done"
async function doneTasks(tasks) {
    const count = tasks.filter(task => task.status === "done").length;
    document.getElementById("done-count").textContent = count;
}

// INFO Urgent task
// INFO functoin for "when is the next deadline?"
// [ ] show how much task "urgent"
async function urgentTasks(tasks) {
    const count = tasks.filter(task => task.priority === "urgent").length;
    document.getElementById("urgent-count").textContent = count;
}

// [ ] show how much "tasks in "board"
async function tasksInBoard(tasks) {
    const count = tasks.filter(task => task).length;
    document.getElementById("tasks-in-board-count").textContent = count;
}

// [ ] show how much "task in progress"
async function tasksInProgress(tasks) {
    const count = tasks.filter(task => task.status === "inProgress").length;
    document.getElementById("inProgress-count").textContent = count;
}

// [ ] show how much tasks "await feedback"
async function awaitFeedbackTasks(tasks) {
    const count = tasks.filter(task => task.status === "awaitFeedback").length;
    document.getElementById("awaiting-feedback-count").textContent = count;
}

initSummary();