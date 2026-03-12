// import { firebaseConfig } from "/scripts/firebase/firebase.js";
import { auth } from "./firebase.js";
import { BASE_URL } from "./firebase.js";

// const BASE_URL = firebaseConfig.databaseURL;
let todos = [];


/**
 *
 * @returns {void}
 */
async function getTask() {
  try {
    let tasks = await fetch(BASE_URL + "/tasks" + ".json");
    let tasksToJson = await tasks.json();
    console.log(tasksToJson);

  } catch (error) {
    return [];
  }
};

getTask();
