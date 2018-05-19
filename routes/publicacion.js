var express = require('express');

var app = express();

var Publicacion = require('../models/publicacion');


//==============================
//Obtener todos las publicaciones
//==============================
app.get('/', (req, res)=>{

    Publicacion.find({})
        .populate('usuario', 'nombre email img')
        .exec((err, publicaciones)=>{

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al obtener publicaciones',
                    errors: err
                })
            }

            Publicacion.count({}, (err, conteo)=>{
                res.status(200).json({
                    ok: true,
                    publicaciones: publicaciones,
                    total: conteo
                });
            });
        });
});

//=============================================
//Obtener una publicacion de acuardo al id
//=============================================
app.get('/:id', (req, res, next)=>{
    var id = req.params.id;
    Publicacion.findById(id)
            .populate('usuario', 'nombre email img')
            .exec((err, publicacion)=>{
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al obtener la publicacion',
                        error: err
                    });
                }
                if (!publicacion) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'La publicacion con ese id' + id + 'no existe',
                        errors: {message: 'No existe una publicacion con ese ID'}
                    });
                }

                res.status(200).json({
                    ok: true,
                    publicacion: publicacion
                });
            });
});


//==================================
//Crear una publicacion
//==================================
app.post('/', (req, res)=>{

    var body = req.body;
    var publicacion = new Publicacion({
        titulo : body.titulo,
        contenido: body.contenido,
        descripcion: body.descripcion,
        img: body.img,
        usuario: body.usuario
    });

    publicacion.save((err, publicacionGuardada)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear publicacion',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            mensaje: 'Publicacion creada',
            publicacion: publicacionGuardada
        });

    });
});

//========================================
//Actualizar una publicacion
//========================================
app.put('/:id', (req, res)=>{

    var id = req.params.id;
    var body = req.body;

    Publicacion.findById(id, (err, publicacion)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al encontrar publicacion',
                errors: err
            });
        }
        if (!publicacion) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La publicacion con el '+ id+ 'no existe',
                    errors: {message: 'No existe una publicacion con ese ID'}
                });
            }
        }
        publicacion.titulo = body.titulo;
        publicacion.contenido = body.contenido;
        publicacion.descripcion = body.descripcion;
        publicacion.img = body.img,
        publicacion.usuario = body.usuario,

        publicacion.save((err, publicacionGuardada)=>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar publicacion',
                    errors: err
                })
            }
            res.status(200).json({
                ok: true,
                publicacion: publicacionGuardada
            });
        });
    });

});

//=========================================
//Borrar una publicacion
//=========================================
app.delete('/:id', (req, res)=>{

    var id = req.params.id;

    Publicacion.findByIdAndRemove(id, (err, publicacionBorrada)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar publicacion',
                errors: err
            });
        }

        if (!publicacionBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una publicacion con ese id',
                errors: {message:'No existe una publicacion con ese id'}
            });
        }

        res.status(200).json({
            ok: true,
            publicacion: publicacionBorrada
        })
    });

});

module.exports = app;