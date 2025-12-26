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
   ADD PRODUCT (MOBILE SAFE)
========================= */
function addProduct() {
  alert("Add Product clicked"); // debug (remove later)

  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const type = document.getElementById("type").value;
  const description = document.getElementById("description").value;
  const imageInput = document.getElementById("image");

  const sellerEmail = localStorage.getItem("collexUser");

  if (!title || !price || imageInput.files.length === 0) {
    alert("Fill all fields");
    return;
  }

  const file = imageInput.files[0];

  // 🔴 MOBILE FIX – image size limit
  if (file.size > 2 * 1024 * 1024) {
    alert("Image too large. Please upload below 2MB");
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = function () {
    fetch(`${API}/add-product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        price,
        type,
        description,
        sellerEmail,
        image: reader.result
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        window.location.href = "products.html";
      })
      .catch(() => alert("Add product failed"));
  };
}

/* =========================
   LOAD PRODUCTS
========================= */
fetch(`${API}/products`)
  .then(res => res.json())
  .then(products => {
    const list = document.getElementById("productList");
    if (!list) return;

    const loggedUser = localStorage.getItem("collexUser");
    list.innerHTML = "";

    products.forEach(p => {
      let deleteBtn = "";
      if (p.sellerEmail === loggedUser) {
        deleteBtn = `
          <button class="btn btn-danger btn-sm w-100 mt-2"
                  onclick="deleteProduct('${p._id}')">
            Delete
          </button>`;
      }

      list.innerHTML += `
        <div class="col-md-4 mb-4">
          <div class="card shadow-sm h-100">
            <img src="${p.image}" class="card-img-top"
                 style="height:200px;object-fit:cover">
            <div class="card-body">
              <h5>${p.title}</h5>
              <p>₹${p.price} • ${p.type}</p>
              <small>${p.sellerEmail}</small>
            </div>
            <div class="card-footer">
              <a class="btn btn-success btn-sm w-100"
                 target="_blank"
                 href="https://wa.me/?text=Interested in ${p.title}">
                WhatsApp
              </a>
              ${deleteBtn}
            </div>
          </div>
        </div>`;
    });
  });

/* =========================
   DELETE PRODUCT
========================= */
function deleteProduct(id) {
  const email = localStorage.getItem("collexUser");

  fetch(`${API}/delete-product/${id}?email=${email}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      location.reload();
    })
    .catch(() => alert("Delete failed"));
}
