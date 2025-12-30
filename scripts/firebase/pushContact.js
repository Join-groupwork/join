import { database } from '/firebase.js';
import { ref, push } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

export async function pushContact(contactData) {
    try {
        const contactsRef = ref(database, "contacts");
        const newContactRef = await push(contactsRef, contactData);
        console.log("Contact gespeichert kmit Key:", newContactRef.key);
    } catch (error) {
        console.error("Fehler beim speichern des Contacts:", error.message);
    }
    // const contactsRef = ref(database, 'contacts');
    // return push(contactsRef, contactData);
}