const userName = "user1";

document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const addButton = document.getElementById("addButton");
    const todoList = document.getElementById("todoList");
    const doingList = document.getElementById("doingList");
    const doneList = document.getElementById("doneList");


    fetch(`http://localhost:8000/${userName}/notes`).then((response) => {
        return response.json();
    }).then((result) => {
        result.forEach((record, id) => {
            addTask(record.text, id, record.color, record.position);
        })
    })

    // getDocs(collection(db, userName)).then((result) => {
    //     result.forEach((record) => {
    //         // console.log(record.id)
    //         addTask(record.data().text, record.id)
    //     })
    // })

    function createTask(){
        const taskText = taskInput.value.trim();

        fetch(`http://localhost:8000/${userName}/notes`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({text : taskText, color : "black", position : 0})
        }).then((response) => {
            if (response.status === 200) {
                response.json().then((result) => {
                addTask(taskText, result, "black");
                });
            }
            else {
                console.log("Error" + response.status);
            }
        });
        // addDoc(collection(db, userName), {text : taskText}).then((doc_ref) => {
        //     addTask(taskText, doc_ref.id);
        // });
    }

    addButton.addEventListener("click", createTask);
    taskInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            createTask();
        }
    });

    function addTask(taskText, id, color, position = 0) {

        if (taskText !== "") {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${taskText}</span>
                <button class="edit-button">Edit</button>
                <button class="remove-button">Remove</button>
            `;

            if (position == 0) todoList.appendChild(li);
            else if (position == 1) doingList.appendChild(li);
            else if (position == 2) doneList.appendChild(li);

            
            
            taskInput.value = "";

            
            addRemoveListener(li, id);
            addEditListener(li, id);

            
            li.setAttribute("draggable", true);
            li.setAttribute("id", "task-" + id);
            li.addEventListener("dragstart", drag);
            li.style.color = color;
        }
    }

    function addRemoveListener(li, id) {
        const removeButton = li.querySelector(".remove-button");
        removeButton.addEventListener("click", function () {
            fetch(`http://localhost:8000/${userName}/notes/${id}`, {method : "DELETE"}).then((response) => {
                if (response.status === 200) {
                    li.remove();
                }
            })
        });
    }

    function addEditListener(li, id) {
        const editButton = li.querySelector(".edit-button");
        editButton.addEventListener("click", function () {
            const taskText = li.querySelector("span").textContent;
            const textColor = getComputedStyle(li.querySelector("span")).color; // Отримати поточний колір тексту
            createEditForm(taskText, textColor, li, id);
        });
    }

    function createEditForm(initialText, textColor, taskElement, id) {
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

            fetch(`http://localhost:8000/${userName}/notes/${id}/update`, {
                method : "PUT",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({text : editedText, color : editedTextColor})
            }).then((response) => {
                if (response.status === 200) {
                        taskElement.querySelector("span").textContent = editedText;
                        taskElement.querySelector("span").style.color = editedTextColor; // Змінити колір тексту
                        editForm.style.display = "none";
                }
                else {
                    console.log(response);
                }
            });


        });

        document.querySelector(".container").insertBefore(editForm, document.querySelector(".columns"));
    }

    // ... інші функції та обробники
});

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

// Дозволити функціональність
function allowDrop(event) {
    event.preventDefault();
}

// Перетягування функціональності
function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const targetList = event.target.querySelector(".task-list");
    var position = 0;
    if (targetList.id == 'doingList') position = 1;
    else if (targetList.id == 'doneList') position = 2;

    fetch(`http://localhost:8000/${userName}/notes/${data.replace('task-', '')}/change_status`, {
        method : "PUT",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({position : position})
    })

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
