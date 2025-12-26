console.log("main.js loaded ✅");

// =========================
// BACKEND API BASE URL
// =========================
const API = "https://collex-backend.onrender.com";

// =========================
// LOGIN
// =========================
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

// =========================
// REGISTER
// =========================
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

// =========================
// LOGOUT
// =========================
function logout() {
  localStorage.removeItem("collexUser");
  window.location.href = "login.html";
}

// =========================
// ADD PRODUCT (SELL / RENT)
// =========================
function addProduct() {
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const type = document.getElementById("type").value;
  const description = document.getElementById("description").value;
  const imageInput = document.getElementById("image");
  const phone = document.getElementById("phone").value;

  const sellerEmail = localStorage.getItem("collexUser");

  if (!sellerEmail) {
    alert("Please login again");
    window.location.href = "login.html";
    return;
  }

  if (!title || !price || imageInput.files.length === 0) {
    alert("Fill all fields");
    return;
  }

  if (!phone || phone.length < 10) {
    alert("Enter valid WhatsApp number (91xxxxxxxxxx)");
    return;
  }

  const file = imageInput.files[0];

  // Mobile safety (image size)
  if (file.size > 2 * 1024 * 1024) {
    alert("Image must be below 2MB");
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
        phone,
        image: reader.result
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        if (data.message.includes("success")) {
          window.location.href = "products.html";
        }
      })
      .catch(() => alert("Add product failed"));
  };
}

// =========================
// LOAD PRODUCTS (PRODUCTS PAGE)
// =========================
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
          </button>
        `;
      }

      list.innerHTML += `
        <div class="col-md-4 mb-4">
          <div class="card shadow-sm h-100">
            <img src="${p.image}"
                 class="card-img-top"
                 style="height:200px;object-fit:cover">

            <div class="card-body">
              <h5 class="fw-bold">${p.title}</h5>
              <p class="mb-1">₹${p.price} • ${p.type}</p>
              <small class="text-muted">${p.sellerEmail}</small>
            </div>

            <div class="card-footer bg-white">
              <a class="btn btn-success btn-sm w-100"
                 target="_blank"
                 href="https://wa.me/${p.phone}?text=Hi! I am interested in your product: ${p.title}">
                WhatsApp Seller
              </a>
              ${deleteBtn}
            </div>
          </div>
        </div>
      `;
    });
  })
  .catch(() => console.log("Products load failed"));

// =========================
// DELETE PRODUCT (OWNER ONLY)
// =========================
function deleteProduct(id) {
  const email = localStorage.getItem("collexUser");

  if (!email) {
    alert("Login again");
    return;
  }

  if (!confirm("Are you sure you want to delete this product?")) return;

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
