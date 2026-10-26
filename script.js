const TaskForm = document.getElementById("task-form");
const TaskInput = document.getElementById("task-input");
const TaskList = document.getElementById('task-list');
const TaskCount = document.getElementById("task-count");

let tasks = [];


function updateTaskCount() {
    const remainingTasks = tasks.filter(function (task) {
        return !task.completed;
    }).length;

    TaskCount.textContent =
        remainingTasks +
        (remainingTasks === 1 ? " task remaining" : " tasks remaining");
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

    const taskItem = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";


    const taskText = document.createElement("span");
    taskText.textContent = TaskName;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
    taskItem.remove();

    tasks = tasks.filter(function (item) {
        return item !== task;
    });

    updateTaskCount();
});


    checkbox.addEventListener("change", function () {
    task.completed = checkbox.checked;

    if (task.completed) {
        taskText.classList.add("completed");
    } else {
        taskText.classList.remove("completed");
    }

    updateTaskCount();
});

taskItem.appendChild(checkbox);
taskItem.appendChild(taskText);
taskItem.appendChild(deleteButton);

TaskList.appendChild(taskItem);

TaskInput.value = "";
updateTaskCount();
});
