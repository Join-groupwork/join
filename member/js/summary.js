import { auth } from '/scripts/firebase/firebase.js';
import { loadTasks } from '/scripts/firebase/get-firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


async function initSummary() {
 const data = await loadTasks();
  const tasks = Object.values(data || {});  
  todoTasks(tasks);
  doneTasks(tasks);
  urgentTasks(tasks);
  tasksInBoard(tasks); 
  tasksInProgress(tasks);
  awaitFeedbackTasks(tasks);
  urgentTasksDeadLine(tasks);
  greetings(); 
}
// function todoTasks(tasks) {
//   const count = tasks.filter(task => task.status === "todo").length;
//   document.getElementById("todo-count").textContent = count;
// }



initSummary();


// INFO die tasks von firebase müssen abgerufen werden
// INFO firebase tasks auslesen "subtask"
// INFO need greetings for user and guest

/**
 * Counts the number of tasks with the status "todo" or "to do"
 * and updates the corresponding value in the summary UI.
 *
 * The function also ensures backward compatibility by checking
 * if a task uses the old `subtask` property instead of `status`
 * and assigns it accordingly.
 *
 * @async
 * @function todoTasks
 * @param {Array<Object>} tasks - Array of task objects retrieved from the database.
 * @param {string} [tasks[].status] - The current status of the task (e.g. "todo", "in progress", "done").
 * @param {string} [tasks[].subtask] - Legacy property used as a fallback for the task status.
 *
 * @returns {Promise<void>} Resolves after the UI has been updated.
 */
async function todoTasks(tasks) {
  // ensure every task has a `status` property (else fall back to old `subtask`)
  taskArray.forEach(task => {
    if (!task.status && task.subtask) {
      task.status = task.subtask;
    }
  });

 const count = tasks.filter(task => {
    const s = (task.status || '').toLowerCase().trim();
    return s === 'todo' || s === 'to do';
  }).length;

  console.log('Computed todo count:', count);

  const element = document.querySelector('.todo .card-title');
  if (element) {
    element.textContent = count;
  } else {
    console.warn("Element '.todo .card-title' nicht gefunden!");
  }
}

// [ ] show how much tasks "done"
async function doneTasks(tasks) {
  tasks.forEach(task => {
    if (!task.status && task.subtask) {
      task.status = task.subtask;
    }
  });

 const count = tasks.filter(task => {
    const s = (task.status || '').toLowerCase().trim();
    return s === 'done' ;
  }).length;

  console.log('Computed done count:', count);

  const element = document.querySelector('.done .card-title');
  if (element) {
    element.textContent = count;
  } else {
    console.warn("Element '.done .card-title' nicht gefunden!");
  }
}
// INFO Urgent task
// INFO functoin for "when is the next deadline?"
// [ ] show how much task "urgent"

async function urgentTasks(tasks) {
 const count = tasks.filter(task => {
    const s = (task.priority || '').toLowerCase().trim();
    return s === 'urgent' ;
  }).length;

  console.log('Computed urgent count:', count);

  const element = document.querySelector('.urgent-info .card-title');
  if (element) {
    element.textContent = count;
  } else {
    console.warn("Element '.urgent-info .card-title' nicht gefunden!");
  }
} 

// [ ] show how much "tasks in "board"
async function tasksInBoard(tasks) {
  const count = tasks.length; 
  const element = document.querySelector('.all-tasks .big');
  if (element) {
    element.textContent = count;
  } else {
    console.warn("Element '.all-tasks .big' nicht gefunden!");
  }
}

// [ ] show how much "task in progress"
async function tasksInProgress(tasks) {
  tasks.forEach(task => {
    if (!task.status && task.subtask) {
      task.status = task.subtask;
    }
  });
  const count = tasks.filter(task => task.status === 'inProgress').length;
  console.log('Computed inProgress count:', count);
  const element = document.querySelector('.tasks-in-progress .big'); 
  if (element) {
    element.textContent = count;
  } else {
    console.warn("Element '.tasks-in-progress .big' nicht gefunden!");
  }
}

// [ ] show how much tasks "await feedback"
async function awaitFeedbackTasks(tasks) {
  tasks.forEach(task => {
    if (!task.status && task.subtask) {
      task.status = task.subtask;
    }
  });

  const count = tasks.filter(task => {
    const s = (task.status || '').toLowerCase().trim();
    return s === 'await-feedback';
  }).length;

  console.log('Computed await-feedback count:', count);
  const element = document.querySelector('.await-feedback-info .big');
  if (element) {
    element.textContent = count;
  } else {
    console.warn("Element '.await-feedback-info .big' nicht gefunden!");
  }
}


/**
 * Displays a greeting message based on the current time of day
 * and shows the name of the currently authenticated user.
 *
 * The function:
 * - Determines the appropriate greeting ("Good morning", "Good afternoon", "Good evening")
 *   based on the user's local time.
 * - Updates the greeting text in the DOM.
 * - Checks whether a user is authenticated.
 * - Displays the user's display name or email if logged in,
 *   otherwise falls back to "Guest".
 * - Listens for authentication state changes and updates the name dynamically.
 *
 * @async
 * @function greetings
 * @returns {Promise<void>} Resolves after initializing the greeting display and auth listener.
 */
async function greetings() {
  const daytimeElem = document.getElementById('greetingTime');
  const nameElem = document.getElementById('greetingName');

  // determine time-based message
  const hour = new Date().getHours();
  let greetingText;
  if (hour < 12) greetingText = 'Good morning';
  else if (hour < 18) greetingText = 'Good afternoon';
  else greetingText = 'Good evening';

  if (daytimeElem) {
    daytimeElem.textContent = greetingText;
  }

  // BUGFIX email is the wrong name to use for greeting. It musst use the user name or displayuser name
  // BUGFIX the displayuser name in firebase is dosn't the right name
  /**
   * Assigns the displayed username depending on the authentication state.
   *
   * If a logged-in user exists and is not anonymous, their display name
   * or email will be shown. Otherwise, the label "Guest" will be used.
   *
   * @param {Object|null} user - The authenticated user object from Firebase Auth.
   * @param {string} [user.displayName] - The user's display name.
   * @param {string} [user.email] - The user's email address.
   * @param {boolean} [user.isAnonymous] - Indicates whether the user is anonymous.
   * @returns {void}
   */
  function assignName(user) {
    if (!nameElem) return;
    if (user && !user.isAnonymous) {
      nameElem.textContent = user.displayName || user.email || 'User';
    } else {
      nameElem.textContent = 'Guest';
    }
  }

  assignName(auth.currentUser);
  onAuthStateChanged(auth, assignName);
}

function urgentTasksDeadLine(tasks) {
    const urgentTasks = tasks
        .filter(task => task.priority === "urgent" && task.due_date)
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

    if (urgentTasks.length > 0) {
        const nextDate = new Date(urgentTasks[0].due_date);

        document.getElementById("urgentTasks-dead-line").textContent =
            nextDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });
    }
}


window.addEventListener('load', initSummary);
