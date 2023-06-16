const express = require('express');
const router = express.Router();

const repository = require('../models/GestionarUsuariosRepository');

router.get('/admin/usuarios', repository.actualizarVista);
router.get('/admin/usuarios/:nombre', repository.buscarUsuariosPorNombre);
router.get('/admin/nuevoUsuario', repository.vistaNuevoUsuario);
router.post('/admin/nuevoUsuario', repository.nuevoUsuario);
router.get('/admin/eliminarUsuario/:id', repository.eliminarUsuario);
router.get('/admin/editarUsuario/:id', repository.buscarUsuarioID);
router.post('/admin/editarUsuario/:id', repository.editarUsuario);

module.exports = router;