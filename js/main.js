console.log("main.js loaded ✅");

const API = "https://collex-backend.onrender.com";

/* =========================
   LOGIN
========================= */
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Email and password required");
    return;
  }

  fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      if (data.message === "Login successful") {
        localStorage.setItem("collexUser", email);
        window.location.href = "dashboard.html";
      }
    })
    .catch(() => alert("Login failed"));
}

/* =========================
   REGISTER
========================= */
function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    alert("All fields required");
    return;
  }

  fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      if (data.message.includes("success")) {
        window.location.href = "login.html";
      }
    })
    .catch(() => alert("Registration failed"));
}

/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.removeItem("collexUser");
  window.location.href = "login.html";
}
