document.addEventListener("DOMContentLoaded", function() {
    // Verifica si el usuario está autenticado
    let usuario = localStorage.getItem("user");
    if (usuario === null) { 
        // Si no está autenticado, redirige a la página de login
        window.location.href = "login.html";
    } else {
        // Usuario autenticado, procede con la configuración de eventos
        document.getElementById("autos").addEventListener("click", function() {
            localStorage.setItem("catID", 101);
            window.location.href = "products.html";
        });

        document.getElementById("juguetes").addEventListener("click", function() {
            localStorage.setItem("catID", 102);
            window.location.href = "products.html";
        });

        document.getElementById("muebles").addEventListener("click", function() {
            localStorage.setItem("catID", 103);
            window.location.href = "products.html";
        });
    }
    document.getElementById('user').textContent = usuario;
});
