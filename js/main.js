function addProduct() {
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const type = document.getElementById("type").value;
  const description = document.getElementById("description").value;
  const imageInput = document.getElementById("image");
  const phone = document.getElementById("phone").value;

  const sellerEmail = localStorage.getItem("collexUser");

  if (!title || !price || imageInput.files.length === 0) {
    alert("Fill all fields");
    return;
  }

  if (!phone || phone.length < 10) {
    alert("Enter valid WhatsApp number");
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(imageInput.files[0]);

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
        window.location.href = "products.html";
      });
  };
}
