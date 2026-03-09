import { loadTasks } from '/scripts/firebase/get-firebase.js';


async function initSummary() {
    const tasks = await loadTasks();
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


initSummary();