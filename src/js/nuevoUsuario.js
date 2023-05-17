function mostrarContrasenna() {
    var contrasenna = document.getElementById('contrasenna');
    var iMostrarContrasenna = document.getElementById('iMostrarContrasenna');

    if (iMostrarContrasenna.checked) {
        contrasenna.type = 'text';
    } else {
        contrasenna.type = 'password';
    }
}