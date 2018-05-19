var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Publicacion =  require('../models/publicacion');

app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next)=>{

    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos de coleccion
    var tiposValidos = ['usuarios', 'publicaciones'];
    if (tiposValidos.indexOf(tipo) < 0 ) {
        return res.status(400).json({
            ok: false,
            mensaje: "Tipo de coleccion no es valida",
            errors: {message: "Tipo de coleccion no es valida"}
        });
    }

    if(!req.files){
        return res.status(400).json({
            ok: false,
            mensaje: "No selecciono nada",
            errors: {message: "Debe seleccionar una imagen"}
        });
    }

    //Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length-1];

    //extensiones aceptadas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: "Extension no valida",
            errors: {message: "Las extensiones validas son " + extensionesValidas.join(', ')}
        });
    }

    //Nombre de archivo personalizado
    var nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${ extensionArchivo }`;

    //Mover el archivo del temporal a un path en especifico
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err=>{
        if (err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al enviar archivo',
                errors: err,
                nombreArchivo: nombreArchivo
            });
        }
    });

    subirPorTipo(tipo, id, nombreArchivo, res);

    // res.status(200).json({
    //     ok: true,
    //     mensaje: "Archivo movido",
    //     nombreCortado: nombreCortado
    // });
});


function subirPorTipo(tipo, id, nombreArchivo, res){

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario)=>{

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe',
                    errors: {message: 'Usuario no existe'}
                });
            }
            var pathViejo = './uploads/usuarios/' + usuario.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo)
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado)=>{
                return res.status(200).json({
                    ok: true,
                    mensaje: "Imagen de usuario actualizada",
                    usuario: usuarioActualizado
                });
            });
        });
    }

    if (tipo === 'publicaciones') {
        Publicacion.findById(id, (err, publicacion)=>{
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Publicaion no existe',
                    errors: {message: 'Publicacion no existe'}
                });
            }
            var pathViejo = './uploads/publicaciones/' + publicacion.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo)
            }
            publicacion.img = nombreArchivo;
            publicacion.save((err, publicacionActualizada)=>{
                return res.status(200).json({
                    ok: true,
                    mensaje: "Imagen de publicacion actualizada",
                    publicacion: publicacionActualizada
                });
            });
        });
    }
};


module.exports = app;