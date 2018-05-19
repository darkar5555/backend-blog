// Requires 
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// Inicializar Variables
var app = express();


// Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


// Importar rutas
var usuarioRoutes = require('./routes/usuario');
var publicacionRoutes = require('./routes/publicacion');
var loginRoutes = require('./routes/login');
var appRoutes = require('./routes/app');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');


// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/blogDB', (err, res)=>{
    if (err) {
        throw err;
    }
    console.log('Express server puerto 3000 online');
});

// Serve index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname+'/'));
// app.use('/uploads',serveIndex(__dirname+ '/uploads'));

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/publicacion', publicacionRoutes);
app.use('/login', loginRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, ()=>{
    console.log('Express server puerto 3000 online');
});