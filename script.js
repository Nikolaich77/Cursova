document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const addButton = document.getElementById("addButton");
    const todoList = document.getElementById("todoList");
    const doingList = document.getElementById("doingList");
    const doneList = document.getElementById("doneList");

    addButton.addEventListener("click", addTask);
    taskInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${taskText}</span>
                <button class="remove-button">Remove</button>
            `;
            todoList.appendChild(li);
            taskInput.value = "";
            addRemoveListener(li);
            li.setAttribute("draggable", true);
            li.setAttribute("id", "task-" + new Date().getTime());
            li.addEventListener("dragstart", drag);
        }
    }

    function addRemoveListener(li) {
        const removeButton = li.querySelector(".remove-button");
        removeButton.addEventListener("click", function () {
            li.remove();
        });
    }

    function drag(event) {
        event.dataTransfer.setData("text", event.target.id);
    }
});

// Allow drop functionality
function allowDrop(event) {
    event.preventDefault();
}

// Drop functionality
function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const targetList = event.target.querySelector(".task-list");

    if (targetList && targetList === event.target) {
        const li = document.getElementById(data);
        event.target.appendChild(li);
    } else {
        // Handle moving tasks between columns
        const sourceList = document.getElementById(data);
        if (sourceList) {
            targetList.appendChild(sourceList);
        }
    }
}

// Function to open the sidebar
function openSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.display = "block";
}

// Function to close the sidebar
function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.remove("sidebar-opened");
}

