const strftime = require('strftime');
const Solicitud = require('./dataClass/Solicitud');

const repositorio = {};

repositorio.actualizarVista = (req, res) => {
    if(req.session.autenticado && req.session.usuario.rol == 'admin'){
        res.render('admin/generarReporte', {
            usuario: req.session.usuario
        });
    }else{
        res.redirect('/');
    }
};

repositorio.generarReporte = (req, res) => {
    if(req.session.autenticado && req.session.usuario.rol == 'admin'){
        const annoAcademico = req.body.selectAnnoAcaGR;
        const periodo = req.body.selectPeriodoGR;

        const annos = annoAcademico.split("///");
        var mesInicial = "01";
        var mesFinal = "12";

        switch(periodo){
            case "1":
                mesInicial = "02"
                mesFinal = "07"
            break;

            case "2":
                mesInicial = "09";
                mesFinal = "01";
            break;
        }

        req.getConnection((error, connection) =>{
            if(error){
                console.log('Ha ocurrido un error: ' + error);
            }else{
                connection.query('SELECT * FROM solicitud WHERE DATE(fecha_hora) >= ? AND DATE(fecha_hora) <= ?', [annos[0] + "-" + mesInicial + "-01", annos[1] + "-" + mesFinal + "-31 23:59:59"], async (error, results) => {
                    if(error){
                        console.log('Ha ocurrido un error: ' + error);
                    }else{
                        const solicitudes = results.map(result => new Solicitud(result.id, result.usuario_id, result.nombre, result.lugar, strftime('%d/%m/%Y %I:%M:%S %p', result.fecha_hora), result.estado, result.aseguramientos));

                        const cantidadSolicitudes = results.length;
                        var cantidadSolicitudesPendientes = 0;
                        var cantidadSolicitudesAprobadas = 0;
                        var cantidadSolicitudesDenegadas = 0;

                        for (var i = 0; i < solicitudes.length; i++){
                            switch(solicitudes[i].estado){
                                case 'pendiente':
                                    cantidadSolicitudesPendientes ++;
                                break;

                                case 'aprobada':
                                    cantidadSolicitudesAprobadas ++;
                                break;

                                case 'denegada':
                                    cantidadSolicitudesDenegadas ++;
                                break;
                            }
                        }

                        var porcientoSP = cantidadSolicitudesPendientes * 100 / cantidadSolicitudes;
                        var porcientoSA = cantidadSolicitudesAprobadas * 100 / cantidadSolicitudes;
                        var porcientoSD = cantidadSolicitudesDenegadas * 100 / cantidadSolicitudes;

                        if(cantidadSolicitudes == 0){
                            porcientoSP = 0;
                            porcientoSA = 0;
                            porcientoSD = 0;
                        }

                        res.render('admin/generarReporte', {
                            usuario: req.session.usuario,
                            reporteGenerado: true,
                            annoAcademico: annos[0] + "-" + annos[1],
                            periodo: periodo,
                            cantidadSolicitudes: cantidadSolicitudes,
                            cantidadSolicitudesPendientes: cantidadSolicitudesPendientes,
                            cantidadSolicitudesAprobadas: cantidadSolicitudesAprobadas,
                            cantidadSolicitudesDenegadas: cantidadSolicitudesDenegadas,
                            porcientoSP: porcientoSP,
                            porcientoSA: porcientoSA,
                            porcientoSD: porcientoSD,
                            totalPorciento: porcientoSP + porcientoSA + porcientoSD
                        });
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

module.exports = repositorio;