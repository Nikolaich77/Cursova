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
                <button class="edit-button">Edit</button>
                <button class="remove-button">Remove</button>
            `;
            todoList.appendChild(li);
            taskInput.value = "";
            addRemoveListener(li);
            addEditListener(li);
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

    function addEditListener(li) {
        const editButton = li.querySelector(".edit-button");
        editButton.addEventListener("click", function () {
            const taskText = li.querySelector("span").textContent;
            const textColor = getComputedStyle(li.querySelector("span")).color; // Отримати поточний колір тексту
            createEditForm(taskText, textColor, li);
        });
    }

    function createEditForm(initialText, textColor, taskElement) {
        const editForm = document.createElement("div");
        editForm.innerHTML = `
            <input type="text" id="editTaskInput" value="${initialText}">
            <input type="color" id="taskColor" value="${textColor}" list="colorOptions">
            <datalist id="colorOptions">
                <option>#ff0000</option> <!-- Червоний -->
                <option>#ffff00</option> <!-- Жовтий -->
                <option>#00ff00</option> <!-- Зелений -->
            </datalist>
            <button id="saveButton">Save</button>
        `;

        const saveButton = editForm.querySelector("#saveButton");
        saveButton.addEventListener("click", function () {
            const editedText = editForm.querySelector("#editTaskInput").value;
            const editedTextColor = editForm.querySelector("#taskColor").value;

            if (editedText.trim() !== "") {
                taskElement.querySelector("span").textContent = editedText;
                taskElement.querySelector("span").style.color = editedTextColor; // Змінити колір тексту
                editForm.style.display = "none";
            }
        });

        document.querySelector(".container").insertBefore(editForm, document.querySelector(".columns"));
    }

    // ... інші функції та обробники

    function drag(event) {
        event.dataTransfer.setData("text", event.target.id);
    }
});

// Дозволити функціональність
function allowDrop(event) {
    event.preventDefault();
}

// Перетягування функціональності
function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const targetList = event.target.querySelector(".task-list");

    if (targetList && targetList === event.target) {
        const li = document.getElementById(data);
        event.target.appendChild(li);
    } else {
        // Обробка переміщення завдань між стовпцями
        const sourceList = document.getElementById(data);
        if (sourceList) {
            targetList.appendChild(sourceList);
        }
    }
}
