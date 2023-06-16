function mostrarContrasenna() {
    var contrasenna = document.getElementById('inputContrasennaNU');
    var iMostrarContrasenna = document.getElementById('iMostrarContrasennaNU');

    if (iMostrarContrasenna.checked) {
        contrasenna.type = 'text';
    } else {
        contrasenna.type = 'password';
    }
}