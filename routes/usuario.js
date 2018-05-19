var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();
var Usuario = require('../models/usuario');
var mdAutenticacion = require('../middlewares/autenticacion');


//============================================================
// Obtener todos los usuarios
//============================================================
app.get('/', (req, res)=>{
    Usuario.find({},'nombre email img role')
        .exec( (err, usuarios)=>{
            if (err) {
                return res.status(500).json({
                    ok: flase,
                    mensaje: 'Error en base de datos',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                usuarios: usuarios
            });
        });
});

//=============================================
//Obtener un usuario de acuardo al id
//=============================================
app.get('/:id', (req, res, next)=>{
    var id = req.params.id;
    Usuario.findById(id)
            .exec((err, usuario)=>{
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al obtener el usuario',
                        error: err
                    });
                }
                if (!usuario) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El usuario con ese id' + id + 'no existe',
                        errors: {message: 'No existe un usuario con ese ID'}
                    });
                }

                res.status(200).json({
                    ok: true,
                    usuario: usuario
                });
            });
});

//============================================================
// Crear un nuevo usuario
//============================================================
app.post('/',   mdAutenticacion.verificaToken, (req, res, next)=>{

    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password:  bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save( (err, usuarioGuardado)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioGuardado
        });
    });
});

//===========================================================
//Actualizar un nuevo usuario 
//===========================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res, next)=>{

    //con esto obtenemos el id  
    var id = req.params.id;

    var body = req.body;

    //La funcion .finById nos ayudara para encontrar al usuario o lo que estemos buscando
    //y recibe el id mas un callback con dos parametrops (err, res) en este caso el res
    //es un usuario de la base de datos si lo encontro o no encontro
    Usuario.findById(id, (err, usuario)=>{

        
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id '+ id+ 'no existe',
                errors: {message: 'no existe un usario con ese ID'}
            })
        }

        //Este usuario viene del findById en el callback justamente
        usuario.nombre =  body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        //Aqui tambien el .save recibe un callback que como en todo recibe un err y el usuarioGuardado 
        usuario.save((err, usuarioGuardado)=>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usaurio',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
                mensaje: 'Usuario actualizado correctamente'
            });
        }); 
    });
});

//=======================================
//Borrar un uusairo by id
//=======================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res, next)=>{

    var id =  req.params.id;

    //Para borrar un usario llamamos a la funcion findByIdAndRemove
    //Usamos Usuario ya que esto nos da toda la collection de usuarios este tambien recibe un callback
    //en el cual como todos recibe un err y el usuarioBorrado (err, usuarioBorrado)
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuarios',
                erros: err
            });
        }

        if(!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: {message: 'No existe un usuario con ese id'}
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado,
            mensaje: 'Usuario borrado exitosamente'
        });
    });
});



module.exports = app;