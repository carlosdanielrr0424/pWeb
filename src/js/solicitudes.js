function buscarSolicitudesPorNombre() {
  const nombre = document.getElementById('inputBuscarSolicitudes').value;
    
    window.location.href = '/areaManager/solicitudes/' + nombre;  
}

function mostrarConfirmacionEliminarAseguramientoSolicitud(mensaje, solicitud_id, aseguramiento_id){
  Swal.fire({
    title: mensaje,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColot: '#d33',
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then((result)=>{
    if(result.isConfirmed){
      window.location = '/areaManager/eliminarAseguramientoSolicitud/' + solicitud_id + '/' + aseguramiento_id;
    }else if(result.dismiss === Swal.DismissReason.cancel){
      window.location = '/areaManager/solicitudes/';
    }
  }); 
}

function mostrarConfirmacionEliminarSolicitud(mensaje, id){
  Swal.fire({
    title: mensaje,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColot: '#d33',
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then((result)=>{
    if(result.isConfirmed){
      window.location = '/areaManager/eliminarSolicitud/' + id;
    }else if(result.dismiss === Swal.DismissReason.cancel){
      window.location = '/areaManager/solicitudes/';
    }
  }); 
}