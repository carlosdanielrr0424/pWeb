var nuevaContrasenna = document.getElementById("inputNuevaContrasennaCC");
var confirmarContrasenna = document.getElementById("inputConfirmarContrasennaCC");

function chequearConfirmacionContrasenna() {
    if (nuevaContrasenna.value !== confirmarContrasenna.value) {
        confirmarContrasenna.setCustomValidity("Confirme correctamente la contraseña");
    } else {
        confirmarContrasenna.setCustomValidity("");
    }
}

nuevaContrasenna.addEventListener("input", chequearConfirmacionContrasenna);
  confirmarContrasenna.addEventListener("input", chequearConfirmacionContrasenna);

function mostrarContrasennas() {
    var contrasennaActual = document.getElementById('inputContrasennaActualCC');
    var nuevaContrasenna = document.getElementById('inputNuevaContrasennaCC');
    var confirmarContrasenna = document.getElementById('inputConfirmarContrasennaCC');
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