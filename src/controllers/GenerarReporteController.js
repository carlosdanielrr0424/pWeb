const express = require('express');
const router = express.Router();

const repository = require('../models/GenerarReporteRepository');

router.get('/admin/generarReporte', repository.actualizarVista);
router.post('/admin/generarReporte', repository.generarReporte);

module.exports = router;