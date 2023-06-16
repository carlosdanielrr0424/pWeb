function exportarReporte(){
    //Obtener el contenido del div del reporte
    var contenidoDiv = document.getElementById("divReporte").innerHTML;

    var ventanaEmergente = window.open('', 'Exportar reporte', 'height=500, width=500');
    ventanaEmergente.document.write('<html><head><title>Exportar reporte</title></head><body>' + contenidoDiv + '</body><html>');
    ventanaEmergente.document.close();
    ventanaEmergente.focus();
    ventanaEmergente.print();
    ventanaEmergente.close();
}