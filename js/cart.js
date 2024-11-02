document.addEventListener('DOMContentLoaded', function() {
  // Obtener elementos del carrito del localStorage
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  // Seleccionar la tabla donde se mostrarán los productos
  const tablaProductos = document.querySelector('.cart-items tbody');
  const valorDolar = 40;
  const currencySelector = document.getElementById('currency-selector');
  const totalDisplay = document.getElementById('total');
  const currencyLabel = document.getElementById('currency-label');

  // Función para extraer la moneda del precio
  function obtenerMoneda(price) {
    // Divide el string en palabras y toma la última (que sería la moneda)
    const partesPrecio = price.split(" ");
    return partesPrecio[partesPrecio.length - 1]; // Obtiene "USD" o cualquier otra moneda
    }

     // Función para calcular el total del carrito
  function calcularTotal() {
    let total = 0;
    const monedaSeleccionada = currencySelector.value;

    cartItems.forEach(product => {
      // Extraer precio numérico
      const precioMatch = product.price.match(/\d+/g);
      const precioNumerico = precioMatch ? parseFloat(precioMatch.join('')) : 0;
      const monedaProducto = obtenerMoneda(product.price);

      // Convertir el subtotal según la moneda seleccionada
      let subtotal = precioNumerico * product.quantity;
      if (monedaProducto === 'USD' && monedaSeleccionada === 'UYU') {
        subtotal *= valorDolar;
      } else if (monedaProducto === 'UYU' && monedaSeleccionada === 'USD') {
        subtotal /= valorDolar;
      }
      total += subtotal;
    });

    // Actualizar el total y el label de moneda
    totalDisplay.textContent = total.toFixed(2);
    currencyLabel.textContent = monedaSeleccionada;
  }

  // Si no hay productos, mostrar mensaje de carrito vacío
  function renderCartItems() {
    tablaProductos.innerHTML = ""; // Limpiar la tabla antes de volver a renderizar

    if (cartItems.length === 0) {
      tablaProductos.innerHTML = `<tr><td colspan="5">El carrito está vacío</td></tr>`;
      return;
    }

  // Iterar sobre cada producto en el carrito
  cartItems.forEach((product, index) => {
    const fila = document.createElement('tr');

    // Columna Producto (nombre e imagen)
    const celdaProducto = document.createElement('td');
    celdaProducto.innerHTML = `
    <div class="product-container">
    <button class="remove-item" data-index="${index}"><i class="fa-solid fa-xmark"></i></button>
    <div class="product-info">
      <img src="${product.image}" alt="${product.name}" class="product-image" style="width: 100px; height: auto;">
      <h2 class="product-name">${product.name}</h2>
    </div>
  </div>
    `;
    fila.appendChild(celdaProducto);

    // En el renderizado del carrito, usa la función para obtener la moneda
    const celdaMoneda = document.createElement('td');
    celdaMoneda.textContent = obtenerMoneda(product.price);
    fila.appendChild(celdaMoneda);

    // Columna Precio (Extraer el valor numérico usando una expresión regular)
    const precioMatch = product.price.match(/\d+/g); // Buscar solo los números
    const precioNumerico = precioMatch ? parseFloat(precioMatch.join('')) : 0;
    const celdaPrecio = document.createElement('td');
    celdaPrecio.textContent = `${precioNumerico.toFixed(2)}`;
    fila.appendChild(celdaPrecio);

    // Columna Cantidad (Input para cambiar la cantidad)
    const celdaCantidad = document.createElement('td');
    celdaCantidad.innerHTML = `
      <input type="number" value="${product.quantity}" min="1" class="input-quantity" data-index="${index}">
    `;
    fila.appendChild(celdaCantidad);

    // Columna Subtotal (calcular cantidad * precio numérico)
    const subtotal = precioNumerico * product.quantity;
    const celdaSubtotal = document.createElement('td');
    celdaSubtotal.textContent = `${subtotal.toFixed(2)}`;
    celdaSubtotal.classList.add('subtotal');
    fila.appendChild(celdaSubtotal);

    // Agregar la fila del producto a la tabla
    tablaProductos.appendChild(fila);
  });

  calcularTotal();

  // Actualizar subtotal en tiempo real cuando se cambia la cantidad
  document.querySelectorAll('.input-quantity').forEach(input => {
    input.addEventListener('input', function() {
      const index = this.getAttribute('data-index');
      const newQuantity = parseInt(this.value);
      if (newQuantity > 0) {
        // Actualizar cantidad en cartItems
        cartItems[index].quantity = newQuantity;
        
        // Extraer el precio del producto actual y calcular el nuevo subtotal
        const precioMatch = cartItems[index].price.match(/\d+/g);
        const precioNumerico = precioMatch ? parseFloat(precioMatch.join('')) : 0;
        const newSubtotal = precioNumerico * newQuantity;
        
        // Actualizar subtotal en la tabla
        this.closest('tr').querySelector('.subtotal').textContent = `${newSubtotal.toFixed(2)}`;

        // Guardar la actualización en localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      }
    });
  });
   // Eliminar producto al hacer clic en la "X"
   document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', function() {
      const index = this.getAttribute('data-index');
      cartItems.splice(index, 1);  // Eliminar el producto del array
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      renderCartItems();  // Volver a renderizar la tabla
    });
  });
}

 // Cambiar moneda y recalcular total
 currencySelector.addEventListener('change', calcularTotal);

 renderCartItems();
});
