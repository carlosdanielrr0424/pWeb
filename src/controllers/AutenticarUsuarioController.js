const express = require('express');
const router = express.Router();

const repository = require('../models/AutenticarUsuarioRepository');

router.get('/', repository.vistaAutenticarUsuario);
router.post('/iniciarSesion', repository.iniciarSesion);
router.get('/cerrarSesion', repository.cerrarSesion);
router.get('/pantallaGenerica', repository.vistaPantallaGenerica);

module.exports = router;