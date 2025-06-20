document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const taskDate = document.getElementById("taskDate");
  const taskPriority = document.getElementById("taskPriority");
  const addBtn = document.getElementById("addBtn");
  const taskList = document.getElementById("taskList");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  renderTasks();

  addBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    const date = taskDate.value;
    const priority = taskPriority.value;

    if (text !== "") {
      tasks.push({ text, date, priority, completed: false });
      updateTasks();
      taskInput.value = "";
      taskDate.value = "";
      taskPriority.value = "Low";
    }
  });

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      if (task.completed) li.classList.add("completed");

      const info = document.createElement("div");
      info.className = "task-info";
      info.innerHTML = `<strong>${task.text}</strong>
        <div class="task-meta">
          Due: ${task.date || "No date"} | Priority: ${task.priority}
        </div>`;
      info.addEventListener("click", () => {
        tasks[index].completed = !tasks[index].completed;
        updateTasks();
      });

      const actions = document.createElement("div");
      actions.className = "actions";

      const editBtn = document.createElement("button");
      editBtn.className = "edit-btn";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => editTask(index));

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => {
        tasks.splice(index, 1);
        updateTasks();
      });

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
      li.appendChild(info);
      li.appendChild(actions);
      taskList.appendChild(li);
    });
  }

  function editTask(index) {
    const task = tasks[index];
    const li = taskList.children[index];
    const info = li.querySelector(".task-info");
    info.innerHTML = `
      <input type="text" value="${task.text}" id="editText${index}" />
      <input type="date" value="${task.date}" id="editDate${index}" />
      <select id="editPriority${index}">
        <option value="Low" ${task.priority === "Low" ? "selected" : ""}>Low</option>
        <option value="Medium" ${task.priority === "Medium" ? "selected" : ""}>Medium</option>
        <option value="High" ${task.priority === "High" ? "selected" : ""}>High</option>
      </select>
    `;

    const actions = li.querySelector(".actions");
    actions.innerHTML = "";

    const saveBtn = document.createElement("button");
    saveBtn.className = "save-btn";
    saveBtn.textContent = "Save";
    saveBtn.addEventListener("click", () => {
      const newText = document.getElementById(`editText${index}`).value.trim();
      const newDate = document.getElementById(`editDate${index}`).value;
      const newPriority = document.getElementById(`editPriority${index}`).value;

      if (newText !== "") {
        tasks[index] = {
          ...tasks[index],
          text: newText,
          date: newDate,
          priority: newPriority,
        };
        updateTasks();
      }
    });

    actions.appendChild(saveBtn);
  }

  function updateTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
});
