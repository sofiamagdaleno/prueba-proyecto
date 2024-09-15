let valor_id = localStorage.getItem("catID");
console.log(valor_id);
const url = "https://japceibal.github.io/emercado-api/cats_products/" + valor_id + ".json";

async function loadProducts() {
  try {
    const response = await fetch(url);
    const data = await response.json();

    const productsList = document.getElementById("products-list");
    const productTemplate = document.getElementById("product-template");

    // Iterar sobre los productos y agregarlos al DOM
    data.products.forEach((product) => {
      // Clonar la plantilla de producto
      const productClone = productTemplate.cloneNode(true);
      productClone.classList.remove("d-none");
      productClone.classList.add("d-flex");

      // Modificar el contenido de la plantilla clonada
      productClone.querySelector("img").src = product.image;
      productClone.querySelector(".product-name").textContent = product.name;
      productClone.querySelector(".product-description").textContent =
        product.description;
      productClone.querySelector(
        ".product-price"
      ).textContent = `Precio: ${product.cost} ${product.currency}`;
      productClone.querySelector('.product-sold').textContent = `Vendidos: ${product.soldCount}`;

      productClone.addEventListener('click', () => {
        selectProduct(product.id);
      });

      // Añadir el producto clonado al contenedor principal
      productsList.appendChild(productClone);
    });
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
}
function selectProduct(productId) {
  // Guardar el identificador del producto en localStorage
  localStorage.setItem('selectedProductid', productId);
  // Redirigir a product-info.html
  window.location.href = 'product-info.html';
}

window.onload = loadProducts;

// Funcionalidad para mostrar/ocultar el contenedor de filtros
document.getElementById('FilterButton').addEventListener('click', function() {
  let filterContainer = document.getElementById('filterContainer');
  if (filterContainer.style.display === 'none' || filterContainer.style.display === '') {
    filterContainer.style.display = 'block'; // Mostrar el contenedor
  } else {
    filterContainer.style.display = 'none'; // Ocultar el contenedor
  }
});

let productos = [];

async function loadProducts() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    productos = data.products; // Guardar los productos en la variable global
    mostrarProductos(productos); // Mostrar productos cargados
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
}

// Función para mostrar productos
function mostrarProductos(productos) {
  const productsList = document.getElementById("products-list");
  const productTemplate = document.getElementById("product-template");
  productsList.innerHTML = ""; // Limpiar la lista de productos

  productos.forEach((product) => {
    const productClone = productTemplate.cloneNode(true);
    productClone.classList.remove("d-none");
    productClone.classList.add("d-flex");

    productClone.querySelector("img").src = product.image;
    productClone.querySelector(".product-name").textContent = product.name;
    productClone.querySelector(".product-description").textContent = product.description;
    productClone.querySelector(".product-price").textContent = `Precio: ${product.cost} ${product.currency}`;
    productClone.querySelector(".product-sold").textContent = `Vendidos: ${product.soldCount}`;

    productsList.appendChild(productClone);
  });
}

// Filtro por precio
document.getElementById('filtroMinMax').addEventListener('submit', (e) => {
  e.preventDefault();
  const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
  const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;

  const productosFiltrados = productos.filter(product => product.cost >= minPrice && product.cost <= maxPrice);
  mostrarProductos(productosFiltrados);
});


document.querySelector("#seleccion").addEventListener('change', () => {
  const seleccion = document.querySelector("#seleccion").value;
  let productosOrdenados = [...productos]; s

  switch (seleccion) {
    case "asc":
      productosOrdenados.sort((a, b) => a.cost - b.cost);
      document.querySelector("#resultado").textContent = `Precios Ascendentes`;
      break;
    case "desc":
      productosOrdenados.sort((a, b) => b.cost - a.cost);
      document.querySelector("#resultado").textContent = `Precios Descendentes`;
      break;
    case "relevance":
      productosOrdenados.sort((a, b) => b.soldCount - a.soldCount);
      document.querySelector("#resultado").textContent = `Relevancia Descendente`;
      break;
  }

  mostrarProductos(productosOrdenados);
});

window.onload = loadProducts

