import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { BASE_URL } from "./firebase.js";

let contacts = [];
let tasks = [];
let category = [];

export async function loadData() {
  let contacts = await fetch(BASE_URL + "contacts" + ".json");
  let contactsToJson = await contacts.json();
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
    return {};                 // Return an empty Object so renderBoard() won't crash
  }
  return data;
}


loadTasks();
