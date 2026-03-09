import { loadTasks } from '/scripts/firebase/get-firebase.js';


async function initSummary() {
    const tasks = await loadTasks();
    urgentTasks(tasks);
    doneTasks(tasks);   
    todoTasks(tasks);              
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



initSummary();