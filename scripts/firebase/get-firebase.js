/**
 * @module get-firebase
 */
import { BASE_URL } from '/scripts/firebase/firebase.js';

// const BASE_URL = "https://join-ae525-default-rtdb.europe-west1.firebasedatabase.app/";
// const BASE_URL = app.options.databaseURL;

let contacts = [];
let tasks = [];
let category = [];

/**
 *
 */
async function loadData() {
  const resp = await fetch(`${BASE_URL}.json`);
  const contactsToJson = await resp.json();
  console.log(contactsToJson);
}


/**
 *
 * @returns
 */
export async function loadTasks() {
  const response = await fetch(`${BASE_URL}tasks.json`);

  const data = await response.json();

  // Check if there is any data
  if (!data) {
    console.log("No Tasks");   // If there are no tasks, log a message
    return [];                 // Return an empty array so renderBoard() won't crash
  }
  // Prepare the global array to store the tasks
  tasks = [];
  for (let key in data) {
    // Push each task into the array
    // key = task ID, data[key] = all task details
    tasks.push({
      key,
      ...data[key]
    });
  }
  return tasks;
}

loadTasks();
loadData();
