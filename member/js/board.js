import { loadTasks } from '/scripts/firebase/get-firebase.js';
import { getTaskOverlayTemplate } from './member-templates.js';
let tasks = {}; 


async function initTasks() {
  tasks = await loadTasks();
}

initTasks();

/**
 * References to the DOM containers (board columns) where tasks are rendered.
 *
 * Why this exists:
 * - You query the DOM *once* (instead of repeating `document.getElementById(...)` everywhere).
 * - Your code becomes cleaner: `columns.todo` is easier to read than `"todo"` strings everywhere.
 * - It centralizes the “IDs must exist” assumption in one place (good for debugging).
 *
 * Note: These can be `null` if the elements don’t exist in the current HTML page.
 *
 * @type {{
 *   todo: HTMLElement|null,
 *   inProgress: HTMLElement|null,
 *   awaitFeedback: HTMLElement|null,
 *   done: HTMLElement|null
 * }}
 */
const columns = {
  /** @type {HTMLElement|null} */ todo: document.getElementById('todo'),
  /** @type {HTMLElement|null} */ inProgress: document.getElementById('inProgress'),
  /** @type {HTMLElement|null} */ awaitFeedback: document.getElementById('awaitFeedback'),
  /** @type {HTMLElement|null} */ done: document.getElementById('done'),
};


/**
 * Generates the HTML template for a task card.
 *
 * @param {string} task
 * @param {string|number} task.key
 * @param {string} task.category
 * @param {string} task.title
 * @param {string} task.description
 * @param {string} task.assigned_to
 *
 * @returns {string} HTML string
 */

/*function getCardTemplate(task) {
  return `
    <div class="card" id="${task.key}" draggable="true">
        <h4>${task.category}</h4>
        <p>${task.title}</p>
        <p>${task.description}</p>
        <p>${task.assigned_to}</p>
        
      
    </div>
    `;  } */


/**
 * Fetches all tasks and renders them
 * based on their status.
 *
 * This function:
 * - Loads tasks from the Firebase
 * - Matches each task to the appropriate column
 * - Removes placeholder elements if present
 * - Appends the generated task card HTML to the column
 *
 * @async
 * @returns {Promise<void>}
 */

/*
async function renderBoard() {
  const tasksData = await loadTasks();
  for (let i = 0; i < tasksData.length; i++) {
    const task = tasksData[i]; // get the current task
    // Find the correct column based on task status
    const column = columns[task.status];
    if (!column) continue; // skip if the column doesn't exist
    // Remove the placeholder text if it exists
    const placeholder = column.querySelector('.card-placeholder');
    if (placeholder) placeholder.remove();
    // 5️⃣ Add the task card to the column
    column.innerHTML += getCardTemplate(task);

  }
}*/





function openTaskOverlay(taskId) {
  const task = tasks[taskId];
  if (!task) return console.warn("Task nicht gefunden:", taskId);

  const overlayContainer = document.getElementById("overlay_container");

  overlayContainer.innerHTML = getTaskOverlayTemplate(
    task.category,
    task.title,
    task.description,
    task.due_date,
    task.priority,
    task.assigned_to,
    task.subtask,


  );

  overlayContainer.classList.remove('d_none');
   setTimeout(() => {
    overlayContainer.classList.add('show');
  }, 10);
}
window.openTaskOverlay = openTaskOverlay;

function closeTaskOverlay() {
  const overlayContainer = document.getElementById("overlay_container");
  overlayContainer.classList.remove('show');
  setTimeout(() => {
    overlayContainer.classList.add('d_none'); 
    overlayContainer.innerHTML = '';          
  }, 300);

}

window.closeTaskOverlay = closeTaskOverlay;


function toggleCheckbox(img) {
  if (img.src.includes("unchecked")) {
    img.src = "../assets/icons/checkbox/checkbox-icon-checked.svg";
  } else {
    img.src = "../assets/icons/checkbox/checkbox-icon unchecked.svg";
  }
}
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("checkbox-icon")) {
    toggleCheckbox(e.target);
  }
});

/* renderBoard(); */
