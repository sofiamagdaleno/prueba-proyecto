const productId = localStorage.getItem('selectedProductid'); // Obtener el ID del producto del localStorage
const url = `https://japceibal.github.io/emercado-api/products/${productId}.json`;

// Función para cargar los detalles del producto
async function loadProductInfo() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const product = data; // Producto obtenido

        if (product) {
            // Mostrar la información del producto en la página
            document.getElementById('product-name').textContent = product.name || 'Nombre del producto';
            document.getElementById('product-image').src = product.image || 'ruta-a-imagen-por-defecto.jpg';
            document.getElementById('product-description').textContent = product.description || 'Descripción no disponible';
            document.getElementById('product-price').textContent = `Precio: ${product.cost || 'Precio no disponible'} ${product.currency || 'Moneda no disponible'}`;
            document.getElementById('product-sold').textContent = `Vendidos: ${product.soldCount || 'Información no disponible'}`;
            document.getElementById('product-category').textContent = product.category || 'Categoría no disponible';

            // Cambios: Actualizar el carrusel con las imágenes del producto
            const carouselItems = document.querySelectorAll('#productCarousel .carousel-item');
            carouselItems.forEach((item, index) => {
                const img = item.querySelector('img');
                if (product.images && product.images[index]) {
                    img.src = product.images[index];
                    item.classList.remove('d-none'); // Asegurarse de que los elementos no están ocultos
                } else {
                    item.classList.add('d-none');
                }
            });

            // Cambios: Actualizar las miniaturas con las imágenes del producto
            const thumbnails = document.querySelectorAll('.img-thumbnail');
            thumbnails.forEach((thumbnail, index) => {
                if (product.images && product.images[index]) {
                    thumbnail.src = product.images[index];
                    thumbnail.classList.remove('d-none'); // Asegurarse de que las miniaturas no están ocultas
                } else {
                    thumbnail.classList.add('d-none');
                }
            });

            // Cambios: Mostrar el primer elemento del carrusel si hay imágenes
            if (product.images && product.images.length > 0) {
                document.querySelector('#productCarousel .carousel-item').classList.remove('d-none');
            }

            // Cambios: Cargar productos relacionados
            await loadRelatedProducts(product.category);
        } else {
            // Producto no encontrado
            document.querySelector('.container-info-product').innerHTML = '<p>Producto no encontrado.</p>';
        }
    } catch (error) {
        console.error('Error al cargar la información del producto:', error);
        document.querySelector('.container-info-product').innerHTML = '<p>Error al cargar la información del producto.</p>';
    }
}

//  Función para cargar productos relacionados
async function loadRelatedProducts(category) {
    try {
        const response = await fetch('https://japceibal.github.io/emercado-api/products/all.json');
        const data = await response.json();
        const allProducts = data; // Todos los productos

        //  Filtrar productos por categoría
        const relatedProducts = allProducts.filter(product => product.category === category && product.id !== productId);

        //  Mostrar productos relacionados
        const relatedProductsContainer = document.querySelector('.container-related-products');
        relatedProductsContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos productos

        relatedProducts.forEach(product => {
            relatedProductsContainer.innerHTML += `
                <div class="card">
                    <div class="card-img-related-product">
                        <img src="${product.image || 'ruta-a-imagen-por-defecto.jpg'}" alt="${product.name}">
                    </div>
                    <div class="info-card">
                        <div class="text-product">
                            <h3><label class="category"><i class="fa-solid fa-check"></i> ${product.name}</label></h3>
                        </div>
                        <div class="price">${product.cost || 'Precio no disponible'} ${product.currency || 'Moneda no disponible'}</div>
                    </div>
                    <div class="description-of-related-products">${product.description || 'Descripción no disponible'}</div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error al cargar los productos relacionados:', error);
        document.querySelector('.container-related-products').innerHTML = '<p>Proximamente Productos relacionados.</p>';
    }
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

// Cargar los detalles del producto al cargar la página
window.onload = loadProductInfo;
