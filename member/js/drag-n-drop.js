import { generateTodoHTML } from './member-templates.js'
// import { renderBoard } from'./member-script.js';
// TODO Hinzufügen einer Drag and Drop Funktion
// TODO variable für id hinzufügen
// TODO

let categorys = ['user-story', 'technical-task'];
let todos = [
  {
    id: 1,
    title: 'Kochwelt',
    description: 'Eine Kochwelt App erstellen',
    date: '2026-02-08',
    priority: 'urgent',
    assignedTo: '',
    category: 'user-story',
    subtask: 'todo'
  }, {
    id: 2,
    title: 'Impressum',
    description: 'Das Imoressum erstellen',
    date: '',
    priority: 'medium',
    assignedTo: '',
    category: 'user-story',
    subtask: 'in-progress'
  }, {
    id: 3,
    title: 'Rezept Seite',
    description: 'Rezept Seite Designen',
    date: '',
    priority: 'low',
    assignedTo: '',
    category: 'technical-task',
    subtask: 'await-feedback'
  }, {
    id: 4,
    title: 'Startseite erstellen',
    description: 'Erster Aufbau der Starsteite erstellen',
    date: '',
    priority: 'urgent',
    assignedTo: '',
    category: 'technical-task',
    subtask: 'done'
  }
];

let currentId;

// INFO erster Versuch
// function dragAndDrop() {

// }

export function updateHTML() {
  if (!document.getElementById('todo')) {
    return
  }
  let todo = todos.filter(t => t.subtask === 'todo');
  document.getElementById('todo').innerHTML = '';
  for (let index = 0; index < todo.length; index++) {
    const element = todo[index];
    document.getElementById('todo').innerHTML += generateTodoHTML(element);
  }

  let inProgress = todos.filter(t => t.subtask === 'in-progress');
  document.getElementById('inProgress').innerHTML = '';
  for (let index = 0; index < inProgress.length; index++) {
    const element = inProgress[index];
    document.getElementById('inProgress').innerHTML += generateTodoHTML(element);
  }

  let awaitFeedback = todos.filter(t => t.subtask === 'await-feedback');
  document.getElementById('awaitFeedback').innerHTML = '';
  for (let index = 0; index < awaitFeedback.length; index++) {
    const element = awaitFeedback[index];
    document.getElementById('awaitFeedback').innerHTML += generateTodoHTML(element);
  }

  let done = todos.filter(t => t.subtask === 'done');
  document.getElementById('done').innerHTML = '';
  for (let index = 0; index < done.length; index++) {
    const element = done[index];
    document.getElementById('done').innerHTML += generateTodoHTML(element);
  }
}

function highlightStart(category) {

}

function highlightStop(category) {

}
