class Usuario {
    constructor(id, nombre, apellidos, usuario, contrasenna, email, rol){
        this.id = id;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.usuario = usuario;
        this.contrasenna = contrasenna;
        this.email = email;
        this.rol = rol;
    }
}

module.exports = Usuario;