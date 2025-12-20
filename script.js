import { getHeaderTemplate, getSidebarTemplate, getTaskTemplate, getEditOverlayTemplate, getAddOverlayTemplate } from './scripts/templates.js';

init();

async function init() {
    render();
}

function render() {
    renderHeader();
    renderSidebar();
    renderAddTask();
    // renderContactAddOverlay();   <-- Aktivieren, um das Overlay zum Hinzufügen von Kontakten anzuzeigen
    // renderContactEditOverlay();  
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
    const addTaskRef = document.getElementById('addC_overlay');
    if (addTaskRef) {
        addTaskRef.innerHTML = getAddOverlayTemplate();
    } else {
        console.error('ContactOverlay-Element nicht gefunden!');
    }
}
