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
import { getAddOverlayTemplate, getActiveContactTemplate, getEditOverlayTemplate } from '/member/js/member-templates.js';

let contacts = {};
let tasks = {};
let category = {};
let activeContactId = null;
let editingContactId = null;

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
    const contactList = getContactListElement();
    if (!contactList) return;

    renderGroupedContacts(contactList, contactsObjects);
    rerenderActiveContactDetail(contactsObjects);
}

function getContactListElement() {
    return document.getElementById('contact_list');
}

function renderGroupedContacts(contactList, contactsObjects) {
    const groupedContacts = groupContactsByLetter(contactsObjects);
    resetContactListExceptAddButton(contactList);
    renderAlphabeticalContactSections(contactList, groupedContacts);
}

function rerenderActiveContactDetail(contactsObjects) {
    if (!activeContactId) return;
    const activeContact = contactsObjects[activeContactId];
    if (!activeContact) return;
    renderActiveContactTemplate(activeContact);
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
    setActiveContactId(contactId);
    clearActiveContactClass();
    activateContactListItem(contactId);
    renderActiveContactDetail(contactData);
}

function setActiveContactId(contactId) {
    activeContactId = contactId;
}

function clearActiveContactClass() {
    document.querySelectorAll('.contact_item--active')
        .forEach(element => element.classList.remove('contact_item--active'));
}

function activateContactListItem(contactId) {
    const item = getContactListItemById(contactId);
    if (!item) return;
    item.classList.add('contact_item--active');
}

function getContactListItemById(contactId) {
    return document.querySelector(`[data-contact-id="${contactId}"]`);
}

function renderActiveContactDetail(contactData) {
    renderActiveContactTemplate(contactData);
}


function renderActiveContactTemplate(contact) {
  const container = getContactDetailContainer();
  if (!container) return;

  const initials = getInitials(contact.name || '');
  const bgColor = getAvatarColor(contact.name || '');
  const phone = contact.phone || '-';

  container.innerHTML = getActiveContactTemplate(contact, initials, bgColor, phone);
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

    const form = document.getElementById('add_contact_form');
    if (form) form.onsubmit = handleAddContact;
}

export function hideAddContactOverlay() {
    const overlay = document.getElementById('contact-add-overlay');
    if (!overlay) return;
    
    overlay.style.display = 'none';
    overlay.innerHTML = '';
}

// Kontakt in Firebase speichern
async function handleAddContact(event) {
    if (event) event.preventDefault();
    const fields = getAddContactFields();
    if (!hasRequiredAddContactFields(fields)) return;

    const payload = buildAddContactPayload(fields);
    if (!isValidAddContactPayload(payload)) return;

    const uid = getCurrentUserId();
    if (!uid) return;

    await saveNewContact(payload, uid);
    hideAddContactOverlay();
    showSuccessMessage('Contact successfully created!');
}

function getAddContactFields() {
    return {
        nameInput: document.getElementById('contact_name'),
        emailInput: document.getElementById('contact_email'),
        phoneInput: document.getElementById('contact_phone')
    };
}

function hasRequiredAddContactFields(fields) {
    const hasFields = Boolean(fields.nameInput && fields.emailInput);
    if (!hasFields) console.error('Formular-Felder nicht gefunden!');
    return hasFields;
}

function buildAddContactPayload(fields) {
    return {
        name: fields.nameInput.value.trim(),
        email: fields.emailInput.value.trim(),
        phone: fields.phoneInput ? fields.phoneInput.value.trim() : ''
    };
}

function isValidAddContactPayload(payload) {
    return Boolean(payload.name && payload.email);
}

function getCurrentUserId() {
    return auth.currentUser ? auth.currentUser.uid : null;
}

async function saveNewContact(payload, uid) {
    const contactsRef = ref(database, 'contacts');
    const newContactRef = push(contactsRef);
    const newContact = {
        ...payload,
        createdAT: Date.now(),
        uid: uid
    };

    try {
        await set(newContactRef, newContact);
    } catch (error) {
        console.error('Fehler beim Speichern:', error);
        throw error;
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
    if (!isDeletableContact(contactId)) return;

    try {
        await removeContactFromDatabase(contactId);
        clearActiveContactIfDeleted(contactId);
    } catch (error) {
        logDeleteContactError(error);
    }
}

function isDeletableContact(contactId) {
    return Boolean(contactId);
}

async function removeContactFromDatabase(contactId) {
    const contactRef = ref(database, `contacts/${contactId}`);
    await remove(contactRef);
}

function clearActiveContactIfDeleted(contactId) {
    if (activeContactId !== contactId) return;
    resetActiveContactDetail();
}

function resetActiveContactDetail() {
    activeContactId = null;
    renderEmptyContactDetail();
}

function renderEmptyContactDetail() {
    const detailContainer = getContactDetailContainer();
    if (!detailContainer) return;
    detailContainer.innerHTML = getEmptyContactDetailTemplate();
}

function logDeleteContactError(error) {
    console.error('Fehler beim Löschen des Kontakts:', error);
}


function editContact(contactId) {
    if (!isEditableContact(contactId)) return;

    editingContactId = contactId;
    const overlay = getEditOverlayElement();
    if (!overlay) return;

    renderEditOverlay(overlay, contactId);
    bindEditFormSubmit();
}

function isEditableContact(contactId) {
    return Boolean(contactId && contacts[contactId]);
}

function getEditOverlayElement() {
    return document.getElementById('editC_overlay');
}



function renderEditOverlay(overlay, contactId) {
    const contact = contacts[contactId];
    const initials = getInitials(contact.name || '');
    const color = getAvatarColor(contact.name || '');

    overlay.innerHTML = getEditOverlayTemplate(contactId, contact, initials, color);
    overlay.classList.remove('d_none');
    overlay.onclick = closeEditOverlay;
}

function bindEditFormSubmit() {
    const form = document.getElementById('edit_contact_form');
    if (!form) return;

    form.removeEventListener('submit', saveEditedContact);
    form.addEventListener('submit', saveEditedContact);
}



function closeEditOverlay() {
    const overlay = document.getElementById('editC_overlay');
    if (!overlay) return;
    overlay.classList.add('d_none');
    overlay.innerHTML = '';
    editingContactId = null;
}




async function saveEditedContact(event) {
    preventDefaultIfPresent(event);
    if (!canSaveEditedContact()) return;

    const payload = getEditedContactPayload();
    if (!isValidEditedContactPayload(payload)) return;

    try {
        await persistEditedContact(payload);
        applyEditedContactLocally(payload);
        rerenderAfterContactEdit();
        closeEditOverlay();
    } catch (error) {
        logEditContactError(error);
    }
}

function preventDefaultIfPresent(event) {
    if (event) event.preventDefault();
}

function canSaveEditedContact() {
    return Boolean(editingContactId);
}

function getEditedContactPayload() {
    return {
        name: getTrimmedInputValue('contact_name'),
        email: getTrimmedInputValue('contact_email'),
        phone: getTrimmedInputValue('contact_phone')
    };
}

function getTrimmedInputValue(elementId) {
    return document.getElementById(elementId)?.value.trim() || '';
}

function isValidEditedContactPayload(payload) {
    return Boolean(payload.name && payload.email);
}

async function persistEditedContact(payload) {
    const contactRef = ref(database, `contacts/${editingContactId}`);
    await update(contactRef, payload);
}

function applyEditedContactLocally(payload) {
    contacts[editingContactId] = {
        ...contacts[editingContactId],
        ...payload,
        id: editingContactId
    };
}

function rerenderAfterContactEdit() {
    renderContactsList(contacts);
    renderEditedContactDetail();
}

function renderEditedContactDetail() {
    const contact = contacts[editingContactId];
    if (!contact) return;
    renderActiveContactTemplate(contact);
}

function logEditContactError(error) {
    console.error('Edit fehlgeschlagen:', error);
}

// Make functions globally accessible

window.deleteContact = deleteContact;
window.showAddContactOverlay = showAddContactOverlay;
window.hideAddContactOverlay = hideAddContactOverlay;
window.editContact = editContact;
window.handleAddContact = handleAddContact; 
window.closeEditOverlay = closeEditOverlay;
window.saveEditedContact = saveEditedContact;