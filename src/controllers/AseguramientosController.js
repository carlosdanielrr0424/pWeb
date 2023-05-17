const express = require('express');
const router = express.Router();

const repository = require('../models/AseguramientosRepository');

router.get('/admin/aseguramientos', repository.actualizarVista);
router.get('/admin/aseguramientos/:nombre', repository.buscarAseguramientosPorNombre);
router.get('/admin/nuevoAseguramiento', repository.vistaNuevoAseguramiento);
router.post('/admin/nuevoAseguramiento', repository.nuevoAseguramiento);
router.get('/admin/eliminarAseguramiento/:id', repository.eliminarAseguramiento);
router.get('/admin/editarAseguramiento/:id', repository.buscarAseguramientoID);
router.post('/admin/editarAseguramiento/:id', repository.editarAseguramiento);

module.exports = router;