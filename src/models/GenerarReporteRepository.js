const repositorio = {};

repositorio.actualizarVista = (req, res) => {
    if(req.session.autenticado){
        res.render('admin/generarReporte', {
            usuario: req.session.usuario
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