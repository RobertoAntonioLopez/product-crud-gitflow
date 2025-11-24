// Sistema CRUD de Productos
// Rama: feature/create-product

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

    renderProducts();
    form.reset();
  });

  // Función para renderizar la tabla
  function renderProducts() {
    tableBody.innerHTML = "";

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

  // Hacer accesibles las funciones de editar y eliminar en el ámbito global
  window.editProduct = (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    editingId = id;
    nameInput.value = product.name;
    priceInput.value = product.price;
    descriptionInput.value = product.description;
  };

  window.deleteProduct = (id) => {
    products = products.filter((p) => p.id !== id);
    renderProducts();
  };

  // Botón de limpiar
  resetBtn.addEventListener("click", () => {
    editingId = null;
    form.reset();
  });

  console.log("Product CRUD inicializado correctamente.");
});
