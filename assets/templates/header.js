import { getHeaderTemplate } from '/member/js/member-templates.js';

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  header.innerHTML = getHeaderTemplate();
});
