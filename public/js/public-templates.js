export function getHeaderTemplate() {
  return `
        <div class="topbar-left">Kanban Project Management Tool</div>
        <div class="topbar-right">
            <div class="help-circle" title="Help">?</div>
            <div id="headerMenue" class="profile">
                SM
                <nav id="headerMenueNav" class="header-menue-nav bg-menue color-menue d_none">
                    <ul>
                        <a href="/pubpic/legal-notice-public.html">Legal Notice</a>
                    </ul>
                    <ul>
                        <a href="/public/privacy-policy-public.html">Privacy Policy</a>
                    </ul>
                    <ul>
                        <a id="logoutBtn">
                            Log out
                        </a>
                    <ul/>
                </nav>
            </div>
        </div>
      `;

} export function getSidebarTemplate() {
  return `
      <div class="logo">
        <img src="../assets/img/joinlogo.png" alt="" >
      </div>

      <nav class="nav">
        <a class="nav-item" href="./summary_user.html"><img src="/assets/icons/sideMenu/summary1.png" alt="Summary" class="nav-icon">Summary</a>
        <a class="nav-item" href="./add_task.html"><img src="/assets/icons/sideMenu/addtask1.png" alt="Add Task" class="nav-icon">Add Task</a>
        <a class="nav-item" href="./board.html"><img src="/assets/icons/sideMenu/board1.png" alt="Board" class="nav-icon">Board</a>
        <a class="nav-item" href="./contacts.html"><img src="/assets/icons/sideMenu/contacs1.png" alt="Contacts" class="nav-icon">Contacts</a>
      </nav>

      <div class="legal">
        <a href="/public/privacy-policy-public.html">Privacy Policy</a>
        <a href="/public/legal-notice-public.html">Legal Notice</a>
      </div>
    `;
}

export function signupMassegeTemplate() {
  return `
        <aside class="signup-massege-box">
            <p>
                You Signed Up successfully
            </p>
        </aside>
    `
}
