import { loadTasks } from '/scripts/firebase/get-firebase.js';


async function initSummary() {
    const tasks = await loadTasks();   
    todoTasks(tasks);              
}

function todoTasks(tasks) {
    const count = tasks.filter(task => task.status === "todo").length;
    document.getElementById("todo-count").textContent = count;
}

initSummary();