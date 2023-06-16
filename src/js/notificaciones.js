function mostrarConfirmacionEliminar(mensaje, id){
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
        window.location = '/areaManager/eliminarNotificacion/' + id;
      }else if(result.dismiss === Swal.DismissReason.cancel){
        window.location = '/areaManager/notificaciones';
      }
    });
  }