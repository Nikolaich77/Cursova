import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import {  doc, deleteDoc, collection, addDoc, getFirestore, getDocs, setDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBP_d27uap1flFd-7ZvYSfIaRGZr542Tp0",
    authDomain: "kursach-42c5f.firebaseapp.com",
    projectId: "kursach-42c5f",
    storageBucket: "kursach-42c5f.appspot.com",
    messagingSenderId: "62833531875",
    appId: "1:62833531875:web:3dbfa653f46241e681ded6"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const userName = "user1";

document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const addButton = document.getElementById("addButton");
    const todoList = document.getElementById("todoList");
    const doingList = document.getElementById("doingList");
    const doneList = document.getElementById("doneList");


    getDocs(collection(db, userName)).then((result) => {
        result.forEach((record) => {
            // console.log(record.id)
            addTask(record.data().text, record.id)
        })
    })

    function createTask(){
        const taskText = taskInput.value.trim();
        addDoc(collection(db, userName), {text : taskText}).then((doc_ref) => {
            addTask(taskText, doc_ref.id);
        });
    }

    addButton.addEventListener("click", createTask);
    taskInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            createTask();
        }
    });

    function addTask(taskText, doc_id) {

        if (taskText !== "") {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${taskText}</span>
                <button class="edit-button">Edit</button>
                <button class="remove-button">Remove</button>
            `;
            todoList.appendChild(li);
            taskInput.value = "";

            
            addRemoveListener(li, doc_id);
            addEditListener(li, doc_id);
            
            li.setAttribute("draggable", true);
            li.setAttribute("id", "task-" + new Date().getTime());
            li.addEventListener("dragstart", drag);
        }
    }

    function addRemoveListener(li, doc_id) {
        const removeButton = li.querySelector(".remove-button");
        removeButton.addEventListener("click", function () {
            deleteDoc(doc(db, userName, doc_id))
            li.remove();
        });
    }

    function addEditListener(li, doc_id) {
        const editButton = li.querySelector(".edit-button");
        editButton.addEventListener("click", function () {
            const taskText = li.querySelector("span").textContent;
            const textColor = getComputedStyle(li.querySelector("span")).color; // Отримати поточний колір тексту
            createEditForm(taskText, textColor, li, doc_id);
        });
    }

    function createEditForm(initialText, textColor, taskElement, doc_id) {
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

            setDoc(doc(db, userName, doc_id), {text : editedText})

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
