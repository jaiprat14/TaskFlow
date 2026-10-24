const TaskForm = document.getElementById("task-form");
const TaskInput = document.getElementById("task-input");
const TaskList = document.getElementById('task-list');
const TaskCount = document.getElementById("task-count");

let tasks = [];

TaskForm.addEventListener("submit", function(e){
    e.preventDefault();

    const TaskName = TaskInput.value.trim();
    if(TaskName === ""){
        return;
    }
    
    tasks.push(TaskName);

    const TaskItem = document.createElement("li");
    TaskItem.textContent = TaskName;

    TaskList.appendChild(TaskItem);

    TaskInput.value = "";

    TaskCount.textContent = tasks.length + 
    (tasks.length === 1 ? "Task Added" : "Tasks Added");
});