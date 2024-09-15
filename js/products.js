let valor_id = localStorage.getItem("catID");
const url = "https://japceibal.github.io/emercado-api/cats_products/" + valor_id + ".json";


let productos = [];

const searchInput = document.getElementById('search-products')
const filtersButton = document.getElementById('filters-button')
const minMaxFilter = document.getElementById('filtro-min-max')
const sortFilter = document.getElementById('seleccion')

let data = [];

async function loadProducts() {
  try {
    const response = await fetch(url);
    const responseJson = await response.json();
    data = responseJson.products; // Usar variable global `data`

    showProducts(data);
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
}

function showProducts(products) {
  const productsList = document.getElementById("products-list");
  const productTemplate = document.getElementById("product-template");

  // Limpiar el contenedor de productos antes de agregar nuevos productos
  productsList.innerHTML = "";

  // Iterar sobre los productos y agregarlos al DOM
  products.forEach((product) => {
    // Clonar la plantilla de producto
    const productClone = productTemplate.cloneNode(true);
    productClone.classList.remove("d-none");
    productClone.classList.add("d-flex");

    // Modificar el contenido de la plantilla clonada
    productClone.querySelector("img").src = product.image;
    productClone.querySelector(".product-name").textContent = product.name;
    productClone.querySelector(".product-description").textContent = product.description;
    productClone.querySelector(".product-price").textContent = `Precio: ${product.cost} ${product.currency}`;
    productClone.querySelector(".product-sold").textContent = `Vendidos: ${product.soldCount}`;


    // Añadir evento para seleccionar producto
    productClone.addEventListener('click', () => {
      selectProduct(product.id); // Asumimos que el objeto 'product' tiene una propiedad 'id'
    });


    // Añadir el producto clonado al contenedor principal

    productsList.appendChild(productClone);
  });
}


// Funcionalidad para mostrar/ocultar el contenedor de filtros
document.getElementById('FilterButton').addEventListener('click', function() {
  let filterContainer = document.getElementById('filterContainer');

// Función de búsqueda
searchInput.addEventListener("keyup", async (event) => {
  const inputValue = event.target.value;

  if (inputValue) {
    const filteredData = data.filter(
      (product) => 
        product.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        product.description.toLowerCase().includes(inputValue.toLowerCase())
    );
  
    showProducts(filteredData);
  } else {
    await loadProducts();
  }
});

// Funcionalidad para mostrar/ocultar el contenedor de filtros
filtersButton.addEventListener('click', function() {
  let filterContainer = document.getElementById('filter-container');

  if (filterContainer.style.display === 'none' || filterContainer.style.display === '') {
    filterContainer.style.display = 'block'; // Mostrar el contenedor
  } else {
    filterContainer.style.display = 'none'; // Ocultar el contenedor
  }
});

// Filtro por precio
minMaxFilter.addEventListener('submit', (e) => {
  e.preventDefault();
  const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
  const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;

  const productosFiltrados = data.filter(product => product.cost >= minPrice && product.cost <= maxPrice);
  showProducts(productosFiltrados);
});


// Ordenar productos
document.querySelector("#seleccion").addEventListener('change', () => {
  const seleccion = document.querySelector("#seleccion").value;
  let productosOrdenados = [...productos];


sortFilter.addEventListener('change', (event) => {
  const sortSelected = event.target.value
  let sortedProducts;


  console.log(data)
  switch (sortSelected) {
    case "asc":
      sortedProducts = data.sort((a, b) => a.cost - b.cost);
      document.querySelector("#resultado").textContent = `Precios Ascendentes`;
      break;
    case "desc":
      sortedProducts = data.sort((a, b) => b.cost - a.cost);
      document.querySelector("#resultado").textContent = `Precios Descendentes`;
      break;
    case "relevance":
      sortedProducts = data.sort((a, b) => b.soldCount - a.soldCount);
      document.querySelector("#resultado").textContent = `Relevancia Descendente`;
      break;
  }

  showProducts(sortedProducts);
});

// Función para seleccionar un producto
function selectProduct(productId) {
  // Guardar el identificador del producto en localStorage
  localStorage.setItem('selectedProductid', productId);
  // Redirigir a product-info.html
  window.location.href = 'product-info.html';
}

window.onload = loadProducts;
