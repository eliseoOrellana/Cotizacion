document.addEventListener("DOMContentLoaded", function () {
    // Obtener el botón para agregar detalle de producto y agregarle un evento
    const agregarDetalleBtn = document.getElementById("agregarDetalleBtn");
    agregarDetalleBtn.addEventListener("click", agregarDetalle);

    // Obtener el botón para agregar detalle de servicio y agregarle un evento
    const agregarServicioBtn = document.getElementById("agregarServicioBtn");
    agregarServicioBtn.addEventListener("click", agregarServicio);

    // Obtener el botón para generar y descargar el PDF y agregarle un evento
    const guardarPDFBtn = document.getElementById("guardarPDFBtn");
    guardarPDFBtn.addEventListener("click", 

    function () {
        generarYDescargarPDF();
        limpiarPantalla();
    });
    
    
});

function agregarDetalle() {
    const productoInput = document.getElementById("productoInput");
    const cantidad = document.getElementById("cantidad");
    const valorUnitario = document.getElementById("valorUnitario");
    const cotizacionTableBody = document.getElementById("cotizacionTableBody");

    const cantidadValue = parseInt(cantidad.value);
    const valorUnitarioValue = parseFloat(valorUnitario.value.replace(/\$/, ''));

    if (productoInput.value.trim() !== "" && cantidadValue > 0 && !isNaN(cantidadValue) && !isNaN(valorUnitarioValue)) {
        const subtotal = cantidadValue * valorUnitarioValue;

        const newRow = cotizacionTableBody.insertRow();
        newRow.innerHTML = `
            <td>${cotizacionTableBody.rows.length}</td>
            <td>${productoInput.value}</td>
            <td>${cantidadValue}</td>
            <td>$${valorUnitarioValue.toFixed(2)}</td>
            <td>$${subtotal.toFixed(2)}</td>
            <td><button class="btn btn-danger" onclick="eliminarFila(this)">Eliminar</button></td>
        `;

        calcularTotales();

        productoInput.value = "";
        cantidad.value = "";
        valorUnitario.value = "";
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, complete todos los campos correctamente.'
        });
    }
}

function agregarServicio() {
    const servicioInput = document.getElementById("servicioInput");
    const cantidadServicio = document.getElementById("cantidadServicio");
    const valorUnitarioServicio = document.getElementById("valorUnitarioServicio");
    const cotizacionTableBody = document.getElementById("cotizacionTableBody");

    const cantidadServicioValue = parseInt(cantidadServicio.value);
    const valorUnitarioServicioValue = parseFloat(valorUnitarioServicio.value.replace(/\$/, ''));

    if (servicioInput.value.trim() !== "" && cantidadServicioValue > 0 && !isNaN(cantidadServicioValue) && !isNaN(valorUnitarioServicioValue)) {
        const subtotalServicio = cantidadServicioValue * valorUnitarioServicioValue;

        const newRow = cotizacionTableBody.insertRow();
        newRow.innerHTML = `
            <td>${cotizacionTableBody.rows.length}</td>
            <td>${servicioInput.value}</td>
            <td>${cantidadServicioValue}</td>
            <td>$${valorUnitarioServicioValue.toFixed(2)}</td>
            <td>$${subtotalServicio.toFixed(2)}</td>
            <td><button class="btn btn-danger" onclick="eliminarFila(this)">Eliminar</button></td>
        `;

        calcularTotales();

        servicioInput.value = "";
        cantidadServicio.value = "";
        valorUnitarioServicio.value = "";
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, complete todos los campos correctamente.'
        });
    }
}

function calcularTotales() {
    const cotizacionTableBody = document.getElementById("cotizacionTableBody");
    const totalSinIva = document.getElementById("totalSinIva");
    const totalConIva = document.getElementById("totalConIva");

    let subtotalSinIva = 0;
    let subtotalConIva = 0;

    for (let i = 0; i < cotizacionTableBody.rows.length; i++) {
        const row = cotizacionTableBody.rows[i];
        const subtotal = parseFloat(row.cells[4].innerText.replace(/\$/, ''));

        subtotalSinIva += subtotal;
        subtotalConIva += subtotal;
    }

    const iva = subtotalSinIva * 0.19; // 19% de IVA
    subtotalConIva += iva;

    totalSinIva.innerText = `$${subtotalSinIva.toFixed(2)}`;
    totalConIva.innerText = `$${subtotalConIva.toFixed(2)}`;
}

function eliminarFila(button) {
    const row = button.closest('tr');
    const cotizacionTableBody = document.getElementById("cotizacionTableBody");

    if (cotizacionTableBody.rows.length > 1) {
        const index = row.rowIndex - 1; // Resta 1 para ajustar el índice del array
        row.remove();
        calcularTotales();
    }
}

function generarYDescargarPDF() {
    const pdf = new jsPDF();
    const empresa = "Empresa Eléctricas TCE";
    const telefono = "Celular: +569 94194876";
    const direccion = "Gregario Urrutia 027, Curacautín";
    const cliente = document.getElementById("clienteInput").value;
    const proyecto = document.getElementById("nombreProyecto").value;
    const titulo = "Cotización de Instalación Eléctrica";
    let yPos = 20;

    pdf.setFontSize(16);
    pdf.text(titulo, 105, yPos, { align: "center" });
    yPos += 20;

    pdf.setFontSize(12);

    pdf.setFontStyle("bold");
    pdf.text(empresa, 10, yPos);
    yPos += 10;
    pdf.text(telefono, 10, yPos);
    yPos += 10;
    pdf.text(direccion, 10, yPos);
    yPos += 10;

    pdf.setFontSize(12);
    pdf.setFontStyle("normal");

    pdf.text(`Estimado ${cliente}, de mi consideración, envío a usted los valores y detalles de `, 10, yPos);
    yPos += 10;
    pdf.text(`costos de instalación eléctrica para el proyecto "${proyecto}".`, 10, yPos);
    yPos += 20;

    const tableHeaders = ["#", "Descripción", "Cantidad", "Valor Unitario", "Subtotal"];
    const tableData = [];
    const tablaCotizacion = document.getElementById("cotizacionTableBody");
    const filas = tablaCotizacion.querySelectorAll("tr");

    filas.forEach((fila) => {
        const detalle = [];
        const columnas = fila.querySelectorAll("td");
        columnas.forEach((columna, index) => {
            // Excluye la columna "Eliminar" (columna 5)
            if (index !== 5) {
                detalle.push(columna.innerText);
            }
        });
        tableData.push(detalle);
    });

    const totalSinIva = document.getElementById("totalSinIva").innerText;
    const totalConIva = document.getElementById("totalConIva").innerText;

    tableData.push(["", "", "", { content: "Total sin IVA:", styles: { fontStyle: 'bold' } }, { content: totalSinIva, styles: { fontStyle: 'bold' } }]);
    tableData.push(["", "", "", { content: "Total con IVA:", styles: { fontStyle: 'bold' } }, { content: totalConIva, styles: { fontStyle: 'bold' } }]);

    pdf.autoTable({
        startY: yPos,
        head: [tableHeaders],
        body: tableData,
    });

    const comentarios = document.getElementById("condicionesPago").value;

    if (comentarios) {
        yPos = pdf.autoTable.previous.finalY + 20;
        pdf.text("Condiciones de pago:", 10, yPos);
        yPos += 10;
        pdf.text(comentarios, 10, yPos);
    }

    const fecha = new Date();
    const nombrePDF = `Cotizacion_${fecha.getFullYear()}${fecha.getMonth() + 1}${fecha.getDate()}_${fecha.getTime()}.pdf`;

    fecha.setDate(fecha.getDate() + 15); // Suma 15 días a la fecha actual
    const footerMessage = `La validez de este documento es de 15 días una vez emitido. Válido hasta: ${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

    pdf.setFontSize(10);
    const pageHeight = pdf.internal.pageSize.height;
    const verticalPosition = pageHeight - 10;

    pdf.text(footerMessage, 105, verticalPosition, { align: 'center' });

    pdf.save(nombrePDF);
    Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'El PDF se ha guardado correctamente como ' + nombrePDF + '.'
    });
}


function limpiarPantalla() {
    // Restablecer valores de campos de entrada
    document.getElementById("clienteInput").value = "";
    document.getElementById("nombreProyecto").value = "";
    document.getElementById("productoInput").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("valorUnitario").value = "";
    document.getElementById("servicioInput").value = "";
    document.getElementById("cantidadServicio").value = "";
    document.getElementById("valorUnitarioServicio").value = "";
    document.getElementById("condicionesPago").value = "";

    // Eliminar filas de la tabla de cotización
    const cotizacionTableBody = document.getElementById("cotizacionTableBody");
    cotizacionTableBody.innerHTML = "";


// Establecer el subtotal en cero
const totalSinIva = document.getElementById("totalSinIva");
const totalConIva = document.getElementById("totalConIva");
totalSinIva.innerText = "$0.00";
totalConIva.innerText = "$0.00";


}