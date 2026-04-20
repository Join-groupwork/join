import { database, auth } from '../../scripts/firebase/firebase.js';
import { ref, push, set, update, remove } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { getAddOverlayTemplate, getEditOverlayTemplate } from './member-templates.js';
import {
    renderContactsList as renderContactsListView,
    renderActiveContactTemplate,
    getContactDetailContainer,
    getInitials,
    getAvatarColor,
    getActiveContactId,
    setActiveContactId,
    closeMobileDetailView
} from './contacts-render.js';
let contacts = {};
let editingContactId = null;

export function renderContactsList(contactsObjects) {
    contacts = contactsObjects || {};
    renderContactsListView(contacts);
}

export function showAddContactOverlay() {
    const overlay = document.getElementById('contact-add-overlay');
    if (!overlay) return;

    overlay.innerHTML = getAddOverlayTemplate();
    overlay.style.display = 'flex';

    const addBtn = document.querySelector('.contact_mobile_add_btn');
    if (addBtn) addBtn.style.display = 'none';

    const form = document.getElementById('add_contact_form');
    if (form) form.onsubmit = handleAddContact;
}

export function hideAddContactOverlay() {
    const overlay = document.getElementById('contact-add-overlay');
    if (!overlay) return;

    overlay.style.display = 'none';
    overlay.innerHTML = '';

    const addBtn = document.querySelector('.contact_mobile_add_btn');
    if (addBtn && !document.body.classList.contains('contacts-mobile-detail-open')) {
        addBtn.style.display = '';
    }
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

const MOBILE_ACTION_CLOSE_MS = 140;
let mobileActionsCloseTimer = null;

function toggleContactMobileActions() {
    const menu = document.getElementById('contact_mobile_actions_menu');
    if (!menu) return;

    const isHidden = menu.classList.contains('d_none');
    if (isHidden) {
        clearTimeout(mobileActionsCloseTimer);
        menu.classList.remove('d_none', 'is-closing');
        return;
    }

    closeContactMobileActions(true);
}

function closeContactMobileActions() {
    const menu = document.getElementById('contact_mobile_actions_menu');
    if (!menu || menu.classList.contains('d_none')) return;

    clearTimeout(mobileActionsCloseTimer);
    menu.classList.add('is-closing');

    mobileActionsCloseTimer = setTimeout(() => {
        menu.classList.remove('is-closing');
        menu.classList.add('d_none');
    }, MOBILE_ACTION_CLOSE_MS);
}

function getEmptyContactDetailTemplate() {
    return `
    `;
}

async function deleteContact(contactId) {
    closeContactMobileActions();
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
    if (getActiveContactId() !== contactId) return;
    resetActiveContactDetail();
}

function resetActiveContactDetail() {
    setActiveContactId(null);
    closeMobileDetailView();
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
// rendern des edit overlays mit den bereits vorhandenen contact details
function renderEditOverlay(overlay, contactId) {
    const contact = contacts[contactId];
    const initials = getInitials(contact.name || '');
    const color = getAvatarColor(contact.name || '');

    overlay.innerHTML = getEditOverlayTemplate(contactId, contact, initials, color);
    overlay.classList.remove('d_none');
    overlay.onclick = closeEditOverlay;

    const addBtn = document.querySelector('.contact_mobile_add_btn');
    if (addBtn) addBtn.style.display = 'none';
}

function bindEditFormSubmit() {
    const form = document.getElementById('edit_contact_form');
    if (!form) return;

    form.removeEventListener('submit', saveEditedContact);
    form.addEventListener('submit', saveEditedContact);
}

function closeEditOverlay() {
    closeContactMobileActions();
    const overlay = document.getElementById('editC_overlay');
    if (!overlay) return;
    overlay.classList.add('d_none');
    overlay.innerHTML = '';
    editingContactId = null;

    const addBtn = document.querySelector('.contact_mobile_add_btn');
    if (addBtn && !document.body.classList.contains('contacts-mobile-detail-open')) {
        addBtn.style.display = '';
    }
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


document.addEventListener('click', (event) => {
    const menu = document.getElementById('contact_mobile_actions_menu');
    if (!menu) return;

    const clickedMenu = event.target.closest('#contact_mobile_actions_menu');
    const clickedFab = event.target.closest('.contact_mobile_fab_btn');

    if (clickedMenu || clickedFab) return;
    closeContactMobileActions();
});


window.deleteContact = deleteContact;
window.showAddContactOverlay = showAddContactOverlay;
window.hideAddContactOverlay = hideAddContactOverlay;
window.editContact = editContact;
window.handleAddContact = handleAddContact;
window.closeEditOverlay = closeEditOverlay;
window.saveEditedContact = saveEditedContact;
window.toggleContactMobileActions = toggleContactMobileActions;
