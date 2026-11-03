// COMPROBAR ACCESO CIUDADANO

const formularioConstancia = document.getElementById("constanciaForm");

if (formularioConstancia && protegerPagina("ciudadano")) {

    const sesion = obtenerSesion();

    document.getElementById("bienvenidaCiudadano").textContent =
        "Bienvenido/a, " + sesion.nombre;

    // REGISTRAR CONSTANCIA

    formularioConstancia.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const tipo = document.getElementById("tipoConstancia").value;
        const observaciones = document.getElementById("observacionesConstancia").value.trim();

        const constancias = obtenerDatos("constancias");

        const nueva = {
            folio: crearFolio("CON-"),
            nombre: sesion.nombre,
            correo: sesion.correo,
            tipo: tipo,
            observaciones: observaciones,
            fecha: new Date().toLocaleDateString("es-MX"),
            estado: "Pendiente"
        };

        constancias.push(nueva);
        guardarDatos("constancias", constancias);

        document.getElementById("comprobanteConstancia").innerHTML = `
            <article class="comprobante">
                <h3>Comprobante de solicitud</h3>
                <p><strong>Folio:</strong> ${escapar(nueva.folio)}</p>
                <p><strong>Tipo:</strong> ${escapar(tipo)}</p>
                <p><strong>Fecha:</strong> ${escapar(nueva.fecha)}</p>
                <p><strong>Estado:</strong> Pendiente</p>
            </article>
        `;

        formularioConstancia.reset();
        mostrarReportesCiudadano();
    });

    // MOSTRAR REPORTES Y CONSTANCIAS

    mostrarReportesCiudadano();
    mostrarAvisos("listaAvisos");
}

// REGISTRAR REPORTES

function guardarReporte(tipo, ubicacion, descripcion, extra = {}) {
    const sesion = obtenerSesion();

    if (!sesion || sesion.rol !== "ciudadano") {
        return;
    }

    const reportes = obtenerDatos("reportes");

    reportes.push({
        folio: crearFolio("REP-"),
        nombre: sesion.nombre,
        correo: sesion.correo,
        tipo: tipo,
        ubicacion: ubicacion,
        descripcion: descripcion,
        fecha: new Date().toLocaleDateString("es-MX"),
        estado: "Pendiente",
        ...extra
    });

    guardarDatos("reportes", reportes);
    mostrarReportesCiudadano();
}

// REPORTE DE LUMINARIAS

const formularioLuminaria = document.getElementById("reporteLuminariaForm");

if (formularioLuminaria) {
    formularioLuminaria.addEventListener("submit", function (evento) {
        evento.preventDefault();

        guardarReporte(
            "Luminaria",
            document.getElementById("ubicacionLuminaria").value.trim(),
            document.getElementById("descripcionLuminaria").value.trim(),
            {
                entreCalles: document.getElementById("entreCalles").value.trim()
            }
        );

        formularioLuminaria.reset();
        alert("Reporte de luminaria registrado correctamente.");
    });
}

// REPORTE DE BACHEO

const formularioBache = document.getElementById("reporteBacheoForm");

if (formularioBache) {
    formularioBache.addEventListener("submit", function (evento) {
        evento.preventDefault();

        guardarReporte(
            "Bacheo",
            document.getElementById("ubicacionBache").value.trim(),
            document.getElementById("descripcionBache").value.trim(),
            {
                gravedad: document.getElementById("gravedadBache").value
            }
        );

        formularioBache.reset();
        alert("Reporte de bacheo registrado correctamente.");
    });
}

// MOSTRAR SOLICITUDES DEL CIUDADANO

function mostrarReportesCiudadano() {
    const contenedor = document.getElementById("listaMisReportes");

    if (!contenedor) return;

    const sesion = obtenerSesion();

    if (!sesion || sesion.rol !== "ciudadano") return;

    const reportes = obtenerDatos("reportes").filter(
        reporte => reporte.correo === sesion.correo
    );

    const constancias = obtenerDatos("constancias").filter(
        solicitud => solicitud.correo === sesion.correo
    );

    const solicitudes = [
        ...reportes.map(item => ({
            folio: item.folio,
            tipo: item.tipo,
            fecha: item.fecha,
            estado: item.estado
        })),
        ...constancias.map(item => ({
            folio: item.folio,
            tipo: "Constancia: " + item.tipo,
            fecha: item.fecha,
            estado: item.estado
        }))
    ];

    if (solicitudes.length === 0) {
        contenedor.innerHTML = "<p class='mensaje-vacio'>Todavía no tienes solicitudes registradas.</p>";
        return;
    }

    contenedor.innerHTML = `
        <div class="tabla-contenedor">
            <table>
                <thead>
                    <tr>
                        <th>Folio</th>
                        <th>Tipo</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${solicitudes.map(item => `
                        <tr>
                            <td>${escapar(item.folio)}</td>
                            <td>${escapar(item.tipo)}</td>
                            <td>${escapar(item.fecha)}</td>
                            <td><span class="estado">${escapar(item.estado)}</span></td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

// MOSTRAR AVISOS

function mostrarAvisos(id) {
    const contenedor = document.getElementById(id);

    if (!contenedor) return;

    const avisos = obtenerDatos("avisos");

    if (avisos.length === 0) {
        contenedor.innerHTML = "<p class='mensaje-vacio'>No hay avisos publicados.</p>";
        return;
    }

    contenedor.innerHTML = avisos.slice().reverse().map(aviso => `
        <article class="tarjeta aviso">
            <h3>${escapar(aviso.titulo)}</h3>
            <p>${escapar(aviso.descripcion)}</p>
            <small>Publicado: ${escapar(aviso.fecha)}</small>
        </article>
    `).join("");
}