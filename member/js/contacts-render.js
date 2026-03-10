import { getActiveContactTemplate } from '/member/js/member-templates.js';

let contacts = {};
let activeContactId = null;

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

export function renderContactsList(contactsObjects) {
    contacts = contactsObjects || {};
    const contactList = getContactListElement();
    if (!contactList) return;

    renderGroupedContacts(contactList, contacts);
    rerenderActiveContactDetail(contacts);
}

function getContactListElement() {
    return document.getElementById('contact_list');
}
// rendern der contact list in alphabetischer Reihenfolge
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

export function setActiveContactId(contactId) {
    activeContactId = contactId;
}

export function getActiveContactId() {
    return activeContactId;
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

export function renderActiveContactTemplate(contact) {
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

export function getContactDetailContainer() {
    return (
        document.getElementById('contact_detail') ||
        document.getElementById('contact-detail') ||
        document.querySelector('.contact_detail')
    );
}

export function getInitials(name) {
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
}

export function getAvatarColor(name) {
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
