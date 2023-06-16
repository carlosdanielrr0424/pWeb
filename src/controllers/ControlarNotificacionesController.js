const express = require('express');
const router = express.Router();

const repository = require('../models/ControlarNotificacionesRepository');

router.get('/areaManager/notificaciones', repository.actualizarVista);
router.get('/areaManager/eliminarNotificacion/:id', repository.eliminarNotificacion);

module.exports = router;

