// PROTEGER PANEL ADMINISTRADOR

if (document.getElementById("tablaUsuarios") && protegerPagina("administrador")) {
    mostrarUsuarios();
    mostrarConstancias();
    mostrarReportesAdmin();
}

// MOSTRAR USUARIOS

function mostrarUsuarios() {
    const contenedor = document.getElementById("tablaUsuarios");

    if (!contenedor) return;

    const ciudadanos = obtenerCiudadanos();

    if (ciudadanos.length === 0) {
        contenedor.innerHTML = "<p class='mensaje-vacio'>No hay ciudadanos registrados.</p>";
        return;
    }

    contenedor.innerHTML = `
        <div class="tabla-contenedor">
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Correo</th>
                    </tr>
                </thead>
                <tbody>
                    ${ciudadanos.map(persona => `
                        <tr>
                            <td>${escapar(persona.nombre)}</td>
                            <td>${escapar(persona.direccion)}</td>
                            <td>${escapar(persona.correo)}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

// MOSTRAR CONSTANCIAS

function mostrarConstancias() {
    const contenedor = document.getElementById("tablaConstancias");

    if (!contenedor) return;

    const constancias = obtenerDatos("constancias");

    if (constancias.length === 0) {
        contenedor.innerHTML = "<p class='mensaje-vacio'>No hay constancias registradas.</p>";
        return;
    }

    contenedor.innerHTML = `
        <div class="tabla-contenedor">
            <table>
                <thead>
                    <tr>
                        <th>Folio</th>
                        <th>Ciudadano</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${constancias.map((item, indice) => `
                        <tr>
                            <td>${escapar(item.folio)}</td>
                            <td>${escapar(item.nombre)}</td>
                            <td>${escapar(item.tipo)}</td>
                            <td><span class="estado">${escapar(item.estado)}</span></td>
                            <td>
                                <div class="botones-acciones">
                                    <button class="btn-ver" data-constancia="${indice}" data-estado="En revisión">Revisar</button>
                                    <button class="btn-editar" data-constancia="${indice}" data-estado="Aprobada">Aprobar</button>
                                    <button class="btn-eliminar" data-constancia="${indice}" data-estado="Rechazada">Rechazar</button>
                                </div>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

// CAMBIAR ESTADO DE CONSTANCIAS

function cambiarEstadoConstancia(indice, estado) {
    if (!protegerPagina("administrador")) return;

    const constancias = obtenerDatos("constancias");

    if (!constancias[indice]) return;

    constancias[indice].estado = estado;

    guardarDatos("constancias", constancias);
    mostrarConstancias();
}

// MOSTRAR REPORTES

function mostrarReportesAdmin() {
    mostrarTablaReportes("Luminaria", "tablaLuminarias");
    mostrarTablaReportes("Bacheo", "tablaBacheo");
}

function mostrarTablaReportes(tipo, id) {
    const contenedor = document.getElementById(id);

    if (!contenedor) return;

    const reportes = obtenerDatos("reportes");
    const filtrados = reportes
        .map((item, indice) => ({ ...item, indiceOriginal: indice }))
        .filter(item => item.tipo === tipo);

    if (filtrados.length === 0) {
        contenedor.innerHTML = "<p class='mensaje-vacio'>No hay reportes registrados.</p>";
        return;
    }

    contenedor.innerHTML = `
        <div class="tabla-contenedor">
            <table>
                <thead>
                    <tr>
                        <th>Folio</th>
                        <th>Ciudadano</th>
                        <th>Ubicación</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${filtrados.map(item => `
                        <tr>
                            <td>${escapar(item.folio)}</td>
                            <td>${escapar(item.nombre)}</td>
                            <td>${escapar(item.ubicacion)}</td>
                            <td>${escapar(item.descripcion)}</td>
                            <td><span class="estado">${escapar(item.estado)}</span></td>
                            <td>
                                <div class="botones-acciones">
                                    <button class="btn-ver" data-reporte="${item.indiceOriginal}" data-estado="En proceso">En proceso</button>
                                    <button class="btn-editar" data-reporte="${item.indiceOriginal}" data-estado="Atendido">Atendido</button>
                                </div>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

// CAMBIAR ESTADO DE REPORTES

function cambiarEstadoReporte(indice, estado) {
    if (!protegerPagina("administrador")) return;

    const reportes = obtenerDatos("reportes");

    if (!reportes[indice]) return;

    reportes[indice].estado = estado;

    guardarDatos("reportes", reportes);
    mostrarReportesAdmin();
}

// EVENTOS DE BOTONES DE TABLAS

document.addEventListener("click", function (evento) {
    const botonConstancia = evento.target.closest("[data-constancia]");

    if (botonConstancia) {
        cambiarEstadoConstancia(
            Number(botonConstancia.dataset.constancia),
            botonConstancia.dataset.estado
        );
    }

    const botonReporte = evento.target.closest("[data-reporte]");

    if (botonReporte) {
        cambiarEstadoReporte(
            Number(botonReporte.dataset.reporte),
            botonReporte.dataset.estado
        );
    }
});