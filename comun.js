// FUNCIONES GENERALES DEL SISTEMA

function obtenerDatos(clave) {
    try {
        return JSON.parse(localStorage.getItem(clave)) || [];
    } catch (error) {
        console.error("Error al recuperar datos:", error);
        return [];
    }
}

function guardarDatos(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}

function obtenerCiudadanos() {
    return obtenerDatos("ciudadanos");
}

function obtenerSesion() {
    try {
        return JSON.parse(localStorage.getItem("sesionCOPACI"));
    } catch (error) {
        return null;
    }
}

function guardarSesion(sesion) {
    localStorage.setItem("sesionCOPACI", JSON.stringify(sesion));
}

function cerrarSesion() {
    localStorage.removeItem("sesionCOPACI");
    window.location.href = "index.html";
}

function crearFolio(prefijo) {
    return prefijo + Date.now();
}

function escapar(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, caracter => {
        const entidades = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entidades[caracter];
    });
}

function protegerPagina(rol) {
    const sesion = obtenerSesion();

    if (!sesion || sesion.rol !== rol) {
        window.location.href = "index.html";
        return false;
    }

    return true;
}

// BOTÓN CERRAR SESIÓN

document.addEventListener("DOMContentLoaded", function () {
    const boton = document.getElementById("cerrarSesion");

    if (boton) {
        boton.addEventListener("click", cerrarSesion);
    }
});