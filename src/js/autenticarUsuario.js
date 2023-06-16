function alerta () {
    Swal.fire({
        title: '<%= tituloAlerta %>',
        icon: '<%= iconoAlerta %>',
        showConfirmButton: true,
        timer: 2500
      }).then(()=>{
        window.location = '<%= rutaAlerta %>';
      })
}