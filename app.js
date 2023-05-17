//express
const express = require('express');
const app = express();

//capturarDatosFormularios
app.use(express.urlencoded({extended:false})); 
app.use(express.json());

//dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

//directoryJs
app.use('/js', express.static('js'));
app.use('/js', express.static(__dirname + '/src/js'));
//directorySrc
app.use('/resources', express.static('src'));
app.use('/resources', express.static(__dirname + '/src'));
//directoryNodeModules
app.use('/modules', express.static('node_modules'));
app.use('/modules', express.static(__dirname + '/node_modules'));

//motorPlantillasEjs
app.set('view engine', 'ejs');
app.set("views", __dirname + "/src/views");

//varSession
const session = require('express-session')
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized: true
}));

//ConexionMysql
const morgan = require('morgan');
const mysql = require('mysql');
const myConnection = require ('express-myconnection');
app.use(morgan('dev'));
app.use(myConnection(mysql, {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}, 'single'));

//controllers
const cAutenticarUsuario = require('./src/controllers/AutenticarUsuarioController');
app.use('/', cAutenticarUsuario);
const cCambiarContrasenna = require('./src/controllers/CambiarContrasennaController');
app.use('/', cCambiarContrasenna);
const cGestionarSolicitudes = require('./src/controllers/GestionarSolicitudesController');
app.use('/', cGestionarSolicitudes);  
const cResponderSolicitudes = require('./src/controllers/ResponderSolicitudesController');
app.use('/', cResponderSolicitudes);  
const cUsuarios = require('./src/controllers/UsuariosController');
app.use('/', cUsuarios);
const cAseguramientos = require('./src/controllers/AseguramientosController');
app.use('/', cAseguramientos);
const cGenerarReporte = require('./src/controllers/GenerarReporteController');
app.use('/', cGenerarReporte);  


app.listen(3000, (req, res)=>{
    console.log('SERVIDOR LISTO');
});