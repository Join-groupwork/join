
import { database, auth, BASE_URL } from './firebase.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { renderContactsList } from '../../member/js/contacts.js';



let contacts = {};
let tasks = {};
let category = {};

export function getContacts() {
  return contacts; 
}

//  authentifizierung
auth.onAuthStateChanged((user) => {
  if (user) {
    // console.log('User authenticated:', user.uid);
    loadData();
  } else {
    console.error('No user authenticated');
  }
});



// Daten laden
export function loadData(onContactsLoaded) {
  const contactsRef = ref(database, 'contacts');
  // contacts auslesen
  onValue(contactsRef, (firebaseData) => {
    contacts = firebaseData.val() || {};

    if (document.getElementById('contact_list')) {
      renderContactsList(contacts);
    }
    if (onContactsLoaded) onContactsLoaded();
  }, (error) => {
    console.error('Fehler beim Laden der Contacts:', error);
  });

  const tasksRef = ref(database, 'tasks');
  // tasks auslesen
  onValue(tasksRef, (firebaseData) => {
    tasks = firebaseData.val() || {};
    console.log('Tasks loaded:', tasks);
  });

  const categoryRef = ref(database, 'category');
  // category auslesen
  onValue(categoryRef, (firebaseData) => {
    category = firebaseData.val() || {};
  });
}

export async function loadTasks() {
  const response = await fetch(`${BASE_URL}tasks.json`);
  const data = await response.json();
  // Check if there is any data
  if (!data) {
    console.log("No Tasks");   // If there are no tasks, log a message
    return {};                 // Return an empty Object so renderBoard() won't crash
  }
  return data;
  const categoryRef = ref(database, 'category');
  // category auslesen
  onValue(categoryRef, (firebaseData) => {
    category = firebaseData.val() || {};
  });
}
// export async function loadTasks() {
//   const response = await fetch(`${BASE_URL}tasks.json`);
//   const data = await response.json();
//   // Check if there is any data
//   if (!data) {
//     console.log("No Tasks");   // If there are no tasks, log a message
//     return {};                 // Return an empty Object so renderBoard() won't crash
//   }
//   return data;

// }
