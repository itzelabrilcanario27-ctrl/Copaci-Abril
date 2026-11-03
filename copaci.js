// PROTEGER PANEL COPACI

if (document.getElementById("tablaReportesCopaci") && protegerPagina("copaci")) {
    mostrarReportesCopaci();
    mostrarEstadisticas();
    mostrarAvisos("listaAvisosCopaci");
}

// MOSTRAR REPORTES Y SEGUIMIENTO

function mostrarReportesCopaci() {
    const reportes = obtenerDatos("reportes");

    const contenido = reportes.length === 0
        ? "<p class='mensaje-vacio'>No hay reportes registrados.</p>"
        : `
        <div class="tabla-contenedor">
            <table>
                <thead>
                    <tr>
                        <th>Folio</th>
                        <th>Tipo</th>
                        <th>Ubicación</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportes.map(item => `
                        <tr>
                            <td>${escapar(item.folio)}</td>
                            <td>${escapar(item.tipo)}</td>
                            <td>${escapar(item.ubicacion)}</td>
                            <td>${escapar(item.fecha)}</td>
                            <td><span class="estado">${escapar(item.estado)}</span></td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;

    const tablaReportes = document.getElementById("tablaReportesCopaci");
    const tablaSeguimiento = document.getElementById("tablaSeguimientoCopaci");

    if (tablaReportes) tablaReportes.innerHTML = contenido;
    if (tablaSeguimiento) tablaSeguimiento.innerHTML = contenido;
}

// ESTADÍSTICAS

function mostrarEstadisticas() {
    const reportes = obtenerDatos("reportes");

    const total = reportes.length;

    const pendientes = reportes.filter(
        item => item.estado === "Pendiente" || item.estado === "En proceso"
    ).length;

    const atendidos = reportes.filter(
        item => item.estado === "Atendido"
    ).length;

    document.getElementById("totalReportes").textContent = total;
    document.getElementById("reportesPendientes").textContent = pendientes;
    document.getElementById("reportesAtendidos").textContent = atendidos;
}

// PUBLICAR AVISOS

const formularioAviso = document.getElementById("avisoForm");

if (formularioAviso && protegerPagina("copaci")) {
    formularioAviso.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const titulo = document.getElementById("tituloAviso").value.trim();
        const descripcion = document.getElementById("descripcionAviso").value.trim();

        const avisos = obtenerDatos("avisos");

        avisos.push({
            titulo: titulo,
            descripcion: descripcion,
            fecha: new Date().toLocaleDateString("es-MX")
        });

        guardarDatos("avisos", avisos);

        formularioAviso.reset();
        mostrarAvisos("listaAvisosCopaci");

        alert("Aviso publicado correctamente.");
    });
}