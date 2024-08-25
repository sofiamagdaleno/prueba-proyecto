document.addEventListener("DOMContentLoaded", function() {
    // Datos
    const formulario = document.getElementById('miFormulario');
    const nombreInput = document.getElementById('Nombre');
    const contraseñaInput = document.getElementById('password');
    const nombreError = document.getElementById('nombreError');
    const contraseñaError = document.getElementById('contraseñaError');
    const nombreErrorContenedor = nombreError.parentElement;
    const contraseñaErrorContenedor = contraseñaError.parentElement;

    // Mostrar mensaje de error
    function mostrarError(elementoError, contenedorError, mensaje) {
        elementoError.textContent = mensaje;
        contenedorError.style.display = 'block';
    }

    // Ocultar mensaje
    function ocultarError(elementoError, contenedorError) {
        elementoError.textContent = '';
        contenedorError.style.display = 'none';
    }

    // Validaciones
    function validarFormulario(event) {
        event.preventDefault();
        let valido = true;

        if (nombreInput.value.trim() === '') {
            mostrarError(nombreError, nombreErrorContenedor, 'El nombre de usuario es requerido.');
            valido = false;
        } else {
            ocultarError(nombreError, nombreErrorContenedor);
        }

        if (contraseñaInput.value.trim() === '') {
            mostrarError(contraseñaError, contraseñaErrorContenedor, 'La contraseña es requerida.');
            valido = false;
        } else if (contraseñaInput.value.length < 6) {
            mostrarError(contraseñaError, contraseñaErrorContenedor, 'La contraseña debe tener al menos 6 caracteres.');
            valido = false;
        } else {
            ocultarError(contraseñaError, contraseñaErrorContenedor);
        }

        if (valido) {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem("user", nombreInput.value.trim());
            // Redirigir
            window.location.href = 'index.html';
        }
    }

    // Asocia la función de validación al formulario
    formulario.addEventListener('submit', validarFormulario);
});