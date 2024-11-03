document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos del carrito del localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    /*contador badge 
    document.getElementById("badge-carrito").innerHTML = cartItems.length;
    
    function cargarCarrito(){
    renderCartItems();
    actualizarBadge();}

    window.addEventListener('storage', function(event){
        if (event.key === 'cartItems'){
            cartItems = JSON.parse(event.newValue)||[];
            actualizarBadge();
                }
    });
    
    cargarCarrito();

});*/



const badge = document.getElementById("badge-carrito");

//contador badge 
  document.getElementById("badge-carrito").innerHTML = cartItems.length;
  //actualiza el contador

function actualizarBadge(){
badge.innerHTML = cartItems.length
}


  actualizarBadge();

});