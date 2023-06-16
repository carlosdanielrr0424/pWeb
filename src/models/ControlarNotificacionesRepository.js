const Notificacion = require('./dataClass/Notificacion');

const repositorio = {};

repositorio.actualizarVista = async (req, res) => {
    if(req.session.autenticado && req.session.usuario.rol == "areaManager"){
        req.getConnection((error, connection) =>{
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('SELECT * FROM notificacion WHERE usuario_id = ?', [req.session.usuario.id], async (error, results) => {
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        const notificaciones = results.map(result => new Notificacion(result.id, result.usuario_id, result.titulo, result.mensaje, result.visto));

                        cambiarVisibilidadNotificaciones(req, res);

                        res.render('areaManager/notificaciones', {
                            usuario: req.session.usuario,
                            notificaciones: notificaciones 
                        });             
                    }
                });
            }
        });
    }else{
        res.redirect('/');
    }
};

repositorio.eliminarNotificacion = (req, res) => {
    if(req.session.autenticado && req.session.usuario.rol == 'areaManager'){
        const {id} = req.params;

        req.getConnection(async (error, connection) =>{
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('DELETE FROM notificacion WHERE id = ?', [id], (error, rows) => {
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        mostrarMensaje(req, res, 'areaManager/notificaciones', 'Notificación eliminada correctamente', 'success', '/areaManager/notificaciones');
                    }
                })
            }
        });
    }else{
        res.redirect('/');
    }
};

function cambiarVisibilidadNotificaciones(req, res){
    return new Promise((resolve, reject) => {
        req.getConnection(async (error, connection) =>{
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('UPDATE notificacion set ? WHERE usuario_id = ?', [{visto:"si"}, req.session.usuario.id], async (error, results) => {
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        resolve(results);
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

function mostrarMensaje(req, res, vista, titulo, icono, ruta) {
    res.render(vista, {
        usuario: req.session.usuario,
        alerta: true,
        tituloAlerta: titulo,
        iconoAlerta: icono,
        rutaAlerta: ruta,
    });
}

module.exports = repositorio;