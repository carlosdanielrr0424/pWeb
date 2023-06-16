const strftime = require('strftime');
const Aseguramiento = require('./dataClass/Aseguramiento');
const Solicitud = require('./dataClass/Solicitud');

const repositorio = {};

repositorio.actualizarVista = async (req, res) => {
    if(req.session.autenticado && req.session.usuario.rol == "areaManager"){
        req.getConnection((error, connection) =>{
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('SELECT solic.id, solic.nombre, solic.lugar, solic.fecha_hora, solic.estado, GROUP_CONCAT(CONCAT(aseg.id, "//", aseg.nombre, "//", solic_aseg.cantidad) SEPARATOR "///") AS aseguramientos FROM solicitud solic LEFT JOIN solicitud_aseguramiento solic_aseg ON solic.id = solic_aseg.solicitud_id LEFT JOIN aseguramiento aseg ON aseg.id = solic_aseg.aseguramiento_id WHERE solic.usuario_id = ? GROUP BY solic.id', [req.session.usuario.id], async (error, results) => {
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        const solicitudes = results.map(result => new Solicitud(result.id, result.usuario_id, result.nombre, result.lugar, strftime('%d/%m/%Y %I:%M:%S %p', result.fecha_hora), result.estado, result.aseguramientos));

                        var solicitudesPendientes = [];
                        var solicitudesAprobadas = [];
                        var solicitudesDenegadas = [];

                        for (var i = 0; i < solicitudes.length; i++){
                            switch(solicitudes[i].estado){
                                case 'pendiente':
                                    solicitudesPendientes.push(solicitudes[i]);
                                break;

                                case 'aprobada':
                                    solicitudesAprobadas.push(solicitudes[i]);
                                break;

                                case 'denegada':
                                    solicitudesDenegadas.push(solicitudes[i]);
                                break;
                            }
                        }

                        const notificaciones = await cantidadNuevasNotificaciones(req, res);

                        res.render('areaManager/solicitudes', {
                            usuario: req.session.usuario,
                            notificaciones: notificaciones,
                            solicitudesPendientes: solicitudesPendientes,
                            solicitudesAprobadas: solicitudesAprobadas,
                            solicitudesDenegadas: solicitudesDenegadas
                        });             
                    }
                });
            }
        });
    }else{
        res.redirect('/');
    }
};

repositorio.buscarSolicitudesPorNombre = (req, res) => {
    if(req.session.autenticado && req.session.usuario.rol == "areaManager"){
        req.getConnection((error, connection) =>{
            const{nombre} = req.params;

            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('SELECT solic.id, solic.nombre, solic.lugar, solic.fecha_hora, solic.estado, GROUP_CONCAT(CONCAT(aseg.id, "//", aseg.nombre, "//", solic_aseg.cantidad) SEPARATOR "///") AS aseguramientos FROM solicitud solic LEFT JOIN solicitud_aseguramiento solic_aseg ON solic.id = solic_aseg.solicitud_id LEFT JOIN aseguramiento aseg ON aseg.id = solic_aseg.aseguramiento_id WHERE solic.usuario_id = ? AND LOWER(solic.nombre) LIKE ? GROUP BY solic.id', [req.session.usuario.id, '%' + nombre + '%'], async (error, results) => {
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        const solicitudes = results.map(result => new Solicitud(result.id, result.usuario_id, result.nombre, result.lugar, strftime('%d/%m/%Y %I:%M:%S %p', result.fecha_hora), result.estado, result.aseguramientos));

                        var solicitudesPendientes = [];
                        var solicitudesAprobadas = [];
                        var solicitudesDenegadas = [];

                        for (var i = 0; i < solicitudes.length; i++){
                            switch(solicitudes[i].estado){
                                case 'pendiente':
                                    solicitudesPendientes.push(solicitudes[i]);
                                break;

                                case 'aprobada':
                                    solicitudesAprobadas.push(solicitudes[i]);
                                break;

                                case 'denegada':
                                    solicitudesDenegadas.push(solicitudes[i]);
                                break;
                            }
                        }

                        const notificaciones = await cantidadNuevasNotificaciones(req, res);

                        res.render('areaManager/solicitudes', {
                            usuario: req.session.usuario,
                            notificaciones: notificaciones,
                            solicitudesPendientes: solicitudesPendientes,
                            solicitudesAprobadas: solicitudesAprobadas,
                            solicitudesDenegadas: solicitudesDenegadas
                        });
                    }
                });
            }
        });
    }else{
        res.redirect('/');
    }
};

repositorio.vistaNuevaSolicitud = async (req, res) => {
    if(req.session.autenticado && req.session.usuario.rol == "areaManager"){
        const notificaciones = await cantidadNuevasNotificaciones(req, res);

        res.render('areaManager/nuevaSolicitud', {
            usuario: req.session.usuario,
            notificaciones: notificaciones
        });
    }else{
        res.redirect('/');
    }
}

repositorio.nuevaSolicitud = (req, res) => {
    if(req.session.autenticado && req.session.usuario.rol == "areaManager"){
        req.getConnection(async (error, connection) =>{   
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                comprobarSiExisteSolicitud(req, res);
            }
        });
    }else{
        res.redirect('/');
    }
};

repositorio.vistaNuevoAseguramientoSolicitud = (req, res) => {
    if(req.session.autenticado && req.session.usuario.rol == "areaManager"){
        const {solicitud_id} = req.params;

        req.getConnection((error, connection) =>{
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('SELECT * FROM aseguramiento', async (error, results) => {
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        const aseguramientos = results.map(result => new Aseguramiento(result.id, result.nombre));

                        const notificaciones = await cantidadNuevasNotificaciones(req, res);
    
                        res.render('areaManager/nuevoAseguramientoSolicitud', {
                            usuario: req.session.usuario,
                            notificaciones: notificaciones,
                            solicitud_id: solicitud_id,
                            aseguramientos: aseguramientos
                        });
                    }
                });
            }
        });
    }else{
        res.redirect('/');
    }
}

repositorio.nuevoAseguramientoSolicitud = (req, res) => {
    if(req.session.autenticado && req.session.usuario.rol == "areaManager"){
        req.getConnection(async (error, connection) =>{  
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                comprobarSiExsiteAseguramientoSolicitud(req, res);
            }
        });
    }else{
        res.redirect('/');
    }
};

repositorio.buscarAseguramientoSolicitudData = (req, res) => {
    if(req.session.autenticado && req.session.usuario.rol == "areaManager"){
        const {solicitud_id} = req.params;
        const {aseguramiento_id} = req.params;

        req.getConnection(async (error, connection) =>{
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('SELECT * FROM solicitud_aseguramiento WHERE solicitud_id = ? AND aseguramiento_id = ?', [solicitud_id, aseguramiento_id], (error, aseguramiento) => {
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        connection.query('SELECT * FROM aseguramiento', async (error, results) => {
                            if(error){
                                console.log('Ha ocurrido un error: ' + error);
                            }else{
                                const aseguramientos = results.map(result => new Aseguramiento(result.id, result.nombre));
            
                                const dataAseguramiento = {
                                    solicitud_id: aseguramiento[0].solicitud_id,
                                    aseguramiento_id: aseguramiento[0].aseguramiento_id,
                                    cantidad: aseguramiento[0].cantidad
                                };

                                const notificaciones = await cantidadNuevasNotificaciones(req, res);
            
                                res.render('areaManager/editarAseguramientoSolicitud', {
                                    usuario: req.session.usuario,
                                    notificaciones: notificaciones,
                                    solicitud_id: solicitud_id,
                                    aseguramiento: dataAseguramiento,
                                    aseguramientos: aseguramientos
                                });
                            }
                        });
                    }
                });
            }
        });
    }else{
        res.redirect('/');
    }
}

repositorio.editarAseguramientoSolicitud = (req, res) => {
    if(req.session.autenticado && req.session.usuario.rol == "areaManager"){
        req.getConnection(async (error, connection) =>{
            const{solicitud_id} = req.params;
            const aseguramiento_id = req.body.selectNombreEAS;
            const cantidad = req.body.inputCantidadEAS;
    
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('UPDATE solicitud_aseguramiento set ? WHERE solicitud_id = ? AND aseguramiento_id = ?', [{aseguramiento_id:aseguramiento_id, cantidad:cantidad}, solicitud_id, aseguramiento_id], async(error, results)=>{
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        mostrarMensaje(req, res, 'areaManager/editarAseguramientoSolicitud', 'El aseguramiento ha sido modificado correctamente en la solicitud', 'success', '/areaManager/solicitudes');
                    }
                });
            }
        });
    }else{
        res.redirect('/');
    }
};

repositorio.eliminarAseguramientoSolicitud = (req, res) => {
    if(req.session.autenticado && req.session.usuario.rol == "areaManager"){
        const {solicitud_id} = req.params;
        const {aseguramiento_id} = req.params;

        req.getConnection(async (error, connection) =>{
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('DELETE FROM solicitud_aseguramiento WHERE solicitud_id = ? AND aseguramiento_id = ?', [solicitud_id, aseguramiento_id], (error, rows) => {
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        mostrarMensaje(req, res, 'areaManager/solicitudes', 'Aseguramiento eliminado correctamente de la solicitud', 'success', '/areaManager/solicitudes');
                    }
                })
            }
        });
    }else{
        res.redirect('/');
    }
};

repositorio.buscarSolicitudID = (req, res) => {
    if(req.session.autenticado && req.session.usuario.rol == "areaManager"){
        const {id} = req.params;

        req.getConnection(async (error, connection) =>{
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('SELECT id, nombre, lugar, fecha_hora FROM solicitud WHERE id = ?', [id], async (error, solicitud) => {
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        const dataSolicitud = {
                            id: solicitud[0].id,
                            nombre: solicitud[0].nombre,
                            lugar: solicitud[0].lugar,
                            fecha_hora: strftime('%Y-%m-%d %H:%M', solicitud[0].fecha_hora)
                        };

                        const notificaciones = await cantidadNuevasNotificaciones(req, res);
    
                        res.render('areaManager/editarSolicitud', {
                            usuario: req.session.usuario,
                            notificaciones: notificaciones,
                            solicitud: dataSolicitud, 
                        });
                    }
                });
            }
        });
    }else{
        res.redirect('/');
    }
}

repositorio.editarSolicitud = (req, res) => {
    if(req.session.autenticado && req.session.usuario.rol == "areaManager"){
        req.getConnection(async (error, connection) =>{
            const{id} = req.params;
            const nombre = req.body.inputNombreES;
            const lugar = req.body.inputLugarES;
            const fecha_hora = req.body.inputFechaHoraES;
    
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('UPDATE solicitud set ? WHERE id = ?', [{nombre:nombre, lugar:lugar, fecha_hora:fecha_hora}, id], async(error, results)=>{
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        mostrarMensaje(req, res, 'areaManager/editarSolicitud', 'La solicitud ha sido modificada correctamente', 'success', '/areaManager/solicitudes');
                    }
                });
            }
        });
    }else{
        res.redirect('/');
    }
};

repositorio.eliminarSolicitud = (req, res) => {
    if(req.session.autenticado && req.session.usuario.rol == "areaManager"){
        const {id} = req.params;

        req.getConnection(async (error, connection) =>{
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('DELETE FROM solicitud WHERE id = ?', [id], (error, rows) => {
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        mostrarMensaje(req, res, 'areaManager/solicitudes', 'Solicitud eliminada correctamente', 'success', '/areaManager/solicitudes');
                    }
                })
            }
        });
    }else{
        res.redirect('/');
    }
};

async function comprobarSiExsiteAseguramientoSolicitud(req, res){
    req.getConnection(async (error, connection) =>{
        const {solicitud_id} = req.params;
        const aseguramiento_id = req.body.selectNombreNAS;
        const cantidad = req.body.inputCantidadNAS;
    
        if(error){
            console.log('Ha ocurrido un error: ' + error);
        }else{
            connection.query('SELECT * FROM solicitud_aseguramiento WHERE solicitud_id = ? AND aseguramiento_id = ?', [solicitud_id, aseguramiento_id], (error, results) => {
                if(error){
                    console.log('Ha ocurrido un error: ' + error);
                }else{
                    if(results.length == 0){
                        connection.query('INSERT INTO solicitud_aseguramiento SET ?', {solicitud_id:solicitud_id, aseguramiento_id:aseguramiento_id, cantidad:cantidad}, async(error, results)=>{
                            if(error){
                                console.log('Ha ocurrido un error: ' + error);
                            }else{
                                mostrarMensaje(req, res, 'areaManager/nuevoAseguramientoSolicitud', 'El aseguramiento ha sido agregado correctamente a la solicitud', 'success', '/areaManager/solicitudes');
                            }
                        })
                    }else{
                        mostrarMensaje(req, res, 'areaManager/nuevoAseguramientoSolicitud', 'El aseguramiento ya está asociado a la solicitud', 'success', '/areaManager/solicitudes');
                    }
                }
            });
        }
    })
}

async function cantidadNuevasNotificaciones(req, res){
    return new Promise((resolve, reject) => {
        req.getConnection(async (error, connection) =>{
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('SELECT COUNT(*) AS notificaciones FROM notificacion WHERE usuario_id = ? AND visto = "no"', [req.session.usuario.id], async (error, results) => {
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        resolve(results[0].notificaciones);
                    }
                });
            }
        });

        setTimeout(() => {
            const result = -1;
            resolve(result);
        }, 1000);
    });
}

async function comprobarSiExisteSolicitud(req, res){
    req.getConnection(async (error, connection) =>{
        const nombre = req.body.inputNombreNS;
        const lugar = req.body.inputLugarNS;
        const fecha_hora = req.body.inputFechaHoraNS;
        const usuario_id = req.session.usuario.id;

        if(error){
            console.log('Ha ocurrido un error: ' + error);
        }else{
            connection.query('SELECT * FROM solicitud WHERE usuario_id = ? AND nombre = ?', [usuario_id, nombre], (error, results) => {
                if(error){
                    console.log('Ha ocurrido un error: ' + error);
                }else{
                    if(results.length == 0){
                        connection.query('INSERT INTO solicitud SET ?', {usuario_id:usuario_id, nombre:nombre, lugar:lugar, fecha_hora:fecha_hora}, async(error, results)=>{
                            if(error){
                                console.log('Ha ocurrido un error: ' + error);
                            }else{
                                mostrarMensaje(req, res, 'areaManager/nuevaSolicitud', 'La solicitud ha sido registrada correctamente', 'success', '/areaManager/solicitudes');
                            }
                        })
                    }else{
                        mostrarMensaje(req, res, 'areaManager/nuevaSolicitud', 'La solicitud ya existe', 'success', '/areaManager/nuevaSolicitud');
                    }
                }
            });
        }
    })
}

async function mostrarMensaje(req, res, vista, titulo, icono, ruta) {
    const notificaciones = await cantidadNuevasNotificaciones(req, res);

    res.render(vista, {
        usuario: req.session.usuario,
        notificaciones, notificaciones,
        alerta: true,
        tituloAlerta: titulo,
        iconoAlerta: icono,
        rutaAlerta: ruta,
    });
}

module.exports = repositorio;