document.addEventListener('DOMContentLoaded', function() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const tablaProductos = document.querySelector('.cart-items tbody');


  // Mostrar solo el primer producto si existe
  if (cartItems.length > 0) {
    const product = cartItems[0]; // Cambia [0] al índice o id específico si es necesario
    const fila = document.createElement('tr');

    // Columna Producto (nombre e imagen)
    const celdaProducto = document.createElement('td');
    celdaProducto.innerHTML = `
      <button class="remove-item"><i class="fa-solid fa-xmark"></i></button>
      <div class="product-info">
        <img src="${product.image || 'ruta-imagen-predeterminada.jpg'}" alt="${product.name}" class="product-image" style="width: 50px; height: 50px;">
        <h2 class="product-name">${product.name}</h2>
      </div>
    `;
    fila.appendChild(celdaProducto);

    // Columna Moneda
    const celdaMoneda = document.createElement('td');
    celdaMoneda.textContent = product.currency || "USD";
    fila.appendChild(celdaMoneda);

    // Columna Precio
    const celdaPrecio = document.createElement('td');
    celdaPrecio.textContent = `$${product.price}`;
    fila.appendChild(celdaPrecio);

    // Columna Cantidad
    const celdaCantidad = document.createElement('td');
    celdaCantidad.innerHTML = `
      <input type="number" value="${product.quantity}" min="1" class="input-quantity" id="quantity">
    `;
    fila.appendChild(celdaCantidad);

    // Agregar la fila del producto a la tabla
    tablaProductos.appendChild(fila);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const btnIncrement = document.getElementById("increment");
  const btnDecrement = document.getElementById("decrement");
  const inputQuantity = document.querySelector('.input-quantity');

  if (inputQuantity) {
    let valueByDefault = parseInt(inputQuantity.value) || 1;

    if (btnIncrement && btnDecrement) {
      btnIncrement.addEventListener("click", () => {
        valueByDefault += 1;
        inputQuantity.value = valueByDefault;
      });

      btnDecrement.addEventListener("click", () => {
        if (valueByDefault > 1) {
          valueByDefault -= 1;
          inputQuantity.value = valueByDefault;
        }
      });
    }
  }
});
