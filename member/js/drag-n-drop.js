import { generateTodosHTML } from './member-templates.js'
// import { renderBoard } from'./member-script.js';
// TODO Hinzufügen einer Drag and Drop Funktion
// TODO variable für id hinzufügen
// TODO
// [x] updateHTML Funktion erstellen, Beispiele für erste Tests
// [ ] DragnDrop testen
// [ ] Drag n Drop stylen
// [ ] firebase update hinzufügen
// [ ] daten von firebase abrufen und in todos anzeigen lassen
// [ ] Funktion mit den Firebase daten testen

let categorys = ['user-story', 'technical-task'];
let subtask = ['todo', 'in-progress', 'await-feedback', 'done'];
// INFO  let = todos wird später erstetzt, das die daten von firebase geladen werden
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

// INFO diese Funktion ist nur vorübergehend, bis das erste testen abgeshlossen ist.
// INFO Danach wird diese Funktion ersetzt und die Todos werden von Firebase geladen.
export function updateHTML() {
  updateTodo();
  updateInProgress();
  updateAwaitFeedback();
  updateDone();
  // if (!document.getElementById('todo')) {
  //   return
  // }

  // if (!document.getElementById('inProgress')) {
  //   return
  // }

  // if (!document.getElementById('awaitFeedback')) {
  //   return
  // }

  // if (!document.getElementById('done')) {
  //   return
  // }
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
// [ ]
function togglePlaceholder(dropZone) {
  const placeholder = dropZone.querySelector('task__card');
  if (dropZone.children.length > 1) {
    placeholder.classList.add('d-none');
  } else {
    placeholder.classList.remove('d-none');
  }
};

// [x] es muss mit eventlistener gearbeitet werden, da mit modulen gearbeitet wird.
// CHECK es müssen vermutlich alle IDs als mit if in die function eingefügt werden!
// CHECK wo werden animationen oder transform eingegeben?
// CHECK beim zeihen müssen die cards sich leicht eindrehen
// [x] dragstart coden
document.addEventListener("dragstart", function (event) {
  if (event.target.classList.contains(".task__card")) {
    currentDraggedElement = event.target.id; // INFO mit event.target.id merken wir uns die ID
    event.target.classList.add("task__card--dragging"); // INFO wir fügen für das verschieben eine css klasse ein, damit es visuell zum design passt.
  }
});
document.addEventListener("dragend", function (event) {
  if (event.target.classList.contains("task__card")) {
    event.target.classList.remove("task__card--dragging"); // INFO entfernt die css klasse für das visuielle beim verschieben.
  }
});
// [x] dragover coden
document.addEventListener("dragover", function (event) {
  event.preventDefault(); //INFO hiermit wird verhindert, das der browser das droppen blockiert
  const dropZone = event.target.closest(".task__area"); //INFO auch bei Kind-Elementen werden die Spalten gefunden.
  if (!dropZone) return; // INFO wenn es keine dropZone gibt, abbrechen.
  //  [ ] visuelles Feedback für die Dropzone wo es rein geschoben wird muss hier bestimmt werden, über classlist.add
  dropZone.classList.add("task__area--highlight");
});
// [ ] drop coden
document.addEventListener("drop", function (event) {
  event.preventDefault();
  const dropZone = event.target.closest(".task__area");
  if (!dropZone) return;
  const newSubtask = dropZone.dataset.status;
  dropZone.classList.remove("task__area--highlight");
  todos[currentDraggedElement].subtask = newSubtask;
  updateHTML();
  togglePlaceholder(dropZone);
}
);
// [x] dragleave coden
// [ ] prüfen das "task__area--highlight" entfernt wird.
document.addEventListener("dragleave", function (event) {
  const dropZone = event.target.closest(".task__area");
  if (!dropZone) return;
  dropZone.classList.remove("task__area--highlight");
});
