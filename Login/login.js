function login() {
    let username = document.getElementById("loginUsername").value;
    let password = document.getElementById("loginPassword").value;

    // You can add your authentication logic here
    if (username === "yourusername" && password === "yourpassword") {
      alert("Login successful!");
    } else {
      alert("Login failed. Please check your username and password.");
    }
  }

  function register() {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let phoneNumber = document.getElementById("phoneNumber").value;
    let age = document.getElementById("age").value;
    let username = document.getElementById("registerUsername").value;
    let password = document.getElementById("registerPassword").value;

    // You can add your registration logic here
    alert("Registration successful!");
  }

  document.getElementById("loginBtn").addEventListener("click", function() {
    document.getElementById("formTitle").innerText = "Login";
    document.getElementById("loginForm").classList.add("active");
    document.getElementById("registerForm").classList.remove("active");
  });

  document.getElementById("registerBtn").addEventListener("click", function() {
    document.getElementById("formTitle").innerText = "Register";
    document.getElementById("loginForm").classList.remove("active");
    document.getElementById("registerForm").classList.add("active");
  });