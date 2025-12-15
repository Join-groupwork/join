export function getSidebarTemplate() {
    return `
      <div class="logo">
        <img src="./assets/img/joinlogo.png" alt="" srcset="">
      </div>

      <nav class="nav">
        <a class="nav-item"><img src="./assets/icons/sideMenu/summary1.png" alt="Summary" class="nav-icon">Summary</a>
        <a class="nav-item"><img src="./assets/icons/sideMenu/addtask1.png" alt="Add Task" class="nav-icon">Add Task</a>
        <a class="nav-item"><img src="./assets/icons/sideMenu/board1.png" alt="Board" class="nav-icon">Board</a>
        <a class="nav-item"><img src="./assets/icons/sideMenu/contacs1.png" alt="Contacts" class="nav-icon">Contacts</a>
      </nav>

      <div class="legal">
        <a>Privacy Policy</a>
        <a>Legal Notice</a>
      </div>
    `;
}

export function getHeaderTemplate() {
    return `
        <div>Kanban Project Management Tool</div>
        <div class="topbar-right">
          <div class="help-circle" title="Help">?</div>
          <div class="profile">SM</div>
        </div>
      `;
}

