export function getSidebarTemplate() {
    return `
      <div class="logo">
        <img src="./assets/img/joinlogo.png" alt="" srcset="">
      </div>

      <nav class="nav">
        <a class="nav-item" href="summary_user.html"><img src="./assets/icons/sideMenu/summary1.png" alt="Summary" class="nav-icon">Summary</a>
        <a class="nav-item" href="add_task.html"><img src="./assets/icons/sideMenu/addtask1.png" alt="Add Task" class="nav-icon">Add Task</a>
        <a class="nav-item" href="#"><img src="./assets/icons/sideMenu/board1.png" alt="Board" class="nav-icon">Board</a>
        <a class="nav-item" href="#"><img src="./assets/icons/sideMenu/contacs1.png" alt="Contacts" class="nav-icon">Contacts</a>
      </nav>

      <div class="legal">
        <a>Privacy Policy</a>
        <a>Legal Notice</a>
      </div>
    `;
}

export function getHeaderTemplate() {
    return `
        <div class="topbar-left">Kanban Project Management Tool</div>
        <div class="topbar-right">
            <div class="help-circle" title="Help">?</div>
            <div id="headerMenue" class="profile">
                SM
                <nav id="headerMenueNav" class="header-menue-nav bg-menue color-menue d_none">
                    <ul>
                        <a href="legal_notice.html">Legal Notice</a>
                    </ul>
                    <ul>
                        <a href="privacy_policy.html">Privacy Policy</a>
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
}

export function getTaskTemplate() {
    return `
     <section class="overlay_add_task">
        <h1 class="h1_add_task">Add Task</h1>
            <section class="section_add_task">

            <section>
                <form class="form_add_task">
                    <label for="title">Title*</label>
                    <input class="input_add_task" type="text" id="title" name="title" required placeholder="Enter a title">

                 

                    <label for="description">Description</label>
                    <textarea class="textarea_add_task" id="description" name="description" required placeholder="Enter a Description"></textarea>

                   
                    <label for="due_date">Due date*</label>
                    <input class="input_add_task" type="date" id="due_date" name="due_date" required placeholder="dd/mm/yyyy">
                </form>
            </section>

            <hr class="hr_add_task">

            <form class="select_add_task">
                <section class="section_priority">
                    <label for="priority">Priority</label>
                    <div id="priority" class="priority" name="priority">
                        <button class="priority_button" value="low">Urgent <img src="assets\icons\Property 1=Urgent.svg" alt=""></button>
                        <button class="priority_button" value="medium">Medium <img src="assets\icons\Property 1=Medium.svg" alt=""></button>
                        <button class="priority_button" value="high">Low <img src="assets\icons\Property 1=Low.svg" alt=""></button>
                    </div>
                </section>
       
                <label for="">Assigned to</label>
                <select class="input_add_task margin_bottom_add_task" type="text" id="assigned_to" name="assigned_to" required
                    placeholder="Select contacts to assign">
                    <option value="select_contact">Select contacts to assign</option>
                    <option value="contact_1">Contact 1</option>
                    <option value="contact_2">Contact 2</option>
                    <option value="contact_3">Contact 3</option>
                </select>


                <label for="">Category</label>
                <select class="input_add_task margin_bottom_add_task" id="category" name="category" required placeholder="">
                    <option value="select_task_category">Select task category</option>
                    <option value="technical_task">Technical Task</option>
                    <option value="user_story">User Story</option>
                </select>


                <label for="">Subtasks</label>
                <input class="input_add_task" type="text" id="subtask" name="subtask" placeholder="Add new subtask">
            </form>
        </section>
        <section class="section_add_task_button">
            <button class="clear_button_add_task" type="button">Cancel <img src="assets\icons\close.svg" alt=""></button>
            <button class="Create_button_add_task" type="submit">Create Task <img src="assets\icons\check.svg" alt=""></button>
        </section>
    </section>
    `;
}