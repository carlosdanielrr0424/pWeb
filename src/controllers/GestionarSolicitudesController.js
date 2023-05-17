const express = require('express');
const router = express.Router();

const repository = require('../models/GestionarSolicitudesRepository');

router.get('/areaManager/solicitudes', repository.actualizarVista);
router.get('/areaManager/solicitudes/:nombre', repository.buscarSolicitudesPorNombre);
router.get('/areaManager/nuevaSolicitud', repository.vistaNuevaSolicitud);

router.get('/areaManager/eliminarSolicitud/:id', repository.eliminarSolicitud);

module.exports = router;