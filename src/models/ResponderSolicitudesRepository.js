const strftime = require('strftime');
const Solicitud = require('./dataClass/Solicitud');

const repositorio = {};

repositorio.actualizarVista = (req, res) => {
    if(req.session.autenticado && req.session.usuario.rol == 'admin'){
        req.getConnection((error, connection) =>{
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('SELECT solic.id, solic.nombre, solic.lugar, solic.fecha_hora, solic.estado, GROUP_CONCAT(CONCAT(aseg.id, "//", aseg.nombre, "//", solic_aseg.cantidad) SEPARATOR "///") AS aseguramientos FROM solicitud solic LEFT JOIN solicitud_aseguramiento solic_aseg ON solic.id = solic_aseg.solicitud_id LEFT JOIN aseguramiento aseg ON aseg.id = solic_aseg.aseguramiento_id WHERE solic.estado = "pendiente" GROUP BY solic.id', (error, results) => {
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        const solicitudes = results.map(result => new Solicitud(result.id, result.usuario_id, result.nombre, result.lugar, strftime('%d/%m/%Y %I:%M:%S %p', result.fecha_hora), result.estado, result.aseguramientos));

                        res.render('admin/responderSolicitudes', {
                            usuario: req.session.usuario,
                            solicitudes: solicitudes
                        });
                    }
                });
            }
        });
    }else{
        res.redirect('/');
    }
};

repositorio.buscarSolicitudesPendientesPorNombre = (req, res) => {
    if(req.session.autenticado && req.session.usuario.rol == 'admin'){
        req.getConnection((error, connection) =>{
            const{nombre} = req.params;

            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('SELECT solic.id, solic.nombre, solic.lugar, solic.fecha_hora, solic.estado, GROUP_CONCAT(CONCAT(aseg.id, "//", aseg.nombre, "//", solic_aseg.cantidad) SEPARATOR "///") AS aseguramientos FROM solicitud solic LEFT JOIN solicitud_aseguramiento solic_aseg ON solic.id = solic_aseg.solicitud_id LEFT JOIN aseguramiento aseg ON aseg.id = solic_aseg.aseguramiento_id WHERE solic.estado = "pendiente" AND LOWER(solic.nombre) LIKE ? GROUP BY solic.id', ['%' + nombre + '%'], (error, results) => {
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        const solicitudes = results.map(result => new Solicitud(result.id, result.usuario_id, result.nombre, result.lugar, strftime('%d/%m/%Y %I:%M:%S %p', result.fecha_hora), result.estado, result.aseguramientos));

                        res.render('admin/responderSolicitudes', {
                            usuario: req.session.usuario,
                            solicitudes: solicitudes
                        });
                    }
                });
            }
        });
    }else{
        res.redirect('/');
    }
};

repositorio.aprobarSolicitud = (req, res) => {
    if(req.session.autenticado && req.session.usuario.rol == 'admin'){
        req.getConnection(async (error, connection) =>{
            const{id} = req.params;
    
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('UPDATE solicitud set ? WHERE id = ?', [{estado: "aprobada"}, id], async(error, results)=>{
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        solicitudPorId(req, res);

                        mostrarMensaje(req, res, 'admin/responderSolicitudes', 'Solicitud aprobada', 'success', '/admin/responderSolicitudes');
                    }
                });
            }
        });
    }else{
        res.redirect('/');
    }
};

repositorio.denegarSolicitud = (req, res) => {
    if(req.session.autenticado && req.session.usuario.rol == 'admin'){
        req.getConnection(async (error, connection) =>{
            const{id} = req.params;
    
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('UPDATE solicitud set ? WHERE id = ?', [{estado: "denegada"}, id], async(error, results)=>{
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        solicitudPorId(req, res);

                        mostrarMensaje(req, res, 'admin/responderSolicitudes', 'Solicitud denegada', 'success', '/admin/responderSolicitudes');
                    }
                });
            }
        });
    }else{
        res.redirect('/');
    }
};

function mostrarMensaje(req, res, vista, titulo, icono, ruta) {
    res.render(vista, {
        usuario: req.session.usuario,
        alerta: true,
        tituloAlerta: titulo,
        iconoAlerta: icono,
        rutaAlerta: ruta,
    });
}

function solicitudPorId(req, res){
    req.getConnection(async (error, connection) =>{
        const{id} = req.params;

        if(error){
            console.log('Ha ocurrido un error: ' + error);
        }else{
            connection.query('SELECT * FROM solicitud WHERE id = ? LIMIT 1', [id], async(error, results)=>{
                if(error){
                    console.log('Ha ocurrido un error: ' + error);
                }else{
                    const solicitud = results[0];
                    
                    switch(solicitud.estado){
                        case "aprobada":
                            enviarNotificacion(req, res, "Solicitud aprobada", 'Su solicitud "' + solicitud.nombre + '" ha sido aprobada', solicitud.usuario_id);
                        break;

                        case "denegada":
                            enviarNotificacion(req, res, "Solicitud denegada", 'Su solicitud "' + solicitud.nombre + '" ha sido denegada', solicitud.usuario_id);
                        break;
                    }                    
                }
            });
        }
    });
}

function enviarNotificacion(req, res, titulo, mensaje, idUser){
    req.getConnection(async (error, connection) =>{

        if(error){
            console.log('Ha ocurrido un error: ' + error);
        }else{
            connection.query('INSERT INTO notificacion SET ?', {usuario_id:idUser, titulo:titulo, mensaje:mensaje, visto:"no"}, async(error, results)=>{
                if(error){
                    console.log('Ha ocurrido un error: ' + error);
                }
            });
        }
    });
}

module.exports = repositorio;