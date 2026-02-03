// TODO Hinzufügen einer Drag and Drop Funktion
// TODO variable für id hinzufügen
// TODO

let currentId;

// INFO erster Versuch
function dragAndDrop() {

}

function updateHTML() {
  let todo = todos.filter(t => ['category'] == 'todo');
  document.getElementById('todo').innerHTML = '';

  for (let index = 0; index < todo.length; index++) {
    const element = todo[index];
    document.getElementById('todo').innerHTML += generateTodoHTML(element);
  }
}
