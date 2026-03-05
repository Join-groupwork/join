import { database } from '/scripts/firebase/firebase.js';

const BASE_URL = database.databaseURL;

let contacts = [];
let tasks = [];
let category = [];

async function loadData(){
    let contacts = await fetch (BASE_URL + ".json");
    let contactsToJson = await contacts.json();
    console.log(contactsToJson);

}

/**
 * Fetches all tasks from the backend and converts them into an array.
 * Each task object will contain its unique key (ID) and the task data.
 *
 * If no tasks exist in the database, an empty array is returned
 * to prevent errors in functions that render the board.
 *
 * @async
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of task objects.
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
