

document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const storedUser = JSON.parse(localStorage.getItem("userData"));

  if (!storedUser) {
    alert("You must register first ❌");
    window.location.href = "register.html";
    return;
  }

  if (email === storedUser.email && password === storedUser.password) {
    alert("Login successful ✅");


    localStorage.setItem("isLoggedIn", "true");

    window.location.href = "index.html";
  } else {
    alert("Invalid email or password ❌");
  }
});
