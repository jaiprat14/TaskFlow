const TaskForm = document.getElementById("task-form");
const TaskInput = document.getElementById("task-input");
const TaskList = document.getElementById('task-list');
const TaskCount = document.getElementById("task-count");
const searchInput = document.getElementById("search-input");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = localStorage.getItem("currentFilter") || "all";
let searchQuery = "";

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

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    const taskText = document.createElement("span");
    taskText.textContent = task.name;
    taskText.classList.add("task-text");

    if (task.completed) {
        taskText.classList.add("completed");
    }

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");

    const prioritySelect = document.createElement("select");
    prioritySelect.classList.add("priority-select");

    const priorityBadge = document.createElement("span");
    priorityBadge.classList.add("priority-badge");

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
        taskItem.remove();

        tasks = tasks.filter(function (item) {
            return item !== task;
        });

        saveTasks();
        updateTaskCount();
    });

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(prioritySelect);
    taskItem.appendChild(editButton);
    taskItem.appendChild(deleteButton);
    

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
    priority: "medium"
};

    tasks.push(task);

    saveTasks();

    renderTasks(task);

    TaskInput.value = "";

    updateTaskCount();

});



function renderTasks() {
    TaskList.innerHTML = "";

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

    filteredTasks.forEach(function (task) {
        renderTask(task);
    });

}

const taskFilter = document.getElementById("task-filter");
taskFilter.value = currentFilter;

taskFilter.addEventListener("change", function () {
    currentFilter = taskFilter.value;
    localStorage.setItem("currentFilter", currentFilter);
    renderTasks();
});

searchInput.addEventListener("input", function(){
    searchQuery = searchInput.value;
    renderTasks();
});


renderTasks();
updateTaskCount();