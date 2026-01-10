import { getSidebarTemplate } from '../scripts/templates.js';

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = getSidebarTemplate();
});
