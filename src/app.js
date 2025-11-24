// Sistema CRUD de Productos
// Funcionalidad:
// - Crear productos
// - Listar productos
// - Editar productos (con indicador visual)
// - Eliminar productos (con confirmación, animación y mensaje)
// - Mensaje cuando no hay productos

document.addEventListener("DOMContentLoaded", () => {
  let products = [];
  let editingId = null;

  const form = document.getElementById("product-form");
  const nameInput = document.getElementById("product-name");
  const priceInput = document.getElementById("product-price");
  const descriptionInput = document.getElementById("product-description");
  const resetBtn = document.getElementById("reset-btn");
  const tableBody = document.querySelector("#products-table tbody");

  if (!form || !nameInput || !priceInput || !descriptionInput || !resetBtn || !tableBody) {
    console.error("Error: No se encontraron elementos del DOM.");
    return;
  }

  const submitBtn = form.querySelector("button[type='submit']");

  submitBtn.textContent = "Guardar";
  submitBtn.style.background = "#3a87ff";
  submitBtn.style.color = "#fff";
  submitBtn.style.border = "none";

  const emptyMessage = document.createElement("p");
  emptyMessage.textContent = "No hay productos registrados.";
  emptyMessage.style.color = "#666";
  emptyMessage.style.marginTop = "10px";
  emptyMessage.id = "empty-msg";

  // Manejar submit del formulario
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const description = descriptionInput.value.trim();

if (!name) {
  alert("El nombre del producto es obligatorio.");
  return;
}

if (isNaN(price) || price <= 0) {
  alert("El precio debe ser un número válido y mayor que 0.");
  return;
}

    const newProduct = {
      id: editingId ?? Date.now(),
      name,
      price,
      description,
    };

    if (editingId) {
      const index = products.findIndex((p) => p.id === editingId);
      if (index !== -1) products[index] = newProduct;
      editingId = null;
    } else {
      products.push(newProduct);
    }

    // Modo guardar
    resetEditMode();
    renderProducts();
    form.reset();
  });

  function renderProducts() {
    tableBody.innerHTML = "";

    if (products.length === 0) {
      if (!document.getElementById("empty-msg")) {
        tableBody.parentElement.appendChild(emptyMessage);
      }
      return;
    }

    const existingMsg = document.getElementById("empty-msg");
    if (existingMsg) existingMsg.remove();

    products.forEach((product) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td>${product.description}</td>
        <td>
          <button onclick="editProduct(${product.id})">Editar</button>
          <button class="delete-btn" onclick="deleteProduct(${product.id})">Eliminar</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

    // Estilizar botón eliminar
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.style.background = "#ff4444";
      btn.style.color = "#fff";
      btn.style.border = "none";
      btn.style.padding = "5px 10px";
      btn.style.cursor = "pointer";
    });
  }

  // Modo edición
  window.editProduct = (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    editingId = id;

    nameInput.value = product.name;
    priceInput.value = product.price;
    descriptionInput.value = product.description;

    submitBtn.textContent = "Actualizar producto";
    submitBtn.style.background = "#ffaa00";

    let editBanner = document.getElementById("edit-banner");
    if (!editBanner) {
      editBanner = document.createElement("p");
      editBanner.id = "edit-banner";
      editBanner.textContent = "Modo edición: actualizando producto...";
      editBanner.style.color = "#ff8800";
      editBanner.style.fontWeight = "bold";
      editBanner.style.marginBottom = "10px";
      form.parentElement.insertBefore(editBanner, form);
    }
  };

  function resetEditMode() {
    editingId = null;
    submitBtn.textContent = "Guardar";
    submitBtn.style.background = "#3a87ff";

    const banner = document.getElementById("edit-banner");
    if (banner) banner.remove();
  }

  resetBtn.addEventListener("click", () => {
    form.reset();
    resetEditMode();
  });

  // Eliminar producto (con confirmación y animación)
  window.deleteProduct = (id) => {
    const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (!confirmDelete) return;

    const row = [...tableBody.children].find((tr) => tr.children[0].textContent == id);
    if (row) {
      row.style.transition = "opacity 0.4s";
      row.style.opacity = "0";
    }

    setTimeout(() => {
      products = products.filter((p) => p.id !== id);
      renderProducts();
      alert("Producto eliminado correctamente.");
    }, 400);
  };

  renderProducts();
});
