document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const addButton = document.getElementById("addButton");
    const todoList = document.getElementById("todoList");
    const doingList = document.getElementById("doingList");
    const doneList = document.getElementById("doneList");
    const closeSidebarButton = document.querySelector(".close-button");

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

    function createEditForm(initialText, initialImportance, taskElement) {
        const editForm = document.createElement("div");
        editForm.innerHTML = `
            <input type="text" id="editTaskInput" value="${initialText}">
            <label for="importance">Важливість:</label>
            <select id="importance" name="importance">
                <option value="low">Низька</option>
                <option value="medium">Середня</option>
                <option value="high">Висока</option>
            </select>
            <button id="saveButton">Зберегти</button>
        `;
        const importanceSelect = editForm.querySelector("#importance");
        importanceSelect.value = initialImportance;

        const saveButton = editForm.querySelector("#saveButton");
        saveButton.addEventListener("click", function () {
            const editedText = editForm.querySelector("#editTaskInput").value;
            const editedImportance = editForm.querySelector("#importance").value;

            if (editedText.trim() !== "") {
                const updatedTask = document.createElement("li");
                updatedTask.innerHTML = `
                    <span class="task-text">${editedText}</span>
                    <button class="edit-button">Edit</button>
                    <button class="remove-button">Remove</button>
                `;
                updatedTask.setAttribute("data-importance", editedImportance);
                todoList.replaceChild(updatedTask, taskElement);
                addRemoveListener(updatedTask);
                addEditListener(updatedTask);
                updatedTask.setAttribute("draggable", true);
                updatedTask.setAttribute("id", taskElement.getAttribute("id"));
                editForm.remove();
            }
        });

        document.querySelector(".container").insertBefore(editForm, document.querySelector(".columns"));
    }

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

// Функція для відкриття бічної панелі
function openSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.display = "block";
}

closeSidebarButton.addEventListener("click", closeSidebar);
