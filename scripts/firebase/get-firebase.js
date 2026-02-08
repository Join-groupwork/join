// const BASE_URL = "https://join-ae525-default-rtdb.europe-west1.firebasedatabase.app/";

// let contacts = [];
// let tasks = [];
// let category = [];

// async function loadData(){
//     let contacts = await fetch (BASE_URL + ".json");
//     let contactsToJson = await contacts.json();
//     console.log(contactsToJson);

// }

// loadData();


import { database, auth } from '/scripts/firebase/firebase.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { getAddOverlayTemplate } from '/member/js/member-templates.js';

let contacts = {};
let tasks = {};
let category = {};

//  authentifizierung 
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User authenticated:', user.uid);
        loadData();
    } else {
        console.log('No user authenticated');
    }
});

// Daten laden
function loadData() {
    const contactsRef = ref(database, 'contacts');
    // contacts auslesen
    onValue(contactsRef, (firebaseData) => {
        contacts = firebaseData.val() || {};
        console.log('Contacts loaded:', contacts);

        if (document.getElementById('contact_list')) {
            renderContactsList(contacts);
        }
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
        console.log('Category loaded:', category);
    });
}


function groupContactsByLetter(contactsObjects) {
    const grouped = {};
    // gruppieren nach erstem buchstaben
    Object.entries(contactsObjects).forEach(([id, contact]) => {
        const firstLetter = contact.name.charAt(0).toUpperCase();

        if (!grouped[firstLetter]) {
            grouped[firstLetter] = [];
        }

        grouped[firstLetter].push({
            id: id,
            ...contact
            // spread operator ...contact -- open all properties of contact object
            // other way 
            // contact.contact.id
            // contact.contact.name
            // contact.contact.email

        });
    });

    Object.keys(grouped).forEach(letter => {
        grouped[letter].sort((a, b) => a.name.localeCompare(b.name));
    });

    return grouped;
}


function renderContactsList(contactsObjects) {
    const contactList = document.getElementById('contact_list');
    if (!contactList) return;

    const groupedContacts = groupContactsByLetter(contactsObjects);
    resetContactListExceptAddButton(contactList);
    renderAlphabeticalContactSections(contactList, groupedContacts);
}

function resetContactListExceptAddButton(contactList) {
    const addButton = contactList.querySelector('.contact_btn_addNew');
    contactList.innerHTML = '';
    if (addButton) {
        contactList.appendChild(addButton);
    }
}


function renderAlphabeticalContactSections(contactList, groupedContacts) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    alphabet.forEach(letter => {
        createLetterSectionHeader(contactList, letter);
        renderContactsUnderLetter(contactList, letter, groupedContacts);
    });
}

function createLetterSectionHeader(contactList, letter) {
    const letterLabel = document.createElement('label');
    letterLabel.className = 'labelfor_contactList';
    letterLabel.setAttribute('for', 'alphabet');
    letterLabel.textContent = letter;
    contactList.appendChild(letterLabel);

    const divider = document.createElement('hr');
    divider.className = 'hr_contactList';
    contactList.appendChild(divider);
}

function renderContactsUnderLetter(contactList, letter, groupedContacts) {
    if (!groupedContacts[letter]) return;

    const contactsOrderedList = document.createElement('ol');
    
    groupedContacts[letter].forEach(contact => {
        const contactItem = buildContactListItem(contact);
        contactsOrderedList.appendChild(contactItem);
    });

    contactList.appendChild(contactsOrderedList);
}

function buildContactListItem(contact) {
    const listItem = document.createElement('li');
    listItem.className = 'contact_item';
    listItem.innerHTML = getContactItemTemplate(contact);
    return listItem;
}


function getContactItemTemplate(contact) {
    const initials = getInitials(contact.name);
    const bgColor = getAvatarColor(contact.name);

    return `
        <section class="contact_container">
            <div class="contact_avatar" style="background-color: ${bgColor}">
                ${initials}
            </div>
            <div class="contact_info">
                <div class="contact_name">${contact.name}</div>
                <div class="contact_email">${contact.email}</div>
            </div>
        </section>
    `;
}

function getInitials(name) {
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
}

function getAvatarColor(name) {
    const colors = [
        '#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF',
        '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E',
        '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B'
    ];

    let hash = 0;
    for (let indexContacts = 0; indexContacts < name.length; indexContacts++) {
        hash = name.charCodeAt(indexContacts) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
}

export function showAddContactOverlay() {
    const overlay = document.getElementById('contact-add-overlay');
    if (!overlay) return;
    
    overlay.innerHTML = getAddOverlayTemplate();
    overlay.style.display = 'flex';
}

export function hideAddContactOverlay() {
    const overlay = document.getElementById('contact-add-overlay');
    if (!overlay) return;
    
    overlay.style.display = 'none';
    overlay.innerHTML = '';
}


// Make functions globally accessible
window.showAddContactOverlay = showAddContactOverlay;
window.hideAddContactOverlay = hideAddContactOverlay;