let valor_id = localStorage.getItem("catID");
console.log(valor_id);
const url = "https://japceibal.github.io/emercado-api/cats_products/" + valor_id + ".json";

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

    // Añadir evento para seleccionar producto
    productClone.addEventListener('click', () => {
      selectProduct(product.id); // Asumimos que el objeto 'product' tiene una propiedad 'id'
    });

    productsList.appendChild(productClone);
  });
}

// Funcionalidad para mostrar/ocultar el contenedor de filtros
document.getElementById('FilterButton').addEventListener('click', function() {
  let filterContainer = document.getElementById('filterContainer');
  if (filterContainer.style.display === 'none' || filterContainer.style.display === '') {
    filterContainer.style.display = 'block'; // Mostrar el contenedor
  } else {
    filterContainer.style.display = 'none'; // Ocultar el contenedor
  }
});

// Filtro por precio
document.getElementById('filtroMinMax').addEventListener('submit', (e) => {
  e.preventDefault();
  const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
  const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;

  const productosFiltrados = productos.filter(product => product.cost >= minPrice && product.cost <= maxPrice);
  mostrarProductos(productosFiltrados);
});

// Ordenar productos
document.querySelector("#seleccion").addEventListener('change', () => {
  const seleccion = document.querySelector("#seleccion").value;
  let productosOrdenados = [...productos];

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

// Función para seleccionar un producto
function selectProduct(productId) {
  // Guardar el identificador del producto en localStorage
  localStorage.setItem('selectedProductid', productId);
  // Redirigir a product-info.html
  window.location.href = 'product-info.html';
}

window.onload = loadProducts;
