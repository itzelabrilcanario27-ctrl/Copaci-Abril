// CREDENCIALES DE PRUEBA

const ADMIN_CORREO = "admin@copaci.com";
const ADMIN_PASSWORD = "Admin2026*";

const COPACI_CORREO = "copaci@copaci.com";
const COPACI_PASSWORD = "Copaci2026*";

// REGISTRO DE CIUDADANOS

const registroForm = document.getElementById("registroForm");

if (registroForm) {
    registroForm.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const direccion = document.getElementById("direccion").value.trim();
        const correo = document.getElementById("correoRegistro").value.trim().toLowerCase();
        const password = document.getElementById("passwordRegistro").value;

        const mensaje = document.getElementById("mensajeRegistro");

        if (!nombre || !direccion || !correo || !password) {
            mensaje.textContent = "Completa todos los campos.";
            return;
        }

        if (password.length < 6) {
            mensaje.textContent = "La contraseña debe tener mínimo 6 caracteres.";
            return;
        }

        if (correo === ADMIN_CORREO || correo === COPACI_CORREO) {
            mensaje.textContent = "Este correo está reservado.";
            return;
        }

        const ciudadanos = obtenerCiudadanos();

        const existe = ciudadanos.some(
            ciudadano => ciudadano.correo.toLowerCase() === correo
        );

        if (existe) {
            mensaje.textContent = "Este correo ya está registrado.";
            return;
        }

        ciudadanos.push({
            nombre: nombre,
            direccion: direccion,
            correo: correo,
            password: password,
            rol: "ciudadano"
        });

        guardarDatos("ciudadanos", ciudadanos);

        mensaje.textContent = "¡Registro realizado correctamente!";

        registroForm.reset();
    });
}

// INICIO DE SESIÓN

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const tipo = document.getElementById("tipoUsuario").value;
        const correo = document.getElementById("correoLogin").value.trim().toLowerCase();
        const password = document.getElementById("passwordLogin").value;

        const mensaje = document.getElementById("mensajeLogin");

        if (!tipo || !correo || !password) {
            mensaje.textContent = "Completa todos los campos.";
            return;
        }

        // ACCESO ADMINISTRADOR

        if (
            tipo === "administrador" &&
            correo === ADMIN_CORREO &&
            password === ADMIN_PASSWORD
        ) {
            guardarSesion({
                correo: correo,
                nombre: "Administrador",
                rol: "administrador"
            });

            window.location.href = "administrador.html";
            return;
        }

        // ACCESO COPACI

        if (
            tipo === "copaci" &&
            correo === COPACI_CORREO &&
            password === COPACI_PASSWORD
        ) {
            guardarSesion({
                correo: correo,
                nombre: "COPACI",
                rol: "copaci"
            });

            window.location.href = "copaci.html";
            return;
        }

        // ACCESO CIUDADANO

        if (tipo === "ciudadano") {
            const ciudadanos = obtenerCiudadanos();

            const ciudadano = ciudadanos.find(
                persona =>
                    persona.correo.toLowerCase() === correo &&
                    persona.password === password
            );

            if (ciudadano) {
                guardarSesion({
                    nombre: ciudadano.nombre,
                    correo: ciudadano.correo,
                    rol: "ciudadano"
                });

                window.location.href = "ciudadano.html";
                return;
            }
        }

        mensaje.textContent = "Correo, contraseña o tipo de usuario incorrectos.";
    });
}