import { loadTasks } from '/scripts/firebase/get-firebase.js';

const columns = {
    todo: document.getElementById('todo'),
    progress: document.getElementById('progress'),
    feedback: document.getElementById('feedback'),
    done: document.getElementById('done'),
   
};

function getCardTemplate(task) {
    return `
    <div class="card" id="${task.key}" draggable="true">
        <h4>${task.category}</h4>
        <p>${task.title}</p>
        <p>${task.description}</p>
        <p>${task.assigned_to}</p>
    
    </div>
    `;
}


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

        // Remove the column's class to prevent layout issues when multiple tasks are added
        column.removeAttribute('class');
    }
}



renderBoard();