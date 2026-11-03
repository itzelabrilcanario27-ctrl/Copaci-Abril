
// SISTEMA DE GESTIÓN CIUDADANA - COPACI

// CUENTAS PREDETERMINADAS
const ADMIN_CORREO = "admin@copaci.com";
const ADMIN_PASSWORD = "Copaci2026*";

const COPACI_CORREO = "copaci@copaci.com";
const COPACI_PASSWORD = "Copaci2026*";

// FUNCIONES PARA LOCALSTORAGE

function obtenerDatos(clave) {
    return JSON.parse(localStorage.getItem(clave)) || [];
}

function guardarDatos(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}

function obtenerCiudadanos() {
    return obtenerDatos("ciudadanos");
}

function obtenerSesion() {
    return JSON.parse(localStorage.getItem("sesionCOPACI"));
}

function crearFolio(prefijo) {
    return prefijo + "-" + Date.now();
}

function escapar(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, caracter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caracter]);
}

// PROTECCIÓN DE PÁGINAS

function protegerPagina(rol) {
    const sesion = obtenerSesion();

    if (!sesion || sesion.rol !== rol) {
        alert("No tienes permiso para entrar a esta página.");
        location.href = "index.html";
        return false;
    }

    return true;
}

// REGISTRO DE CIUDADANOS

const registroForm = document.getElementById("registroForm");

if (registroForm) {
    registroForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const direccion = document.getElementById("direccion").value.trim();
        const correo = document.getElementById("correoRegistro").value.trim().toLowerCase();
        const password = document.getElementById("passwordRegistro").value;

        if (!nombre || !direccion || !correo || !password) {
            alert("Completa todos los campos.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            alert("Escribe un correo electrónico válido.");
            return;
        }

        if (password.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        const ciudadanos = obtenerCiudadanos();

        const existe = ciudadanos.some(usuario =>
            usuario.correo === correo
        );

        if (
            existe ||
            correo === ADMIN_CORREO ||
            correo === COPACI_CORREO
        ) {
            alert("Este correo ya está registrado.");
            return;
        }

        ciudadanos.push({
            nombre,
            direccion,
            correo,
            password,
            rol: "ciudadano"
        });

        guardarDatos("ciudadanos", ciudadanos);

        alert("¡Registro realizado correctamente!");
        registroForm.reset();
        location.href = "#inicio";
    });
}

// INICIO DE SESIÓN

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const tipoUsuario = document.getElementById("tipoUsuario").value;
        const correo = document.getElementById("correoLogin").value.trim().toLowerCase();
        const password = document.getElementById("passwordLogin").value;

        if (!tipoUsuario || !correo || !password) {
            alert("Completa todos los campos.");
            return;
        }

        // ADMINISTRADOR
        if (tipoUsuario === "administrador") {
            if (correo === ADMIN_CORREO && password === ADMIN_PASSWORD) {
                localStorage.setItem("sesionCOPACI", JSON.stringify({
                    correo,
                    rol: "administrador"
                }));

                location.href = "administrador.html";
            } else {
                alert("Datos de administrador incorrectos.");
            }
            return;
        }

        // COPACI
        if (tipoUsuario === "copaci") {
            if (correo === COPACI_CORREO && password === COPACI_PASSWORD) {
                localStorage.setItem("sesionCOPACI", JSON.stringify({
                    correo,
                    rol: "copaci"
                }));

                location.href = "Copaci.html";
            } else {
                alert("Datos de COPACI incorrectos.");
            }
            return;
        }

        // CIUDADANO
        if (tipoUsuario === "ciudadano") {
            const usuario = obtenerCiudadanos().find(persona =>
                persona.correo === correo &&
                persona.password === password
            );

            if (usuario) {
                localStorage.setItem("sesionCOPACI", JSON.stringify({
                    nombre: usuario.nombre,
                    correo: usuario.correo,
                    rol: "ciudadano"
                }));

                location.href = "ciudadano.html";
            } else {
                alert("Correo o contraseña incorrectos.");
            }
        }
    });
}

// CERRAR SESIÓN

const cerrarSesion = document.getElementById("cerrarSesion");

if (cerrarSesion) {
    cerrarSesion.addEventListener("click", function() {
        localStorage.removeItem("sesionCOPACI");
        location.href = "index.html";
    });
}

// PANEL DEL CIUDADANO

if (document.getElementById("constanciaForm")) {
    if (protegerPagina("ciudadano")) {
        const sesion = obtenerSesion();

        document.getElementById("bienvenidaCiudadano").textContent =
            "Bienvenido, " + sesion.nombre;

        // SOLICITAR CONSTANCIA
        const constanciaForm = document.getElementById("constanciaForm");

        constanciaForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const tipo = document.getElementById("tipoConstancia").value;
            const observaciones = document.getElementById("observacionesConstancia").value.trim();

            if (!tipo) {
                alert("Selecciona el tipo de constancia.");
                return;
            }

            const constancias = obtenerDatos("constancias");

            const nueva = {
                folio: crearFolio("CON"),
                nombre: sesion.nombre,
                correo: sesion.correo,
                tipo,
                observaciones,
                fecha: new Date().toLocaleDateString(),
                estado: "Pendiente"
            };

            constancias.push(nueva);
            guardarDatos("constancias", constancias);

            document.getElementById("comprobanteConstancia").innerHTML = `
                <h3>Comprobante de solicitud</h3>
                <p><strong>Folio:</strong> ${escapar(nueva.folio)}</p>
                <p><strong>Nombre:</strong> ${escapar(nueva.nombre)}</p>
                <p><strong>Constancia:</strong> ${escapar(nueva.tipo)}</p>
                <p><strong>Fecha:</strong> ${escapar(nueva.fecha)}</p>
                <p><strong>Estado:</strong> ${escapar(nueva.estado)}</p>
                <p>Espacio para sello y firma de COPACI.</p>
            `;

            alert("Solicitud registrada correctamente.");
            constanciaForm.reset();
            mostrarReportesCiudadano();
        });

        // REPORTAR LUMINARIA
        const luminariaForm = document.getElementById("reporteLuminariaForm");

        luminariaForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const ubicacion = document.getElementById("ubicacionLuminaria").value.trim();
            const entreCalles = document.getElementById("entreCalles").value.trim();
            const descripcion = document.getElementById("descripcionLuminaria").value.trim();

            if (!ubicacion || !entreCalles || !descripcion) {
                alert("Completa todos los campos.");
                return;
            }

            guardarReporte({
                tipo: "Luminaria",
                ubicacion,
                entreCalles,
                descripcion,
                nombre: sesion.nombre,
                correo: sesion.correo
            });

            luminariaForm.reset();
            alert("Reporte de luminaria registrado.");
            mostrarReportesCiudadano();
        });

        // REPORTAR BACHE
        const bacheForm = document.getElementById("reporteBacheoForm");

        bacheForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const ubicacion = document.getElementById("ubicacionBache").value.trim();
            const gravedad = document.getElementById("gravedadBache").value;
            const descripcion = document.getElementById("descripcionBache").value.trim();

            if (!ubicacion || !gravedad || !descripcion) {
                alert("Completa todos los campos.");
                return;
            }

            guardarReporte({
                tipo: "Bache",
                ubicacion,
                gravedad,
                descripcion,
                nombre: sesion.nombre,
                correo: sesion.correo
            });

            bacheForm.reset();
            alert("Reporte de bache registrado.");
            mostrarReportesCiudadano();
        });

        // MOSTRAR REPORTES DEL CIUDADANO
        mostrarReportesCiudadano();
        mostrarAvisos("listaAvisos");
    }
}

function guardarReporte(datos) {
    const reportes = obtenerDatos("reportes");

    reportes.push({
        folio: crearFolio("REP"),
        ...datos,
        fecha: new Date().toLocaleDateString(),
        estado: "Pendiente"
    });

    guardarDatos("reportes", reportes);
}

function mostrarReportesCiudadano() {
    const lista = document.getElementById("listaMisReportes");

    if (!lista) return;

    const sesion = obtenerSesion();

    const reportes = obtenerDatos("reportes").filter(reporte =>
        reporte.correo === sesion.correo
    );

    const constancias = obtenerDatos("constancias").filter(constancia =>
        constancia.correo === sesion.correo
    );

    lista.innerHTML = `
        <h3>Mis constancias</h3>
        ${constancias.map(c => `
            <p>Folio: ${escapar(c.folio)} | ${escapar(c.tipo)}
            | Estado: ${escapar(c.estado)}</p>
        `).join("") || "<p>No tienes constancias.</p>"}

        <h3>Mis reportes</h3>
        ${reportes.map(r => `
            <p>Folio: ${escapar(r.folio)} | ${escapar(r.tipo)}
            | Estado: ${escapar(r.estado)}</p>
        `).join("") || "<p>No tienes reportes.</p>"}
    `;
}

// PANEL DEL ADMINISTRADOR

if (document.getElementById("tablaUsuarios")) {
    if (protegerPagina("administrador")) {
        mostrarUsuarios();
        mostrarConstancias();
        mostrarReportesAdmin();
    }
}

function mostrarUsuarios() {
    const tabla = document.getElementById("tablaUsuarios");
    if (!tabla) return;

    const ciudadanos = obtenerCiudadanos();

    tabla.innerHTML = `
        <table>
            <tr><th>Nombre</th><th>Dirección</th><th>Correo</th></tr>
            ${ciudadanos.map(c => `
                <tr>
                    <td>${escapar(c.nombre)}</td>
                    <td>${escapar(c.direccion)}</td>
                    <td>${escapar(c.correo)}</td>
                </tr>
            `).join("")}
        </table>
    `;
}

function mostrarConstancias() {
    const tabla = document.getElementById("tablaConstancias");
    if (!tabla) return;

    const constancias = obtenerDatos("constancias");

    tabla.innerHTML = `
        <table>
            <tr>
                <th>Folio</th><th>Ciudadano</th><th>Tipo</th>
                <th>Estado</th><th>Acción</th>
            </tr>
            ${constancias.map((c, i) => `
                <tr>
                    <td>${escapar(c.folio)}</td>
                    <td>${escapar(c.nombre)}</td>
                    <td>${escapar(c.tipo)}</td>
                    <td>${escapar(c.estado)}</td>
                    <td>
                        <button onclick="cambiarEstadoConstancia(${i}, 'En revisión')">En revisión</button>
                        <button onclick="cambiarEstadoConstancia(${i}, 'Aprobada')">Aprobar</button>
                        <button onclick="cambiarEstadoConstancia(${i}, 'Rechazada')">Rechazar</button>
                    </td>
                </tr>
            `).join("")}
        </table>
    `;
}

function cambiarEstadoConstancia(indice, estado) {
    if (!protegerPagina("administrador")) return;

    const constancias = obtenerDatos("constancias");
    if (!constancias[indice]) return;

    constancias[indice].estado = estado;
    guardarDatos("constancias", constancias);
    mostrarConstancias();
}

function mostrarReportesAdmin() {
    const luminarias = document.getElementById("tablaLuminarias");
    const baches = document.getElementById("tablaBacheo");

    const reportes = obtenerDatos("reportes");

    function crearTabla(tipo) {
        return `
            <table>
                <tr>
                    <th>Folio</th><th>Ciudadano</th><th>Ubicación</th>
                    <th>Descripción</th><th>Estado</th><th>Acción</th>
                </tr>
                ${reportes.map((r, i) => ({...r, indice: i}))
                    .filter(r => r.tipo === tipo)
                    .map(r => `
                        <tr>
                            <td>${escapar(r.folio)}</td>
                            <td>${escapar(r.nombre)}</td>
                            <td>${escapar(r.ubicacion)}</td>
                            <td>${escapar(r.descripcion)}</td>
                            <td>${escapar(r.estado)}</td>
                            <td>
                                <button onclick="cambiarEstadoReporte(${r.indice}, 'En proceso')">En proceso</button>
                                <button onclick="cambiarEstadoReporte(${r.indice}, 'Atendido')">Atendido</button>
                            </td>
                        </tr>
                    `).join("")}
            </table>
        `;
    }

    if (luminarias) luminarias.innerHTML = crearTabla("Luminaria");
    if (baches) baches.innerHTML = crearTabla("Bache");
}

function cambiarEstadoReporte(indice, estado) {
    if (!protegerPagina("administrador")) return;

    const reportes = obtenerDatos("reportes");
    if (!reportes[indice]) return;

    reportes[indice].estado = estado;
    guardarDatos("reportes", reportes);
    mostrarReportesAdmin();
}

// PANEL COPACI

if (document.getElementById("tablaReportesCopaci")) {
    if (protegerPagina("copaci")) {
        mostrarReportesCopaci();
        mostrarEstadisticas();
        mostrarAvisos("listaAvisosCopaci");
    }
}

function mostrarReportesCopaci() {
    const tabla = document.getElementById("tablaReportesCopaci");
    if (!tabla) return;

    const reportes = obtenerDatos("reportes");

    tabla.innerHTML = `
        <table>
            <tr><th>Folio</th><th>Tipo</th><th>Ubicación</th><th>Estado</th></tr>
            ${reportes.map(r => `
                <tr>
                    <td>${escapar(r.folio)}</td>
                    <td>${escapar(r.tipo)}</td>
                    <td>${escapar(r.ubicacion)}</td>
                    <td>${escapar(r.estado)}</td>
                </tr>
            `).join("")}
        </table>
    `;

    const seguimiento = document.getElementById("tablaSeguimientoCopaci");
    if (seguimiento) seguimiento.innerHTML = tabla.innerHTML;
}

function mostrarEstadisticas() {
    const reportes = obtenerDatos("reportes");

    const total = document.getElementById("totalReportes");
    const pendientes = document.getElementById("reportesPendientes");
    const atendidos = document.getElementById("reportesAtendidos");

    if (total) total.textContent = reportes.length;
    if (pendientes) pendientes.textContent =
        reportes.filter(r => r.estado === "Pendiente").length;
    if (atendidos) atendidos.textContent =
        reportes.filter(r => r.estado === "Atendido").length;
}

// PUBLICAR AVISOS

const avisoForm = document.getElementById("avisoForm");

if (avisoForm) {
    if (protegerPagina("copaci")) {
        avisoForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const titulo = document.getElementById("tituloAviso").value.trim();
            const descripcion = document.getElementById("descripcionAviso").value.trim();

            if (!titulo || !descripcion) {
                alert("Completa todos los campos.");
                return;
            }

            const avisos = obtenerDatos("avisos");

            avisos.push({
                titulo,
                descripcion,
                fecha: new Date().toLocaleDateString()
            });

            guardarDatos("avisos", avisos);

            avisoForm.reset();
            mostrarAvisos("listaAvisosCopaci");
            alert("Aviso publicado correctamente.");
        });
    }
}

function mostrarAvisos(id) {
    const contenedor = document.getElementById(id);
    if (!contenedor) return;

    const avisos = obtenerDatos("avisos");

    contenedor.innerHTML = avisos.map(aviso => `
        <article>
            <h3>${escapar(aviso.titulo)}</h3>
            <p>${escapar(aviso.descripcion)}</p>
            <small>${escapar(aviso.fecha)}</small>
        </article>
    `).join("") || "<p>No hay avisos publicados.</p>";
}
