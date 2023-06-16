function mostrarContrasenna() {
    var contrasenna = document.getElementById('inputContrasennaEU');
    var iMostrarContrasenna = document.getElementById('iMostrarContrasennaEU');

    if (iMostrarContrasenna.checked) {
        contrasenna.type = 'text';
    } else {
        contrasenna.type = 'password';
    }
}