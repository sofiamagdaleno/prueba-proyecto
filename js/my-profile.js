document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('profileForm');
    const profileButton = document.getElementById('profileButton');
    const profilePh = document.getElementById('profilePh');
    const profilePic = document.getElementById('profilePic');


 // Verificar si el usuario está logueado
 if (!localStorage.getItem('userEmail')) {
    window.location.href = 'login.html';
}

    // Cargar datos del perfil
loadProfileData();

// Manejar envío del formulario
form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (form.checkValidity()) {
        saveProfileData();
        alert('Perfil actualizado con éxito');
    } else {
        form.reportValidity();
    }
});
// Manejar cierre de sesión
profileButton.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
});

// Manejar cambio de foto de perfil
profilePh.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePic.src = e.target.result;
            localStorage.setItem('profilePic', e.target.result);
        };
        reader.readAsDataURL(file);
    }
});
 // Funciones auxiliares
 function loadProfileData() {
    const profileData = JSON.parse(localStorage.getItem('profileData')) || {};
    for (const [key, value] of Object.entries(profileData)) {
        if (document.getElementById(key)) {
            document.getElementById(key).value = value;
        }
    }
    document.getElementById('nusuario').innerText=localStorage.getItem('userEmail') || 'Usuario';
    document.getElementById('email').value = localStorage.getItem('userEmail') || '';
    profilePic.src = localStorage.getItem('profilePic') || '/api/placeholder/150/150';
}

function saveProfileData() {
    const profileData = {
        nombre: document.getElementById('name').value,
        segundoNombre: document.getElementById('secondName').value,
        apellido: document.getElementById('lastName').value,
        segundoApellido: document.getElementById('secondLastName').value,
        telefono: document.getElementById('tel').value
    };
    localStorage.setItem('profileData', JSON.stringify(profileData));
    localStorage.setItem('userEmail', document.getElementById('email').value);
}
});


