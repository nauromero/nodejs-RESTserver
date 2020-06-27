const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('debug', true);

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es necesario'],
	},
	descripcion: {
		type: String,
	},
	imagen: {
		type: String,
	},
	usuario: {
		type: { type: Schema.Types.ObjectId, ref: 'Usuario' },
	},
});

// categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('categoria', categoriaSchema);
