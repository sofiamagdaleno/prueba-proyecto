const BASE_URL = "http://localhost:3000/api";

const CATEGORIES_URL = `${BASE_URL}/categories`; // Ruta para categorías
const PUBLISH_PRODUCT_URL = `${BASE_URL}/sell`; // Ruta para publicar producto
const PRODUCTS_URL = `${BASE_URL}/cats_products/`; // Ruta para productos por categoría
const PRODUCT_INFO_URL = `${BASE_URL}/products/`; // Ruta para detalles de un producto
const PRODUCT_INFO_COMMENTS_URL = `${BASE_URL}/products_comments/`; // Ruta para comentarios de un producto
const CART_INFO_URL = `${BASE_URL}/user-cart`; // Ruta para carrito de usuario
const CART_BUY_URL = `${BASE_URL}/cart`; // Ruta para el proceso de compra
const EXT_TYPE = ".json"; 

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}
