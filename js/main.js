console.log("main.js loaded ✅");

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

  fetch("https://collex-backend.onrender.com/login", {
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

  if (!email.endsWith("@karpagamtech.ac.in")) {
    alert("Only college email allowed");
    return;
  }

  fetch("https://collex-backend.onrender.com/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      if (data.message === "Registered successfully") {
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

/* =========================
   ADD PRODUCT (WITH IMAGE)
========================= */
function addProduct() {
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const type = document.getElementById("type").value;
  const description = document.getElementById("description").value;
  const imageInput = document.getElementById("image");

  const sellerEmail = localStorage.getItem("collexUser");

  if (!title || !price || imageInput.files.length === 0) {
    alert("Fill all fields & select image");
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(imageInput.files[0]);

  reader.onload = function () {
    fetch("https://collex-backend.onrender.com/add-product", {
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
   LOAD PRODUCTS + DELETE (OWNER ONLY)
========================= */
fetch("https://collex-backend.onrender.com/products")
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
          <div class="card shadow-sm h-100 position-relative">
            <span class="price-badge">₹${p.price}</span>

            <img src="${p.image}" class="card-img-top">

            <div class="card-body">
              <h5 class="card-title">${p.title}</h5>
              <p class="text-muted small mb-1">${p.type.toUpperCase()}</p>
              <p class="card-text">${p.description || ""}</p>
            </div>

            <div class="card-footer bg-white">
              <small class="text-muted d-block mb-2">
                ${p.sellerEmail}
              </small>

              <a class="btn btn-success btn-sm w-100"
                 href="https://wa.me/?text=Hi! I'm interested in your product: ${p.title}"
                 target="_blank">
                WhatsApp
              </a>

              ${deleteBtn}
            </div>
          </div>
        </div>
      `;
    });
  })
  .catch(err => console.error(err));


/* =========================
   DELETE PRODUCT (OWNER ONLY)
========================= */
function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  const email = localStorage.getItem("collexUser");

  fetch(`https://collex-backend.onrender.com/delete-product/${id}?email=${email}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      location.reload();
    })
    .catch(() => alert("Delete failed"));
}

