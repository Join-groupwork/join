import { pushTask } from '../../scripts/firebase/push-task.js';

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
  priorityButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      priorityButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedPriority = btn.value || btn.getAttribute('value') || btn.textContent.trim();
    });
  });

  if (createBtn) {
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
    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.history.back();
    });
  }
});