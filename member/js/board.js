import { loadTasks } from '/scripts/firebase/get-firebase.js';

const columns = {
    todo: document.getElementById('todo'),
    progress: document.getElementById('progress'),
    feedback: document.getElementById('feedback'),
   
};

function getCardTemplate(task) {
    return `
    <div class="card" id="${task.key}" draggable="true">
        <h4>${task.title}</h4>
        <p>${task.description}</p>
        <span class="priority ${task.priority}">${task.priority}</span>
    </div>
    `;
}

async function renderBoard() {

    const tasks = await loadTasks();

    // Alle Columns leeren und Platzhalter setzen
    Object.values(columns).forEach(col => {
        col.innerHTML = '<p class="card-placeholder">No tasks to do</p>';
    });

    // Tasks einfügen
    tasks.forEach(task => {
        const column = columns[task.status];
        if (!column) return;

        // Placeholder entfernen, falls vorhanden
        const placeholder = column.querySelector('.card-placeholder');
        if (placeholder) placeholder.remove();

        // Task untereinander einfügen
        column.innerHTML += getCardTemplate(task);

        // Column-Klasse entfernt, um Layoutprobleme bei mehreren Tasks zu vermeiden
        column.removeAttribute('class');
    });
}



// Board rendern, sobald DOM geladen ist
window.addEventListener('DOMContentLoaded', renderBoard);
