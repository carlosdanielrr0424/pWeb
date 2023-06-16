class Notificacion {
    constructor(id, usuario_id, titulo, mensaje, visto){
        this.id = id;
        this.usuario_id = usuario_id;
        this.titulo = titulo;
        this.mensaje = mensaje;
        this.visto = visto;
    }
}

module.exports = Notificacion;