var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator'); // npm install mongoose-unique-validator --save

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var usuariosSchema = new Schema({
    nombres: { type: String, required: [true, 'El nombre es necesario'] },
    apellido: { type: String, required: false },
    email: { type: String, unique: true, required: [true, 'El email es necesario'] },
    password: { type: String, required: [true, 'El password es necesario'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
    google: { type: Boolean, default: false }
});

usuariosSchema.plugin(uniqueValidator, { message: 'El {PATH} debe de ser unico' });

module.exports = mongoose.model('Usuario', usuariosSchema);