/**
 * @file
 * Provides Firebasew Realtime Database utilities
 * for storing task data.
 *
 * @module push-task
 */
import { database } from '/scripts/firebase/firebase.js';
import { ref, push } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

/**
 * Saves a task object to Firebase Realtime Database.
 *
 * @param {Todo} taskData - Todo object to store
 * @returns {Promise<string | null>} Firebase key of the created task
 */
export async function pushTask(taskData) {
    try {
        const tasksRef = ref(database, "tasks");
        const newTaskRef = await push(tasksRef, taskData);
        console.log("Task saved with Key:", newTaskRef.key);
        return newTaskRef.key;
    } catch (error) {
        console.error("Error while saving Tasks:", error.message || error);
        throw error;
    }
}
