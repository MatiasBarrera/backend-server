var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'hospitales' });

module.exports = mongoose.model('Hospital', hospitalSchema);

/*
Schema.Types.ObjectId,	esto	es	utilizado	para	indicarle	a	Mongoose,	que	ese	campo	es	una	relación	con	otra	colección,	y	la	referencia	es	Usuario.	Al	final	este	campo	nos	dirá	qué	usuario	creó	el	registro.	
	
Se	guarda	únicamente	el	usuario._id	en	ese	campo.	Es	todo.	
	
*/