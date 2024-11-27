const productId = localStorage.getItem("selectedProductid"); // Obtener el ID del producto del localStorage
const url = `http://localhost:3000/api/products/${productId}`; // Nueva URL local
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
    const relatedProductUrl = `http://localhost:3000/api/products/${relatedProduct.id}`;
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
  
  // Obtener comentarios existentes desde localStorage
  let savedReviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || [];
  
  // Añadir el nuevo comentario al array de comentarios
  savedReviews.push(review);
  
  // Guardar el array actualizado en localStorage
  localStorage.setItem(`reviews_${productId}`, JSON.stringify(savedReviews));
  
  // Mostrar el nuevo comentario en la página
  createReview(review);
  
  // Limpiar el formulario después de guardar
  e.target.reset();
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
const url_comm = `http://localhost:3000/api/products_comments/${productId}`; 

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
// Función para redirigir al carrito
function redirectToCart() {
  window.location.href = "cart.html"; // Cambia "cart.html" por la ruta a tu página de carrito
}

// Event listener para el botón de ir al carrito
const btnBuy = document.querySelector(".btn-buy");
btnBuy.addEventListener("click", () => {
  // Guardar datos del producto en localStorage
  const quantity = parseInt(inputQuantity.value) || 1;
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const productToAdd = {
    id: productId,
    name: document.getElementById("product-name").textContent,
    price: document.getElementById("product-price").textContent,
    quantity: quantity,
    image: document.getElementById("product-image").src,
  };

  // Añadir el producto al carrito
  cartItems.push(productToAdd);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  // Redirigir a la página del carrito
  redirectToCart();
});

// Cargar la información del producto al inicio
loadProductInfo();

// Event listener para el botón de seguir comprando
const btnSeguir = document.querySelector(".btn-seguir");
btnSeguir.addEventListener("click", () => {
  // Guardar datos del producto en localStorage
  const quantity = parseInt(inputQuantity.value) || 1;
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const productToAdd = {
    id: productId,
    name: document.getElementById("product-name").textContent,
    price: document.getElementById("product-price").textContent,
    quantity: quantity,
    image: document.getElementById("product-image").src,
  };

  // Añadir el producto al carrito
  cartItems.push(productToAdd);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  // Mostrar mensaje de confirmación
  showConfirmationMessage(productToAdd);
});

// Función para mostrar mensaje de confirmación
function showConfirmationMessage(product) {
  const confirmationDiv = document.createElement("div");
  confirmationDiv.classList.add("confirmation-message");
  confirmationDiv.innerHTML = `
    Se ha añadido ${product.name} (x${product.quantity}) al carrito. 
    <br>
    <button class="continue-shopping">Continuar comprando</button>
  `;
  document.body.appendChild(confirmationDiv);

  // Agregar evento para el botón de continuar comprando
  const continueButton = confirmationDiv.querySelector(".continue-shopping");
  continueButton.addEventListener("click", () => {
    confirmationDiv.remove(); // Eliminar el mensaje de confirmación
  });

  // Eliminar el mensaje después de 3 segundos si no se ha hecho clic en el botón
  setTimeout(() => {
    if (confirmationDiv) {
      confirmationDiv.remove();
    }
  }, 3000);
}
function loadReviews() {
  let savedReviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || [];

  // Mostrar cada comentario guardado
  savedReviews.forEach((review) => {
    createReview(review);
  });
}
// Cargar los detalles del producto al cargar la página
window.onload = () => {
  loadProductInfo();
  loadReviews(); // Cargar comentarios guardados
};
