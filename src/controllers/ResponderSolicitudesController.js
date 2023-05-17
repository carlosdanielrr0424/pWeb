const express = require('express');
const router = express.Router();

const repository = require('../models/ResponderSolicitudesRepository');

router.get('/admin/responderSolicitudes', repository.actualizarVista);
router.get('/admin/responderSolicitudes/:nombre', repository.buscarSolicitudesPendientesPorNombre)
router.get('/admin/aprobarSolicitud/:id', repository.aprobarSolicitud);
router.get('/admin/denegarSolicitud/:id', repository.denegarSolicitud);

module.exports = router;