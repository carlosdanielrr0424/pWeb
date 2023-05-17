class Solicitud {
    constructor(id, usuario_id, nombre, lugar, area, fecha_hora, estado, aseguramientos){
        this.id = id;
        this.usuario_id = usuario_id;
        this.nombre = nombre;
        this.lugar = lugar;
        this.area = area;
        this.fecha_hora = fecha_hora;
        this.estado = estado;
        this.aseguramientos = aseguramientos;
    }
}

module.exports = Solicitud;