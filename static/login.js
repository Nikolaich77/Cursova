const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const signInForm = document.getElementById("signInForm");
const signUpForm = document.getElementById("signUpForm");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

// const signInForm = document.signInFrom;

signInForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("signInEmail").value;
  const password = document.getElementById("signInPassword").value;
  const data = { email : email, password : password };
  fetch("http://localhost:8000/login/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.status === 200) {
      response.text().then((result) => {
        localStorage.setItem("userID", result);
        window.location.href = "http://localhost:8000/kanban";
      });
    } else {
      console.log("Error" + response.status);
    }
  });
});

signUpForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("signUpName").value;
  const email = document.getElementById("signUpEmail").value;
  const password = document.getElementById("signUpPassword").value;
  const data = { name : name, email : email, password : password };
  fetch("http://localhost:8000/login/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.status === 200) {
      response.text().then((result) => {
        localStorage.setItem("userID", result);
        window.location.href = "http://localhost:8000/kanban";
      });
    } else {
      console.log("Error" + response.status);
    }
  });
});