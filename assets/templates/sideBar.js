import { getSidebarTemplate } from '/member/js/member-templates.js';

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = getSidebarTemplate();
});
