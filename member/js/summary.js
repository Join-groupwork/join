import { loadTasks } from '/scripts/firebase/get-firebase.js';


async function initSummary() {
    const tasks = await loadTasks(); 
    todoTasks(tasks);
    doneTasks(tasks); 
    urgentTasks(tasks);
    tasksInBoard(tasks);
    tasksInProgress(tasks);
    awaitFeedbackTasks(tasks);  
    greetingTime();        
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


// [ ] greetings for daytime
function greetingTime() {
  let daytime = document.getElementById('greetingTime');
  let hour = new Date().getHours();
  let greeting = "";

  if (hour < 12) {
    greeting = "Good morning,";
  } else if (hour < 18) {
    greeting = "Good afternoon,";
  } else {
    greeting = "Good evening,";
  }

  daytime.textContent = greeting;
}

initSummary();