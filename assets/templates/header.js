import { getHeaderTemplate } from '../../scripts/templates.js';

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  header.innerHTML = getHeaderTemplate();
});
