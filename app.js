document.addEventListener('DOMContentLoaded', function () {
    // Load tasks from local storage
    loadTasks();
});

function addTask() {
    var taskInput = document.getElementById('taskInput');
    var taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    // Create a task object
    var task = {
        id: new Date().getTime(),
        text: taskText,
        completed: false,
    };

    // Add the task to the UI based on completion status
    addTaskToUI(task);

    // Clear the input field
    taskInput.value = '';

    // Save tasks to local storage
    saveTasks();
}

function addTaskToUI(task) {
    var taskContainerId = task.completed ? 'completed-tasks' : 'uncompleted-tasks';
    var taskContainer = document.getElementById(taskContainerId);

    // Create task element
    var taskElement = document.createElement('div');
    taskElement.className = 'task';
    taskElement.setAttribute('data-task-id', task.id);

    // Include the checkbox only for uncompleted tasks
    if (!task.completed) {
        taskElement.innerHTML = `
            <input type="checkbox" onchange="toggleTaskCompletion(${task.id})" ${task.completed ? 'checked' : ''}>
        `;
    }

    taskElement.innerHTML += `
        <span>${task.text}</span>
        <button class="edit" onclick="editTask(${task.id})">Edit</button>
        <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
    `;

    // Append task to the container
    taskContainer.appendChild(taskElement);
}



function toggleTaskCompletion(taskId) {
    var taskElement = document.querySelector(`.task[data-task-id="${taskId}"]`);

    if (taskElement) {
        var checkbox = taskElement.querySelector('input[type="checkbox"]');
        var completed = checkbox.checked;

        moveTask(taskId, completed);
        saveTasks();
    }
}

function moveTask(taskId, completed) {
    var taskElement = document.querySelector(`.task[data-task-id="${taskId}"]`);

    if (taskElement) {
        var targetContainerId = completed ? 'completed-tasks' : 'uncompleted-tasks';
        var targetContainer = document.getElementById(targetContainerId);

        taskElement.querySelector('input[type="checkbox"]').onchange = null;
        targetContainer.appendChild(taskElement);
    }
}

function editTask(taskId) {
    var taskElement = document.querySelector(`.task[data-task-id="${taskId}"]`);

    if (taskElement) {
        var taskTextElement = taskElement.querySelector('span');
        var taskText = taskTextElement.innerText;

        var updatedTaskText = prompt('Edit task:', taskText);

        if (updatedTaskText !== null && updatedTaskText.trim() !== '') {
            taskTextElement.innerText = updatedTaskText;
            saveTasks();
        }
    }
}

function deleteTask(taskId) {
    var taskElement = document.querySelector(`.task[data-task-id="${taskId}"]`);

    if (taskElement) {
        taskElement.remove();
        saveTasks();
    }
}

function clearTasks() {
    clearContainer('uncompleted-tasks');
    clearContainer('completed-tasks');
    saveTasks();
}

function clearContainer(containerId) {
    var taskContainer = document.getElementById(containerId);
    taskContainer.innerHTML = '';
}

function saveTasks() {
    var tasks = [];
    var taskElementsUncompleted = document.querySelectorAll('#uncompleted-tasks .task');
    var taskElementsCompleted = document.querySelectorAll('#completed-tasks .task');

    taskElementsUncompleted.forEach(function (taskElement) {
        tasks.push({
            id: parseInt(taskElement.getAttribute('data-task-id')),
            text: taskElement.querySelector('span').innerText,
            completed: false,
        });
    });

    taskElementsCompleted.forEach(function (taskElement) {
        tasks.push({
            id: parseInt(taskElement.getAttribute('data-task-id')),
            text: taskElement.querySelector('span').innerText,
            completed: true,
        });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(function (task) {
        addTaskToUI(task);
    });
}
