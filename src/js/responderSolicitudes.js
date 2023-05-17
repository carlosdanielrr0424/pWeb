function buscarSolicitudPorNombre() {
    const nombre = document.getElementById('inputBuscarSolicitudesPendientes').value;
    
    window.location.href = '/admin/responderSolicitudes/' + nombre;
}

function mostrarConfirmacionAprobar(mensaje, id){
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
        window.location = '/admin/aprobarSolicitud/' + id;
      }else if(result.dismiss === Swal.DismissReason.cancel){
        window.location = '/admin/responderSolicitudes';
      }
    });
  }

  function mostrarConfirmacionDenegar(mensaje, id){
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
        window.location = '/admin/denegarSolicitud/' + id;
      }else if(result.dismiss === Swal.DismissReason.cancel){
        window.location = '/admin/responderSolicitudes';
      }
    });
  }