// botón claro/oscuro
// Referencia al input del switch
const themeSwitchCheckbox = document.getElementById("theme-switch");

// Función para cambiar entre modo oscuro y claro
function toggleDarkMode() {
  const darkModeEnabled = document.body.classList.toggle("dark-mode");

  // Guardar la preferencia en localStorage
  if (darkModeEnabled) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

// Cargar el tema guardado desde localStorage al cargar la página
function loadThemeFromLocalStorage() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeSwitchCheckbox.checked = true; // Marcar el checkbox si es modo oscuro
  } else {
    document.body.classList.remove("dark-mode");
    themeSwitchCheckbox.checked = false; // Desmarcar el checkbox si es modo claro
  }
}

// Añadir event listener para el switch
themeSwitchCheckbox.addEventListener("change", toggleDarkMode);

// Ejecutar al cargar la página
loadThemeFromLocalStorage();

// fin botón claro/oscuro