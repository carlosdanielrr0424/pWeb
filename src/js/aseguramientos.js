function buscarAseguramientosPorNombre() {
    const nombre = document.getElementById('inputBuscarAseguramientos').value;
    
    window.location.href = '/admin/aseguramientos/' + nombre;
}

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
        window.location = '/admin/eliminarAseguramiento/' + id;
      }else if(result.dismiss === Swal.DismissReason.cancel){
        window.location = '/admin/aseguramientos';
      }
    });
  }