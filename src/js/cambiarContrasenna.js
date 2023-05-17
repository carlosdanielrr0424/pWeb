var nuevaContrasenna = document.getElementById("nuevaContrasenna");
var confirmarContrasenna = document.getElementById("confirmarContrasenna");

function validarContrasennas() {
    if (nuevaContrasenna.value !== confirmarContrasenna.value) {
        confirmarContrasenna.setCustomValidity("Las contraseñas no coinciden");
    } else {
        confirmarContrasenna.setCustomValidity("");
    }
}

nuevaContrasenna.addEventListener("input", validarContrasennas);
  confirmarContrasenna.addEventListener("input", validarContrasennas);

function mostrarContrasennas() {
    var contrasennaActual = document.getElementById('contrasennaActual');
    var nuevaContrasenna = document.getElementById('nuevaContrasenna');
    var confirmarContrasenna = document.getElementById('confirmarContrasenna');
    var iMostrarContrasennas = document.getElementById('iMostrarContrasennas');

    if (iMostrarContrasennas.checked) {
        contrasennaActual.type = 'text';
        nuevaContrasenna.type = 'text';
        confirmarContrasenna.type = 'text';
    } else {
        contrasennaActual.type = 'password';
        nuevaContrasenna.type = 'password';
        confirmarContrasenna.type = 'password';
    }
}