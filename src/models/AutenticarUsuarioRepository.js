const bcryptjs = require('bcryptjs');
const Usuario = require('./dataClass/Usuario');

const repositorio = {};

repositorio.vistaAutenticarUsuario = (req, res) => {
    res.render('index');
}

repositorio.vistaPantallaGenerica = (req, res) => {
    if(req.session.autenticado){
        switch(req.session.usuario.rol){
            case 'admin':
                res.render('admin/pantallaGenerica', {
                    usuario: req.session.usuario
                });
            break;

            case 'areaManager':
                res.render('areaManager/pantallaGenerica', {
                    usuario: req.session.usuario
                });
            break;
        }
    }else{
        res.redirect('/');
    }
}

repositorio.iniciarSesion = async (req, res) => {
    const usuario = req.body.usuario;
    const contrasenna = req.body.contrasenna;

    comprobarCredenciales(req, res, usuario, contrasenna);
}

repositorio.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}

function comprobarCredenciales(req, res, usuario, contrasenna) {
    req.getConnection(async (error, connection) =>{
        if(error){
            console.log('Ha ocurrido un error: ' + error);
        }else{
            connection.query('SELECT * FROM usuario WHERE usuario = ?', [usuario], async(error, results) => {
                if(error){
                    console.log('Ha ocurrido un error: ' + error);
                }else{
                    if(results == 0 || !(await bcryptjs.compare(contrasenna, results[0].contrasenna))){
                        mostrarMensaje(res, 'index', 'Usuario o contraseña incorrecta', 'error', '/');
                    }else{
                        req.session.autenticado = true;
                        req.session.usuario = new Usuario(results[0].id, results[0].nombre, results[0].apellidos, results[0].usuario, results[0].contrasenna, results[0].email, results[0].rol);
                                
                        res.redirect('/pantallaGenerica'); 
                    }
                }
            });
        }
    });
}

function mostrarMensaje(res, vista, titulo, icono, ruta) {
    res.render(vista, {
        alerta: true,
        tituloAlerta: titulo,
        iconoAlerta: icono,
        rutaAlerta: ruta,
    });
}

module.exports = repositorio;