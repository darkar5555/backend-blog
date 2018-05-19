var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var publicacionSchema =  new Schema({

    titulo: { type: String, required: [true, 'El titulo es necesario']},
    contenido: { type: String, required: [true, 'El contenido es necesario']},
    descripcion: { type: String, required: [true, 'La descripcion es necesario']},
    img: { type: String, required: false},
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true, unique: true }
}, {collection: 'publicaciones'});

publicacionSchema.plugin(uniqueValidator, { message:'{PATH} debe de ser unico' });


module.exports = mongoose.model('Publicacion', publicacionSchema);