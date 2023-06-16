$(document).ready(function () {
    const inputFechaHora = document.getElementById("inputFechaHoraES");
    const spanFechaHora = document.getElementById("spanFechaHoraES");

    // Inicializa flatpickr en el botón
    const datetimePicker = flatpickr(spanFechaHora, {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
      onClose: function(selectedDates, dateStr, instance) {
        // Actualiza el valor del input cuando se cierra el selector
        inputFechaHora.value = dateStr;
      }
    });

    // Muestra el selector cuando se hace clic en el botón
    spanFechaHora.addEventListener("click", function() {
      datetimePicker.open();
    });


});