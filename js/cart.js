document.addEventListener('DOMContentLoaded', function() {
  // Obtener elementos del carrito del localStorage
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  

  // Seleccionar la tabla donde se mostrarán los productos
  const tablaProductos = document.querySelector('.cart-items tbody');
  const valorDolar = 40;
  const currencySelector = document.getElementById('currency-selector');
  const totalDisplay = document.getElementById('total-summary');
  const currencyLabel = document.getElementById('currency-label');
  const badge = document.getElementById("badge-carrito");
  const defaultShipping = 'standard';
  updateCostSummary(defaultShipping);
  renderCartItems();

  //contador badge 
    document.getElementById("badge-carrito").innerHTML = cartItems.length;
    //actualiza el contador
function actualizarBadge(){
  badge.innerHTML = cartItems.length
}


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
      updateCostSummary(document.querySelector('input[name="deliveryMethod"]:checked')?.id || 'standard');
      return;
    }

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
  updateCostSummary(document.querySelector('input[name="deliveryMethod"]:checked')?.id || 'standard');

  
  // Actualizar subtotal en tiempo real cuando se cambia la cantidad
  document.querySelectorAll('.input-quantity').forEach(input => {
    input.addEventListener('input', function () {
      const index = this.getAttribute('data-index');
      const newQuantity = parseInt(this.value);
      if (newQuantity > 0) {
        // Actualizar cantidad en cartItems
        cartItems[index].quantity = newQuantity;
  
        // Guardar cambios en localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
  
        // Volver a calcular los costos
        renderCartItems();
        updateCostSummary(document.querySelector('input[name="deliveryMethod"]:checked')?.id || 'standard');
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
  actualizarBadge();
}

// Función para cargar los productos del carrito desde localStorage
function loadCartItems() {
  return JSON.parse(localStorage.getItem('cartItems')) || [];
}


// Función para calcular el subtotal, convirtiendo precios en UYU a USD si es necesario
function calculateSubtotal(cartItems) {
  const valorDolar = 40;
  return cartItems.reduce((subtotal, item) => {
    const priceValue = parseFloat(item.price.replace(/[^\d.]/g, ''));
    const quantity = Number(item.quantity);


    // Convertir a USD si el precio está en UYU
    const isUYU = item.price.includes('UYU');
    const priceInUSD = isUYU ? priceValue / valorDolar : priceValue;


    return subtotal + (priceInUSD * quantity);
  }, 0);
}


// Función para calcular el costo de envío
function calculateShippingCost(subtotal, shippingPercentage) {
  return subtotal * shippingPercentage;
}


// Función para actualizar el resumen de costos
function updateCostSummary(shippingType) {
  const cartItems = loadCartItems();
  const subtotal = calculateSubtotal(cartItems);


  // Asigna el porcentaje de envío en función del tipo seleccionado
  let shippingPercentage = 0;
  switch (shippingType) {
    case 'premium':
      shippingPercentage = 0.15;
      break;
    case 'express':
      shippingPercentage = 0.07;
      break;
    case 'standard':
      shippingPercentage = 0.05;
      break;
    default:
      shippingPercentage = 0;
  }


  // Calcula el costo de envío y el total
  const shippingCost = calculateShippingCost(subtotal, shippingPercentage);
  const total = subtotal + shippingCost;


  // Muestra los valores en el modal
  document.getElementById('subtotal-modal').textContent = subtotal.toFixed(2);
  document.getElementById('envio-modal').textContent = shippingCost.toFixed(2);
  document.getElementById('total-modal').textContent = total.toFixed(2);


  // Establece el símbolo de moneda en USD (ya que ahora todo está en USD)
  document.getElementById('currency-label').textContent = 'USD';
}


// Configura el evento para los botones `btn-check`
document.querySelectorAll('input[name="deliveryMethod"]').forEach(option => {
  option.addEventListener('change', function () {
    // Actualizar resumen de costos en tiempo real
    updateCostSummary(this.id);
  });
});


// Inicializa el cálculo con el envío estándar por defecto al cargar la página
updateCostSummary('standard');

 // Cambiar moneda y recalcular total
 currencySelector.addEventListener('change', calcularTotal);

 renderCartItems();

 // Validaciones al hacer clic en "Finalizar Compra"
 

  document.querySelector('.finalizar-compra').addEventListener('click', function() {
    // Validar cantidades mayores a 0
    const rows = document.querySelectorAll('.cart-items tbody tr');
    let validQuantities = true;
  
    rows.forEach((row) => {
      const quantityInput = row.querySelector('.input-quantity'); // Ajustar la clase según tu código
      const quantity = parseInt(quantityInput.value, 10);
  
      if (isNaN(quantity) || quantity <= 0) {
        validQuantities = false;
        quantityInput.classList.add('is-invalid');
      } else {
        quantityInput.classList.remove('is-invalid');
      }
    });
  
    if (!validQuantities) {
      alert('Por favor, asegúrate de que todas las cantidades sean mayores a 0.');
      return;
    }
  const department = document.getElementById('department').value;
  const city = document.getElementById('city').value;
  const street = document.getElementById('street').value;
  const number = document.getElementById('number').value;
  const corner = document.getElementById('corner').value;

  if (!department || !city || !street || !number || !corner) {
    alert("Por favor, completa todos los campos de dirección.");
    return;
  }

  const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked');
  if (!deliveryMethod) {
    alert("Por favor, selecciona un método de envío.");
    return;
  }

  // Obtener todos los grupos de pago
  const paymentGroups = document.querySelectorAll('[data-group="payment"]');
  let isValid = false;

  paymentGroups.forEach((group) => {
    const inputs = group.querySelectorAll("input");
    let groupValid = true;

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        groupValid = false;
        input.classList.add("is-invalid");
      } else {
        input.classList.remove("is-invalid");
      }
    });

    if (groupValid) {
      isValid = true; // Al menos un grupo está completo
    }
  });

  if (isValid) {
    alert("¡Compra exitosa!");
  } else {
    alert("Elige y completa al menos una forma de pago.");
  }
  
  localStorage.removeItem('cartItems');
});
});
