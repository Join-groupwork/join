import { getHeaderTemplate, getSidebarTemplate, getTaskTemplate } from './scripts/templates.js';

init();

async function init() {
    render();
}

function render() {
    renderHeader();
    renderSidebar();
    renderAddTask()
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