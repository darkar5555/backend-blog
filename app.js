// Requires 
var express = require('express');
var mongoose = require('mongoose');


// Inicializar Variables
var app = express();


// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/blogDB', (err, res)=>{
    if (err) {
        throw err;
    }
    console.log('Express server puerto 3000 online');
});

// Rutas
app.get('/',(req, res)=>{
    res.status(200).json({
        ok: true,
        mensaje: "Peticion realizada correctamente"
    });
});


// Escuchar peticiones
app.listen(3000, ()=>{
    console.log('Express server puerto 3000 online');
});