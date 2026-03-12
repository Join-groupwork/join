import { pushTask } from '../../scripts/firebase/push-task.js';

/**
 * Initializes the task creation page after the DOM is fully loaded.
 * 
 * Sets up:
 * - Priority button selection handling
 * - Create task button logic (including validation and Firebase push)
 * * - Cancel button navigation behavior
 * 
 * @event DOMContentLoaded
 */

document.addEventListener('DOMContentLoaded', () => {
  const createBtn = document.querySelector('.Create_button_add_task');
  const cancelBtn = document.querySelector('.clear_button_add_task');
  const titleInput = document.getElementById('title');
  const descInput = document.getElementById('description');
  const dueInput = document.getElementById('due_date');
  const assignedSelect = document.getElementById('assigned_to');
  const categorySelect = document.getElementById('category');
  const subtaskInput = document.getElementById('subtask');
  const priorityButtons = document.querySelectorAll('.priority_button');

  let selectedPriority = null;

  /**
   * Handles priority button selection.
   * 
   * Removes the "selected" class from all priority buttons,
   * assigns it to the clicked button and stores the selected value.
   * 
   * @param {MouseEvent} e - The click event object.
   */

  priorityButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      priorityButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedPriority = btn.value || btn.getAttribute('value') || btn.textContent.trim();
    });
  });

  if (createBtn) {

    /**
     * Handles the task creation process.
     * 
     * Validates input, constructs the task object,
     * sends it to Firebase using pushTask(),
     * and redirects to the board page on success.
     * 
     * @async
     * @param {MouseEvent} e - The click event object.
     * @returns {Promise<void>}
     */

    createBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const title = titleInput?.value?.trim();
      if (!title) { alert('Title required'); return; }
      const taskData = {
        title,
        description: descInput?.value?.trim() || '',
        due_date: dueInput?.value || '',
        priority: selectedPriority || 'low',
        assigned_to: assignedSelect?.value || '',
        category: categorySelect?.value || '',
        subtask: subtaskInput?.value?.trim() || "",
        status: 'todo',
        createdAt: new Date().toISOString()
      };
      try {
        createBtn.disabled = true;
        const key = await pushTask(taskData);
        console.log('Pushed task, key:', key);
        alert('Task created successfully');
        window.location.href = '/member/board.html';
      } catch (err) {
        console.error(err);
        alert('Failed to create task');
      } finally {
        createBtn.disabled = false;
      }
    });
  }

  if (cancelBtn) {

    /**
     * Handles cancel button click.
     * 
     * Prevents default behavior and navigates back
     * to the previous page in browser history.
     * 
     * @param {MouseEvent} e - The click event object.
     */

    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.history.back();
    });
  }
});