const bcryptjs = require('bcryptjs');

const repositorio = {};

repositorio.vistaCambiarContrasenna = (req, res) => {
    if(req.session.autenticado){
        res.render('cambiarContrasenna', {
            usuario: req.session.usuario
        });
    }else{
        res.redirect('/');
    }
}

repositorio.comprobarContrasenna = (req, res) => {
    if(req.session.autenticado){
        req.getConnection(async (error, connection) =>{
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('SELECT * FROM usuario WHERE usuario = ?', [req.session.usuario.usuario], async(error, results) => {
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        if(results == 0 || !(await bcryptjs.compare(req.body.inputContrasennaActualCC, results[0].contrasenna))){
                            mostrarMensaje(req, res, 'cambiarContrasenna', 'La contraseña actual es incorrecta', 'error', '/cambiarContrasenna');
                        }else{
                            cambiarContrasenna(req, res, await encriptarContrasenna(req.body.inputNuevaContrasennaCC));
                        }
                    }
                });
            }
        });
    }else{
        res.redirect('/');
    }
}

async function encriptarContrasenna(contrasenna) {
    return await bcryptjs.hash(contrasenna, 8);
}

async function cambiarContrasenna(req, res, contrasenna) {
    req.getConnection(async (error, connection) =>{
        if(error){
            console.log('Ha ocurrido un error: ' + error);
        }else{
            connection.query('UPDATE usuario set ? WHERE usuario = ?', [{contrasenna:contrasenna}, req.session.usuario.usuario], async(error, results)=>{
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        mostrarMensaje(req, res, 'cambiarContrasenna', 'La contraseña ha sido modificada correctamente', 'success', '/');
                    }
                });
        }
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

