import { database, auth } from '/scripts/firebase/firebase.js';
import { ref, onValue, push, set, update, remove } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { getAddOverlayTemplate, getActiveContactTemplate, getEditOverlayTemplate } from '/member/js/member-templates.js';