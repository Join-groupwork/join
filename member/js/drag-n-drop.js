import { generateTodosHTML } from './member-templates.js'
// import { renderBoard } from'./member-script.js';

// [x]Create updateHTML function, examples for initial testing
// [x] Test drag and drop
// [ ] Style drag and drop
// [ ] Add Firebase update
// [ ] Retrieve data from Firebase and display in to-dos
// [ ] Test function with Firebase data

// let categorys = ['user-story', 'technical-task'];
// let subtask = ['todo', 'in-progress', 'await-feedback', 'done'];
// INFO  let = todos will be replaced later when the data is loaded from Firebase.
let todos = {
  "0": {
    title: 'Kochwelt',
    description: 'Eine Kochwelt App erstellen',
    date: '2026-02-08',
    priority: 'urgent',
    assignedTo: '',
    category: 'user-story',
    subtask: 'todo'
  },
  "1": {
    title: 'Impressum',
    description: 'Das Impressum erstellen',
    date: '',
    priority: 'medium',
    assignedTo: '',
    category: 'user-story',
    subtask: 'in-progress'
  },
  "2": {
    title: 'Rezept Seite',
    description: 'Rezept Seite Designen',
    date: '',
    priority: 'low',
    assignedTo: '',
    category: 'technical-task',
    subtask: 'await-feedback'
  },
  "3": {
    title: 'Startseite erstellen',
    description: 'Erster Aufbau der Starsteite erstellen',
    date: '',
    priority: 'urgent',
    assignedTo: '',
    category: 'technical-task',
    subtask: 'done'
  }
};

let currentDraggedElement;

// INFO This function is only temporary until the first test is completed.
// INFO After that, this function will be replaced and the to-dos will be loaded from Firebase.
export function updateHTML() {
  updateTodo();
  updateInProgress();
  updateAwaitFeedback();
  updateDone();
  togglePlaceholder();
};

function updateTodo() {
  document.getElementById('todo').innerHTML = '';
  for (const [id, element] of Object.entries(todos)) {
    if (element.subtask === 'todo') {
      document.getElementById('todo').innerHTML += generateTodosHTML(id, element.title, element.category, element.description, element.priority);
    }
  }
};

function updateInProgress() {
  document.getElementById('inProgress').innerHTML = '';
  for (const [id, element] of Object.entries(todos)) {
    if (element.subtask === 'in-progress') {
      document.getElementById('inProgress').innerHTML += generateTodosHTML(id, element.title, element.category, element.description, element.priority);
    }
  }
};

function updateAwaitFeedback() {
  document.getElementById('awaitFeedback').innerHTML = '';
  for (const [id, element] of Object.entries(todos)) {
    if (element.subtask === 'await-feedback') {
      document.getElementById('awaitFeedback').innerHTML += generateTodosHTML(id, element.title, element.category, element.description, element.priority);
    }
  }
};

function updateDone() {
  document.getElementById('done').innerHTML = '';
  for (const [id, element] of Object.entries(todos)) {
    if (element.subtask === 'done') {
      document.getElementById('done').innerHTML += generateTodosHTML(id, element.title, element.category, element.description, element.priority);
    }
  }
};

// INFO Used to show and hide a placeholder when no task is available. Used to show and hide a placeholder when no task is available.
// [ ] if no task, show
// [ ] if at least 1 task is hidden
function togglePlaceholder() {
  const taskAres = document.querySelectorAll('.task__area');
  taskAres.forEach(area => {
    let status = area.dataset.status;
    const placeholder = area.querySelector('.task__area--placeholder');
    let hasTask = Object.values(todos).some(task => task.subtask === status);
    if (hasTask) {
      placeholder.classList.add('d-none')
    } else {
      placeholder.classList.remove('d-none');
    }
  });
};

// [x] You have to work with event listeners because you are working with modules.
// CHECK Where are animations or transforms entered?
// CHECK When drawing, the cards must turn slightly.
// [x] dragstart coden
document.addEventListener("dragstart", function (event) {
  if (event.target.classList.contains("task__card")) {
    currentDraggedElement = event.target.id; // INFO We remember the ID with event.target.id.
    event.target.classList.add("task__card--dragging"); // INFO We add a CSS class for the move so that it visually matches the design.
  }
});
document.addEventListener("dragend", function (event) {
  if (event.target.classList.contains("task__card")) {
    event.target.classList.remove("task__card--dragging"); // INFO Removes the CSS class for the visual appearance when moving.
  }
});
// [x] dragover coden
document.addEventListener("dragover", function (event) {
  event.preventDefault(); //INFO This prevents the browser from blocking the drop.
  const dropZone = event.target.closest(".task__area"); //INFO aThe columns are also found for child elements.
  if (!dropZone) return; // INFO If there is no drop zone, cancel.
  //  [ ] Visual feedback for the drop zone where it is pushed in must be determined here, via classlist.add.
  dropZone.classList.add("task__area--highlight");
});
// [x] drop coden
// [ ] togglePlaceholder() is on function?
document.addEventListener("drop", function (event) {
  event.preventDefault();
  const dropZone = event.target.closest(".task__area");
  if (!dropZone) return;
  const newSubtask = dropZone.dataset.status;
  dropZone.classList.remove("task__area--highlight");
  todos[currentDraggedElement].subtask = newSubtask;
  updateHTML();
  togglePlaceholder();
}
);
// [x] dragleave coden
// [ ] Check that “task__area--highlight” is removed.
document.addEventListener("dragleave", function (event) {
  const dropZone = event.target.closest(".task__area");
  if (!dropZone) return;
  dropZone.classList.remove("task__area--highlight");
});
