import { getHeaderTemplate, getSidebarTemplate, getTaskTemplate, getEditOverlayTemplate, getAddOverlayTemplate } from './scripts/templates.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase.js";

init();

async function init() {
    render();
}

function render() {
    renderHeader();
    renderSidebar();
    renderAddTask();
    // renderContactAddOverlay();   <-- Aktivieren, um das Overlay zum Hinzufügen von Kontakten anzuzeigen
    // renderContactEditOverlay(); Contact
}

function renderHeader() {
    const headerRef = document.getElementById('header');
    if (headerRef) {
        headerRef.innerHTML = getHeaderTemplate();
    } else {
        console.error('Header-Element nicht gefunden!');
    }
}

function renderSidebar() {
    const sidebarRef = document.getElementById('sidebar');
    if (sidebarRef) {
        sidebarRef.innerHTML = getSidebarTemplate();
    } else {
        console.error('Sidebar-Element nicht gefunden!');
    }
}

function renderAddTask() {
    const addTaskRef = document.getElementById('add_task');
    if (addTaskRef) {
        addTaskRef.innerHTML = getTaskTemplate();
    } else {
        console.error('Add Task-Element nicht gefunden!');
    }
}



function renderContactEditOverlay() {
    const editContactRef = document.getElementById('editC_overlay');
    if (editContactRef) {
        editContactRef.innerHTML = getEditOverlayTemplate();
    } else {
        console.error('ContactOverlay-Element nicht gefunden!');
    }
}

function renderContactAddOverlay() {
    const addContactRef = document.getElementById('addC_overlay');
    if (addContactRef) {
        addContactRef.innerHTML = getAddOverlayTemplate();
    } else {
        console.error('ContactOverlay-Element nicht gefunden!');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const profileBtn = document.getElementById('headerMenue');
    const logoutBtn = document.getElementById('logoutBtn');
    const headerMenueNav = document.getElementById('headerMenueNav');

    profileBtn.addEventListener('click', () => {
        headerMenueNav.classList.toggle('d_none');
    })

    logoutBtn.addEventListener('click', () => {
        try {
            const userCredential = signOut(auth);
            console.log("Logout erfolgreich:", userCredential.user);
            window.location.href = "index.html"; // target page after Logout
        } catch (error) {
            console.error("Logout Fehlgeschlagen:", error.message);
            alert("Logout fehlgeschlagen");
        }
    })
})