// Sistema CRUD de Productos
// Funcionalidad actual:
// - Crear productos
// - Listar productos
// - Editar productos (con indicador visual de modo edición)
// - Eliminar productos
// - Mostrar mensaje cuando no hay productos

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
    console.error("Error: No se encontraron uno o más elementos del DOM. Revisa los IDs en index.html");
    return;
  }

  const submitBtn = form.querySelector("button[type='submit']");
  if (!submitBtn) {
    console.error("Error: No se encontró el botón de submit dentro del formulario.");
    return;
  }

  // Estilos iniciales del botón de guardar
  submitBtn.textContent = "Guardar";
  submitBtn.style.background = "#3a87ff";
  submitBtn.style.color = "#fff";
  submitBtn.style.border = "none";

  const emptyMessage = document.createElement("p");
  emptyMessage.textContent = "No hay productos registrados.";
  emptyMessage.style.color = "#666";
  emptyMessage.style.marginTop = "10px";
  emptyMessage.id = "empty-msg";

  // Manejar submit del formulario (crear o editar producto)
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const description = descriptionInput.value.trim();

    if (!name || isNaN(price)) {
      alert("Nombre y precio son obligatorios y el precio debe ser un número válido.");
      return;
    }

    const newProduct = {
      id: editingId ?? Date.now(),
      name,
      price,
      description,
    };

    if (editingId) {
      // Actualizar producto existente
      const index = products.findIndex((p) => p.id === editingId);
      if (index !== -1) {
        products[index] = newProduct;
      }
      editingId = null;
    } else {
      // Crear producto nuevo
      products.push(newProduct);
    }

    // Volver a modo "crear" después de guardar
    submitBtn.textContent = "Guardar";
    submitBtn.style.background = "#3a87ff";

    const editBanner = document.getElementById("edit-banner");
    if (editBanner) editBanner.remove();

    renderProducts();
    form.reset();
  });

  // Renderizar tabla
  function renderProducts() {
    tableBody.innerHTML = "";

    if (products.length === 0) {
      // Mostrar mensaje de "sin productos"
      if (!document.getElementById("empty-msg")) {
        tableBody.parentElement.appendChild(emptyMessage);
      }
      return;
    }

    // Si ya hay productos, quitar el mensaje vacío si existe
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
          <button onclick="deleteProduct(${product.id})">Eliminar</button>
        </td>
      `;

      tableBody.appendChild(row);
    });
  }

  // Función global para editar producto (modo edición mejorado)
  window.editProduct = (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    editingId = id;

    nameInput.value = product.name;
    priceInput.value = product.price;
    descriptionInput.value = product.description;

    // ---- Mejoras para modo edición ----
    submitBtn.textContent = "Actualizar producto";
    submitBtn.style.background = "#ffaa00";

    // Crear mensaje visual arriba del formulario
    let editBanner = document.getElementById("edit-banner");
    if (!editBanner) {
      editBanner = document.createElement("p");
      editBanner.id = "edit-banner";
      editBanner.textContent = "Modo edición: estás actualizando un producto.";
      editBanner.style.color = "#ff8800";
      editBanner.style.fontWeight = "bold";
      editBanner.style.marginBottom = "10px";
      form.parentElement.insertBefore(editBanner, form);
    }
  };

  // Función global para eliminar producto
  window.deleteProduct = (id) => {
    products = products.filter((p) => p.id !== id);
    renderProducts();
  };

  // Botón de limpiar / cancelar edición
  resetBtn.addEventListener("click", () => {
    editingId = null;
    form.reset();

    // Volver a modo normal
    submitBtn.textContent = "Guardar";
    submitBtn.style.background = "#3a87ff";

    const editBanner = document.getElementById("edit-banner");
    if (editBanner) editBanner.remove();
  });

  // Render inicial (para que muestre el mensaje "No hay productos" al cargar)
  renderProducts();

  console.log("Product CRUD inicializado correctamente.");
});
