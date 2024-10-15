const productId = localStorage.getItem("selectedProductid"); // Obtener el ID del producto del localStorage
const url = `https://japceibal.github.io/emercado-api/products/${productId}.json`;
const formReview = document.getElementById("review");

// Función para cargar los detalles del producto
async function loadProductInfo() {
  try {
    const response = await fetch(url);
    const product = await response.json();

    if (product) {
      displayProductInfo(product);
      displayCarouselImages(product.images);
      await displayRelatedProducts(product.relatedProducts); // Usar la función proporcionada para productos relacionados
    } else {
      document.querySelector(".container-info-product").innerHTML =
        "<p>Producto no encontrado.</p>";
    }
  } catch (error) {
    console.error("Error al cargar la información del producto:", error);
    document.querySelector(".container-info-product").innerHTML =
      "<p>Error al cargar la información del producto.</p>";
  }
}

// Función para mostrar la información del producto
function displayProductInfo(product) {
  document.getElementById("product-name").textContent =
    product.name || "Nombre del producto";
  document.getElementById("product-image").src =
    product.image || "ruta-a-imagen-por-defecto.jpg";
  document.getElementById("product-description").textContent =
    product.description || "Descripción no disponible";
  document.getElementById("product-price").textContent = `Precio: ${
    product.cost || "Precio no disponible"
  } ${product.currency || "Moneda no disponible"}`;
  document.getElementById("product-sold").textContent = `Vendidos: ${
    product.soldCount || "Información no disponible"
  }`;
  document.getElementById("product-category").textContent =
    product.category || "Categoría no disponible";
}

// Función para actualizar imágenes del carrusel y miniaturas
function displayCarouselImages(images) {
  const carouselItems = document.querySelectorAll(
    "#productCarousel .carousel-item"
  );
  const thumbnails = document.querySelectorAll(".img-thumbnail");

  carouselItems.forEach((item, index) => {
    const img = item.querySelector("img");
    if (images && images[index]) {
      img.src = images[index];
      item.classList.remove("d-none");
    } else {
      item.classList.add("d-none");
    }
  });

  thumbnails.forEach((thumbnail, index) => {
    if (images && images[index]) {
      thumbnail.src = images[index];
      thumbnail.classList.remove("d-none");
    } else {
      thumbnail.classList.add("d-none");
    }
  });
}

// Función para mostrar los productos relacionados
async function displayRelatedProducts(relatedProducts) {
  const relatedProductsContainer = document.querySelector(
    ".container-related-products"
  );
  relatedProductsContainer.innerHTML = ""; // Limpiar productos anteriores

  for (const relatedProduct of relatedProducts) {
    const relatedProductUrl = `https://japceibal.github.io/emercado-api/products/${relatedProduct.id}.json`;

    try {
      const response = await fetch(relatedProductUrl);
      const productDetails = await response.json();

      const productDiv = document.createElement("div");
      productDiv.classList.add("card-list-products");

      productDiv.innerHTML = `
            <div class="card">
                <div class="card-img-related-product">
                    <img src="${
                      productDetails.images[0] ||
                      "ruta-a-imagen-por-defecto.jpg"
                    }" alt="${productDetails.name}">
                </div>
                <div class="info-card">
                    <div class="text-product">
                        <h3>
                            <div class="productrelatedname">${
                              productDetails.name
                            }</div>
                            <label class="category"><i class="fa-solid fa-check"></i> ${
                              productDetails.category
                            }</label>
                        </h3>
                    </div>
                    <div class="price">${productDetails.cost} ${
        productDetails.currency
      }</div>
                </div>
                <div class="description-of-related-products">${
                  productDetails.description
                }</div>
            </div>
            `;

      productDiv.addEventListener("click", () => {
        localStorage.setItem("selectedProductid", productDetails.id);
        window.location.href = "product-info.html";
      });

      relatedProductsContainer.appendChild(productDiv);
    } catch (error) {
      console.error(
        "Error al cargar los detalles del producto relacionado:",
        error
      );
    }
  }
}

// Función para guardar reseña
function saveReview(e) {
  e.preventDefault();
  const data = new FormData(e.target);
  const review = {
    producto: productId,
    score: data.get("score"),
    description: data.get("comment"),
    user: localStorage.getItem("user"),
    dateTime: new Date().toISOString().slice(0, 19).replace("T", " "),
  };
  createReview(review);
}

// Función para crear y mostrar la reseña
function createReview(review) {
  const calificaciones_usuarios = document.getElementById(
    "calificacion-usuarios"
  );
  const commentDiv = document.createElement("div");

  let stars = "";
  for (let i = 0; i < 5; i++) {
    stars +=
      i < review.score
        ? '<span class="star">&#9733;</span>'
        : '<span class="star empty-star">&#9734;</span>';
  }

  commentDiv.innerHTML = `
        <div class="user-info">
            <strong>${review.user}</strong><div class="user-rating">${stars}</div>
        </div>
        <div class="user-info">
            <span>Fecha: ${review.dateTime}</span>
        </div>
        <div class="comment">
            <p>${review.description}</p>
        </div>
    `;

  // Añadir el comentario al contenedor
  calificaciones_usuarios.appendChild(commentDiv);
}

// Event listener para el formulario de reseñas
formReview.addEventListener("submit", saveReview);

// Sección comentarios del producto
const url_comm = `https://japceibal.github.io/emercado-api/products_comments/${productId}.json`;

fetch(url_comm)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error al obtener los datos");
    }
    return response.json();
  })
  .then((data) => {
    data.forEach((comment) => {
      createReview(comment);
    });
  })
  .catch((error) => console.error("Error al cargar los comentarios:", error));

// Controladores de cantidad de producto
const btnIncrement = document.getElementById("increment");
const btnDecrement = document.getElementById("decrement");
const inputQuantity = document.getElementById("quantity");
let valueByDefault = parseInt(inputQuantity.value) || 1;

if (btnIncrement && btnDecrement && inputQuantity) {
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

// Toggle descripción
const toggleDescription = document.querySelector(".title-description");
const toggleAdditionalInformation = document.querySelector(
  ".title-additional-information"
);
const contentDescription = document.querySelector(".text-description");
const contentAdditionalInformation = document.querySelector(
  ".text-additional-information"
);

if (toggleDescription && contentDescription) {
  toggleDescription.addEventListener("click", () => {
    contentDescription.classList.toggle("hidden");
  });
}

if (toggleAdditionalInformation && contentAdditionalInformation) {
  toggleAdditionalInformation.addEventListener("click", () => {
    contentAdditionalInformation.classList.toggle("hidden");
  });
}
// botón claro/oscuro
// Referencia al input del switch
const themeSwitchCheckbox = document.getElementById("theme-switch");

// Función para cambiar entre modo oscuro y claro
function toggleDarkMode() {
  const darkModeEnabled = document.body.classList.toggle("dark-mode");

  // Guardar la preferencia en localStorage
  if (darkModeEnabled) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

// Cargar el tema guardado desde localStorage al cargar la página
function loadThemeFromLocalStorage() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeSwitchCheckbox.checked = true; // Marcar el checkbox si es modo oscuro
  } else {
    document.body.classList.remove("dark-mode");
    themeSwitchCheckbox.checked = false; // Desmarcar el checkbox si es modo claro
  }
}

// Añadir event listener para el switch
themeSwitchCheckbox.addEventListener("change", toggleDarkMode);

// Ejecutar al cargar la página
loadThemeFromLocalStorage();

// fin botón claro/oscuro
// Cargar los detalles del producto al cargar la página
window.onload = loadProductInfo;
