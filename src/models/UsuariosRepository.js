const bcryptjs = require('bcryptjs');
const Usuario = require('./dataClass/Usuario');

const repositorio = {};

repositorio.actualizarVista = (req, res) => {
    if(req.session.autenticado){
        req.getConnection((error, connection) =>{
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('SELECT * FROM usuario', (error, results) => {
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        const usuarios = results.map(result => new Usuario(result.id, result.nombre, result.apellidos, result.usuario, result.contrasenna, result.email, result.rol));

                        res.render('admin/usuarios', {
                            usuario: req.session.usuario,
                            usuarios: usuarios
                        });
                    }
                });
            }
        });
    }else{
        res.redirect('/');
    }
};

repositorio.buscarUsuariosPorNombre = (req, res) => {
    if(req.session.autenticado){
        req.getConnection((error, connection) =>{
            const{nombre} = req.params;

            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('SELECT * FROM usuario WHERE LOWER(nombre) LIKE ?', ['%' + nombre + '%'], (error, results) => {
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        const usuarios = results.map(result => new Usuario(result.id, result.nombre, result.apellidos, result.usuario, result.contrasenna, result.email, result.rol));

                        res.render('admin/usuarios', {
                            usuario: req.session.usuario,
                            usuarios: usuarios
                        });
                    }
                });
            }
        });
    }else{
        res.redirect('/');
    }
};

repositorio.vistaNuevoUsuario = (req, res) => {
    if(req.session.autenticado){
        res.render('admin/nuevoUsuario', {
            usuario: req.session.usuario 
        });
    }else{
        res.redirect('/');
    }
}

repositorio.nuevoUsuario = (req, res) => {
    if(req.session.autenticado){
        req.getConnection(async (error, connection) =>{
            const nombre = req.body.nombre;
            const apellidos = req.body.apellidos;
            const correoElectronico = req.body.correoElectronico;
            const rol = req.body.rol;
            const usuario = req.body.usuario;
            let contrasenna = await bcryptjs.hash(req.body.contrasenna, 8);
    
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('INSERT INTO usuario SET ?', {nombre:nombre, apellidos:apellidos, usuario:usuario, contrasenna:contrasenna, email:correoElectronico, rol:rol}, async(error, results)=>{
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        mostrarMensaje(req, res, 'admin/nuevoUsuario', 'El usuario ha sido registrado correctamente', 'success', '/admin/usuarios');
                    }
                })
            }
        });
    }else{
        res.redirect('/');
    }
};

repositorio.buscarUsuarioID = (req, res) => {
    if(req.session.autenticado){
        const {id} = req.params;

        req.getConnection(async (error, connection) =>{
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('SELECT * FROM usuario WHERE id = ?', [id], (error, usuario) => {
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        const dataUsuario = {
                            id: usuario[0].id,
                            nombre: usuario[0].nombre,
                            apellidos: usuario[0].apellidos,
                            usuario: usuario[0].usuario,
                            email: usuario[0].email,
                            rol: usuario[0].rol
                        };
    
                        console.log(dataUsuario);
    
                        res.render('admin/editarUsuario', {
                            usuario: req.session.usuario,
                            eUsuario: dataUsuario,
                        });
                    }
                });
            }
        });
    }else{
        res.redirect('/');
    }
}

repositorio.editarUsuario = (req, res) => {
    if(req.session.autenticado){
        req.getConnection(async (error, connection) =>{
            const{id} = req.params;
            const nombre = req.body.nombre;
            const apellidos = req.body.apellidos;
            const correoElectronico = req.body.correoElectronico;
            const rol = req.body.rol;
            const usuario = req.body.usuario;
            let contrasenna = await bcryptjs.hash(req.body.contrasenna, 8);
    
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('UPDATE usuario set ? WHERE id = ?', [{nombre:nombre, apellidos:apellidos, usuario:usuario, contrasenna:contrasenna, email:correoElectronico, rol:rol}, id], async(error, results)=>{
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        mostrarMensaje(req, res, 'admin/editarUsuario', 'El usuario ha sido modificado correctamente', 'success', '/admin/usuarios');
                    }
                });
            }
        });
    }else{
        res.redirect('/');
    }
};

repositorio.eliminarUsuario = (req, res) => {
    if(req.session.autenticado){
        const {id} = req.params;

        req.getConnection(async (error, connection) =>{
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('DELETE FROM usuario WHERE id = ?', [id], (error, rows) => {
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        mostrarMensaje(req, res, 'admin/usuarios', 'Usuario eliminado correctamente', 'success', '/admin/usuarios');
                    }
                })
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

module.exports = repositorio;