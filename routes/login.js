var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();


var Usuario = require('../models/usuario');


app.post('/', (req, res, next)=>{

    var body = req.body;

    //Usamos la funcion findOne que nos ayudara a encontrar al usuario con ese email exacto, la funcion
    //recibe el email de body y como en todos un callback con el (err, usuarioDB) en este usuarioDB nos devuelve
    //la respuesta osea un res o response solo que le pusimos usuarioDB para que nos guiemos entonces aqui esta todo
    //lo de modelo su id, email, password, role, etc.
    Usuario.findOne({email : body.email}, (err, usuarioDB)=>{

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Erros al buscar usario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }
        

        //Aqui comparamos las contraseñoas ingresadas a ver si coinciden y puede ingresar o no a la aplicaciones
        //para eso nos ayudamos de la funcion del bcrypt la cual se llama .compareSync y devuelve un true si coinciden
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas - password',
                errors: err
            });
        }

        //Crear un token 
        usuarioDB.password = ':)';
        var token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 14400})//4 horas

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    });

    

});


module.exports = app;