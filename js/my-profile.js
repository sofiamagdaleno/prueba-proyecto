document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('profileForm');
    const profilePh = document.getElementById('profilePh');
    const profilePic = document.getElementById('profilePic');


    // Verificar si el usuario está logueado
    if (!localStorage.getItem('user')) {
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
        const profileData = JSON.parse(localStorage.getItem('profileData'));

        if (!profileData) return;
        for (const [key, value] of Object.entries(profileData)) {
            if (document.getElementById(key)) {
                document.getElementById(key).value = value;
            }
        }
        profilePic.src = localStorage.getItem('profilePic') || '/api/placeholder/150/150'
    }

    function saveProfileData() {
        const profileData = {
            name: document.getElementById('name').value,
            secondName: document.getElementById('secondName').value,
            lastName: document.getElementById('lastName').value,
            secondLastName: document.getElementById('secondLastName').value,
            email: document.getElementById('email').value,
            tel: document.getElementById('tel').value,
        };
        localStorage.setItem('profileData', JSON.stringify(profileData));
    }
});
