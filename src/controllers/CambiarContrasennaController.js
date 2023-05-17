const express = require('express');
const router = express.Router();

const repository = require('../models/CambiarContrasennaRepository');

router.get('/cambiarContrasenna', repository.vistaCambiarContrasenna);
router.post('/cambiarContrasenna', repository.comprobarContrasenna);

module.exports = router;