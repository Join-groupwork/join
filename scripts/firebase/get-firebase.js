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
import { ref, onValue, push, set, update, remove } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { getAddOverlayTemplate } from '/member/js/member-templates.js';

let contacts = {};
let tasks = {};
let category = {};
let activeContactId = null;

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

    // Falls bereits ein Kontakt aktiv war, Detailansicht neu rendern
    if (activeContactId && contactsObjects[activeContactId]) {
        renderActiveContactTemplate(contactsObjects[activeContactId]);
    }
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
    listItem.dataset.contactId = contact.id;
    listItem.innerHTML = getContactItemTemplate(contact);

    if (contact.id === activeContactId) {
        listItem.classList.add('contact_item--active');
    }

    listItem.addEventListener('click', () => {
        setActiveContact(contact.id, contact);
    });

    return listItem;
}

function setActiveContact(contactId, contactData) {
    activeContactId = contactId;

    document.querySelectorAll('.contact_item.contact_item--active')
        .forEach(item => item.classList.remove('contact_item--active'));

    const currentItem = document.querySelector(`.contact_item[data-contact-id="${contactId}"]`);
    if (currentItem) {
        currentItem.classList.add('contact_item--active');
    }

    renderActiveContactTemplate(contactData);
}

function renderActiveContactTemplate(contact) {
    const detailContainer = getContactDetailContainer();
    if (!detailContainer) return;

    detailContainer.innerHTML = getActiveContactTemplate(contact);
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

function getContactDetailContainer() {
    return (
        document.getElementById('contact_detail') ||
        document.getElementById('contact-detail') ||
        document.querySelector('.contact_detail')
    );
}

function getActiveContactTemplate(contact) {
    const initials = getInitials(contact.name || '');
    const bgColor = getAvatarColor(contact.name || '');
    const phone = contact.phone ? contact.phone : '-';

    return `
        <section class="contact_detail_card contact_detail_card--enter">
            <div class="contact_detail_header">
                <div class="contact_avatar contact_avatar--large" style="background-color: ${bgColor}">
                    ${initials}
                </div>
                <div>
                    <h2 class="contact_detail_name">${contact.name || ''}</h2>
                    <div class="contact_detail_actions">
                        <button type="button" class="link_btn" onclick="editContact('${contact.id}')">Edit</button>
                        <button type="button" class="link_btn" onclick="deleteContact('${contact.id}')">Delete</button>
                    </div>
                </div>
            </div>

            <h3 class="contact_detail_subtitle">Contact Information</h3>

            <div class="contact_detail_info">
                <strong>Email</strong>
                <a href="mailto:${contact.email || ''}">${contact.email || ''}</a>
            </div>

            <div class="contact_detail_info">
                <strong>Phone</strong>
                <a href="tel:${phone}">${phone}</a>
            </div>
        </section>
    `;
}

function getEditOverlayTemplate(contactId, contact) {
    return `
        <section class="overlay_add_contact">
            <div class="overlay_add_contact_left">
                <img class="join_logo_overlay" src="assets/img/joinlogo.png" alt="Join Logo">
                <h2 class="heading_add_contact">Edit Contact</h2>
                <img class="h2_underline" src="assets/icons/Vector 5.svg" alt="">
            </div>

            <div class="overlay_add_contact_right">
                <div class="addContact_form_container">
                    <div>
                        <img src="assets/icons/Contact_icon.svg" alt="Contact Icon">
                    </div>

                    <form class="form_add_contact" onsubmit="event.preventDefault()">
                        <input type="text" id="contact_name" name="contact_name" class="input_add_contact"
                            placeholder="Name" value="${contact.name || ''}">
                        <input type="email" id="contact_email" name="contact_email" class="input_add_contact"
                            placeholder="Email" value="${contact.email || ''}">
                        <input type="tel" id="contact_phone" name="contact_phone" class="input_add_contact"
                            placeholder="Phone" value="${contact.phone || ''}">
                    </form>
                </div>

                <div class="buttons_add_contact">
                    <button type="button" class="btn_save_contact" onclick="deleteContact('${contactId}')">Delete</button>
                    <button type="button" class="btn_cancel_contact">Save <img src="assets/icons/check.svg" alt=""></button>
                </div>
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

// Kontakt in Firebase speichern
async function handleAddContact(event) {
    if (event) {
        event.preventDefault();
    }
    const nameInput = document.getElementById('contact_name');
    const emailInput = document.getElementById('contact_email');
    const phoneInput = document.getElementById('contact_phone');
    
    if (!nameInput || !emailInput) {
        console.error('Formular-Felder nicht gefunden!');
        return;
    }
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput ? phoneInput.value.trim() : '';
    
    if (!name || !email) {
        return;
    }
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
        return;
    }
    
    try {
        const contactsRef = ref(database, 'contacts');
        const newContactRef = push(contactsRef);
        const newContact = {
            name: name,
            email: email,
            phone: phone,
            createdAT: Date.now(),
            uid: currentUser.uid
        };
        
        await set(newContactRef, newContact);
        hideAddContactOverlay();
        showSuccessMessage('Contact successfully created!');
        
    } catch (error) {
        console.error('Fehler beim Speichern:', error);
    }
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success_message';
    successDiv.textContent = message;

    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 500);
}

function getEmptyContactDetailTemplate() {
    return `   
    `;
}

async function deleteContact(contactId) {
    if (!contactId) return;

    try {
        await remove(ref(database, `contacts/${contactId}`));

        if (activeContactId === contactId) {
            activeContactId = null;
            const detailContainer = getContactDetailContainer();
            if (detailContainer) detailContainer.innerHTML = getEmptyContactDetailTemplate();
        }
    } catch (error) {
        console.error('Fehler beim Löschen des Kontakts:', error);
    }
}

function editContact(contactId) {
    const overlay = document.getElementById('contact-add-overlay');
    if (!overlay) return;

    const contact = contacts[contactId];
    if (!contact) {
        console.error('Kontakt nicht gefunden:', contactId);
        return;
    }

    overlay.innerHTML = getEditOverlayTemplate(contactId, contact);
    overlay.style.display = 'flex';
}


// Make functions globally accessible

window.deleteContact = deleteContact;
window.showAddContactOverlay = showAddContactOverlay;
window.hideAddContactOverlay = hideAddContactOverlay;
window.editContact = editContact;
window.handleAddContact = handleAddContact; 