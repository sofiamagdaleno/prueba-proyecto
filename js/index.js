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

    // Escucha el clic en el botón de "Cerrar sesión"
document.getElementById('logout').addEventListener('click', function(e) {
    e.preventDefault(); // Evita la acción predeterminada del enlace
    // Aquí puedes eliminar las credenciales del usuario ejemplo con localStorage 
    localStorage.removeItem('usuarioAutenticado'); 
    // Redirigir a la pantalla de inicio de sesión
    window.location.href = 'login.html';
});
});
