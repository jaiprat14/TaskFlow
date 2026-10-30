const TaskForm = document.getElementById("task-form");
const TaskInput = document.getElementById("task-input");
const TaskList = document.getElementById('task-list');
const TaskCount = document.getElementById("task-count");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = localStorage.getItem("currentFilter") || "all";

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

    if (task.completed) {
        taskText.classList.add("completed");
    }

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

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
    completed: false
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
        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
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


renderTasks();
updateTaskCount();