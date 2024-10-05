const productId = localStorage.getItem('selectedProductid'); // Obtener el ID del producto del localStorage
const url = `https://japceibal.github.io/emercado-api/products/${productId}.json`;

// Función para cargar los detalles del producto
async function loadProductInfo() {
    try {
        const response = await fetch(url);
        const product = await response.json(); // Producto obtenido directamente

        if (product) {
            // Mostrar la información del producto en la página
            document.getElementById('product-name').textContent = product.name || 'Nombre del producto';
            document.getElementById('product-image').src = product.image || 'ruta-a-imagen-por-defecto.jpg';
            document.getElementById('product-description').textContent = product.description || 'Descripción no disponible';
            document.getElementById('product-price').textContent = `Precio: ${product.cost || 'Precio no disponible'} ${product.currency || 'Moneda no disponible'}`;
            document.getElementById('product-sold').textContent = `Vendidos: ${product.soldCount || 'Información no disponible'}`;
            document.getElementById('product-category').textContent = product.category || 'Categoría no disponible';

            // Actualizar el carrusel con las imágenes del producto
            const carouselItems = document.querySelectorAll('#productCarousel .carousel-item');
            carouselItems.forEach((item, index) => {
                const img = item.querySelector('img');
                if (product.images && product.images[index]) {
                    img.src = product.images[index];
                    item.classList.remove('d-none'); // Asegurarse de que los elementos no estén ocultos
                } else {
                    item.classList.add('d-none');
                }
            });

            // Actualizar las miniaturas con las imágenes del producto
            const thumbnails = document.querySelectorAll('.img-thumbnail');
            thumbnails.forEach((thumbnail, index) => {
                if (product.images && product.images[index]) {
                    thumbnail.src = product.images[index];
                    thumbnail.classList.remove('d-none'); // Asegurarse de que las miniaturas no estén ocultas
                } else {
                    thumbnail.classList.add('d-none');
                }
            });

            // Mostrar el primer elemento del carrusel si hay imágenes
            if (product.images && product.images.length > 0) {
                document.querySelector('#productCarousel .carousel-item').classList.remove('d-none');
            }

            // Mostrar productos relacionados desde el array dentro del producto
            displayRelatedProducts(product.relatedProducts);
        } else {
            // Producto no encontrado
            document.querySelector('.container-info-product').innerHTML = '<p>Producto no encontrado.</p>';
        }
    } catch (error) {
        console.error('Error al cargar la información del producto:', error);
        document.querySelector('.container-info-product').innerHTML = '<p>Error al cargar la información del producto.</p>';
    }
}

// Función para mostrar los productos relacionados
function displayRelatedProducts(relatedProducts) {
    const relatedProductsContainer = document.querySelector('.container-related-products');
    relatedProductsContainer.innerHTML = ''; // Limpiar productos anteriores

    relatedProducts.forEach(async relatedProduct => {
        const relatedProductUrl = `https://japceibal.github.io/emercado-api/products/${relatedProduct.id}.json`;

        try {
            const response = await fetch(relatedProductUrl);
            const productDetails = await response.json();

            const productDiv = document.createElement('div');
            productDiv.classList.add('card-list-products');

            productDiv.innerHTML = `
            <div class="card">
                <div class="card-img-related-product">
                    <img src="${productDetails.images[0] || 'ruta-a-imagen-por-defecto.jpg'}" alt="${productDetails.name}">
                </div>
                <div class="info-card">
                    <div class="text-product">
                        <h3>
                            <div class="productrelatedname">${productDetails.name}</div>
                            <label class="category"><i class="fa-solid fa-check"></i> ${productDetails.category}</label>
                        </h3>
                    </div>
                    <div class="price">${productDetails.cost} ${productDetails.currency}</div>
                </div>
                <div class="description-of-related-products">${productDetails.description}</div>
            </div>
            `;

            productDiv.addEventListener('click', () => {
                localStorage.setItem("selectedProductid", productDetails.id);
                window.location.href = "product-info.html";
            });

            relatedProductsContainer.appendChild(productDiv);

        } catch (error) {
            console.error('Error al cargar los detalles del producto relacionado:', error);
        }
    });
}

// Definir elementos de control y variables
const btnIncrement = document.getElementById('increment');
const btnDecrement = document.getElementById('decrement');
const inputQuantity = document.getElementById('quantity');
let valueByDefault = parseInt(inputQuantity.value) || 1;

// Funciones click
if (btnIncrement && btnDecrement && inputQuantity) {
    btnIncrement.addEventListener('click', () => {
        valueByDefault += 1;
        inputQuantity.value = valueByDefault;
    });

    btnDecrement.addEventListener('click', () => {
        if (valueByDefault > 1) {
            valueByDefault -= 1;
            inputQuantity.value = valueByDefault;
        }
    });
}

// Toggle descripción
const toggleDescription = document.querySelector('.title-description');
const toggleAdditionalInformation = document.querySelector('.title-additional-information');

// Constantes texto
const contentDescription = document.querySelector('.text-description');
const contentAdditionalInformation = document.querySelector('.text-additional-information');

// Funciones toggle
if (toggleDescription && contentDescription) {
    toggleDescription.addEventListener('click', () => {
        contentDescription.classList.toggle('hidden');
    });
}

if (toggleAdditionalInformation && contentAdditionalInformation) {
    toggleAdditionalInformation.addEventListener('click', () => {
        contentAdditionalInformation.classList.toggle('hidden');
    });
}
// Seccion comentarios del producto
const url_comm = `https://japceibal.github.io/emercado-api/products_comments/${productId}.json`;

const calificaciones_usuarios = document.getElementById('calificacion-usuarios');

fetch(url_comm)
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    return response.json();
  })
  .then(data => {
    data.forEach(comment => {
      const commentDiv = document.createElement('div');

      let stars = '';
      for (let i = 0; i < 5; i++) {
        if (i < comment.score) {
          stars += '<span class="star">&#9733;</span>'; 
        } else {
          stars += '<span class="star empty-star">&#9734;</span>'; 
        }
      }

      commentDiv.innerHTML = `
        <div class="user-info">
          <strong>${comment.user}</strong><div class="user-rating">${stars}</div> <!-- Estrellas pegadas al nombre -->
        </div>
        <div class="user-info">
          <span>Fecha: ${comment.dateTime}</span>
        </div>
        <div class="comment">
          <p>${comment.description}</p>
        </div>
      `;

      // Añadir el comentario al contenedor
      calificaciones_usuarios.appendChild(commentDiv);
    });
  })
  .catch(error => console.error('Error al cargar los comentarios:', error));

// Cargar los detalles del producto al cargar la página
window.onload = loadProductInfo;