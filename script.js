const TaskForm = document.getElementById("task-form");
const TaskInput = document.getElementById("task-input");
const TaskList = document.getElementById('task-list');
const TaskCount = document.getElementById("task-count");
const searchInput = document.getElementById("search-input");
const dueDateInput = document.getElementById("due-date");
const dateDisplay = document.getElementById("date-display");
const taskFilter = document.getElementById("task-filter");
const emptyMessage =document.getElementById("empty-message");

const sortTasks = document.getElementById("sort-tasks");

dueDateInput.addEventListener("change", function () {
    if (!dueDateInput.value) {
        dateDisplay.textContent = "Select due date";
        return;
    }

    const selectedDate = new Date(dueDateInput.value + "T00:00:00");

    dateDisplay.textContent = selectedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
});

dueDateInput.addEventListener("click", function () {

    if (dueDateInput.showPicker) {
        dueDateInput.showPicker();
    }
});

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = localStorage.getItem("currentFilter") || "all";
let searchQuery = "";
let currentSort = localStorage.getItem("currentSort") || "default";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskCount() {
    const remainingTasks = tasks.filter(function (task) {
        return !task.completed;
    }).length;

    TaskCount.textContent =
        remainingTasks +
        (remainingTasks === 1 ? " task remaining" : " tasks remaining");
}

function renderTask(task) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");

    const checkbox = document.createElement("input");
    checkbox.classList.add("task-checkbox");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    const taskText = document.createElement("span");
    taskText.textContent = task.name;
    taskText.classList.add("task-text");

    const dueDateText = document.createElement("span");
    dueDateText.classList.add("due-date");


    if (task.dueDate) {
    const dueDate = new Date(task.dueDate + "T00:00:00");

    const formattedDate = dueDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    dueDateText.textContent = "Due: " + formattedDate;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDate < today && !task.completed) {
        dueDateText.classList.add("overdue");
        dueDateText.textContent = "Overdue: " + formattedDate;
    } 
    }else {
        dueDateText.textContent = "no due date";
    }

    if (task.completed) {
        taskText.classList.add("completed");
    }

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");

    const prioritySelect = document.createElement("select");
    prioritySelect.classList.add("priority-select");

    const priorities = ["Low", "Medium", "High"];

    priorities.forEach(function (priority) {
        const option = document.createElement("option");

        option.value = priority.toLowerCase()
        option.textContent = priority

        prioritySelect.appendChild(option);
    });

    prioritySelect.value = task.priority || "medium";

    prioritySelect.addEventListener("change", function(){
        task.priority = prioritySelect.value;
        
        saveTasks();
        renderTasks();
    });

    const editButton = document.createElement("button");
    editButton.textContent = "edit";
    editButton.classList.add("edit-btn");

    const taskActions = document.createElement("div");
    taskActions.classList.add("task-actions");

    taskActions.appendChild(prioritySelect);
    taskActions.appendChild(editButton);
    taskActions.appendChild(deleteButton);

    editButton.addEventListener("click", function () {
    const newTaskName = prompt("Edit your task:", task.name);

    if (newTaskName === null) {
        return;
    }

    const updatedName = newTaskName.trim();

    if (updatedName === "") {
        alert("Task name cannot be empty!");
        return;
    }

    task.name = updatedName;

    saveTasks();
    renderTasks();
});

    checkbox.addEventListener("change", function () {
        task.completed = checkbox.checked;

        saveTasks();

        if (task.completed) {
            taskText.classList.add("completed");
        } else {
            taskText.classList.remove("completed");
        }

        renderTasks();
        updateTaskCount();
    });

    deleteButton.addEventListener("click", function () {

        tasks = tasks.filter(function (item) {
            return item !== task;
        });

        saveTasks();
        renderTasks();
        updateTaskCount();
    });

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(dueDateText);
    taskItem.appendChild(taskActions);
    

    TaskList.appendChild(taskItem);
}

TaskForm.addEventListener("submit", function(e){
    e.preventDefault();

    const TaskName = TaskInput.value.trim();
    if(TaskName === ""){
        return;
    }
    
    const task = {
    name: TaskName,
    completed: false,
    priority: "medium",
    dueDate: dueDateInput.value
};

    tasks.push(task);

    saveTasks();

    renderTasks();

    TaskInput.value = "";

    dueDateInput.value = "";
    dateDisplay.textContent = "Select due date";

    updateTaskCount();

});



function renderTasks() {
    TaskList.innerHTML = "";
    emptyMessage.style.display = "none";

    let filteredTasks = tasks.filter(function (task) {
      const matchesFilter =
        currentFilter === "all" ||
        (currentFilter === "active" && !task.completed) ||
        (currentFilter === "completed" && task.completed) || 
        (task.priority || "medium") === currentFilter;

      const matchesSearch =
        task.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });

    if (currentSort === "earliest") {
        filteredTasks.sort(function (a, b) {
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;

          return a.dueDate.localeCompare(b.dueDate);
        });
    }
    else if (currentSort === "latest") {
        filteredTasks.sort(function (a, b) {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;

          return b.dueDate.localeCompare(a.dueDate);
        });
    }

    if(filteredTasks.length === 0){
        emptyMessage.textContent = tasks.length === 0 
        ? "You're all caught up! Add a task to get started."
        : "No tasks found. Try changing your search or filter.";
        
        emptyMessage.style.display = "block";
    }

    filteredTasks.forEach(function (task) {
        renderTask(task);
    });

}

taskFilter.addEventListener("change", function () {
    currentFilter = taskFilter.value;
    localStorage.setItem("currentFilter", currentFilter);
    renderTasks();
});

searchInput.addEventListener("input", function(){
    searchQuery = searchInput.value;
    renderTasks();
});

sortTasks.addEventListener("change", function () {
    currentSort = sortTasks.value;
    localStorage.setItem("currentSort", currentSort);
    renderTasks();
});

taskFilter.value = currentFilter;
sortTasks.value = currentSort;

renderTasks();
updateTaskCount();