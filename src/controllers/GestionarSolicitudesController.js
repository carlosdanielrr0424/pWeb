const express = require('express');
const router = express.Router();

const repository = require('../models/GestionarSolicitudesRepository');

router.get('/areaManager/solicitudes', repository.actualizarVista);
router.get('/areaManager/solicitudes/:nombre', repository.buscarSolicitudesPorNombre);
router.get('/areaManager/nuevaSolicitud', repository.vistaNuevaSolicitud);
router.post('/areaManager/nuevaSolicitud', repository.nuevaSolicitud);
router.get('/areaManager/agregarAseguramientoSolicitud/:solicitud_id', repository.vistaNuevoAseguramientoSolicitud);
router.post('/areaManager/agregarAseguramientoSolicitud/:solicitud_id', repository.nuevoAseguramientoSolicitud);
router.get('/areaManager/editarAseguramientoSolicitud/:solicitud_id/:aseguramiento_id', repository.buscarAseguramientoSolicitudData);
router.post('/areaManager/editarAseguramientoSolicitud/:solicitud_id', repository.editarAseguramientoSolicitud);
router.get('/areaManager/eliminarAseguramientoSolicitud/:solicitud_id/:aseguramiento_id', repository.eliminarAseguramientoSolicitud);
router.get('/areaManager/editarSolicitud/:id', repository.buscarSolicitudID);
router.post('/areaManager/editarSolicitud/:id', repository.editarSolicitud);
router.get('/areaManager/eliminarSolicitud/:id', repository.eliminarSolicitud);

module.exports = router;