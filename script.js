import { getHeaderTemplate, getSidebarTemplate } from './scripts/templates.js';

init();

async function init() {
    render();
}

function render() {
    renderHeader();
    renderSidebar();
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
