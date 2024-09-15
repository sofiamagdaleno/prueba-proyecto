const productId = localStorage.getItem('selectedProductid');
const url =` https://japceibal.github.io/emercado-api/products/` 
// Función para cargar los detalles del producto
async function loadProductInfo() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        
        const product = data.products.find(item => item.id == productId);

        if (product) {
            // Mostrar la información del producto en la página
            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-image').src = product.image;
            document.getElementById('product-description').textContent = product.description;
            document.getElementById('product-price').textContent = `Precio: ${product.cost} ${product.currency}`;
            document.getElementById('product-sold').textContent = `Vendidos: ${product.soldCount}`;
        } else {
            // Producto no encontrado
            document.querySelector('.product-container').innerHTML = '<p>Producto no encontrado.</p>';
        }
    } catch (error) {
        console.error('Error al cargar la información del producto:', error);
        document.querySelector('.product-container').innerHTML = '<p>Error al cargar la información del producto.</p>';
    }
}

// Cargar los detalles del producto al cargar la página
loadProductInfo();