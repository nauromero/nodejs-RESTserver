const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// lo que hace este middleware es colocar todos los archivos
// que carguemos en req.files
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {
	let tipo = req.params.tipo;
	let id = req.params.id;
	console.log(id);
	if (!req.files) {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'No se cargaron archivos',
			},
		});
	}

	//validar tipos

	let tiposValidos = ['productos', 'usuarios'];
	if (tiposValidos.indexOf(tipo) < 0) {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'Los tipos permitios son: ' + tiposValidos.join(', '),
				tipo,
			},
		});
	}
	let archivo = req.files.archivo;

	// extensiones permitidas
	let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
	let splitName = archivo.name.split('.');
	let extension = splitName[splitName.length - 1];

	if (extensionesValidas.indexOf(extension) < 0) {
		return res.status(400).json({
			ok: false,
			err: {
				message:
					'Las extensiones válidas son: ' + extensionesValidas.join(', '),
				extension,
			},
		});
	}

	// cambiar nombre del archi

	let nombreArchivo = `${id}-${new Date().getTime()}.${extension}`;

	console.log(tipo, 'CONSOLE LOG TIPO');

	archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err,
			});
		}
		// imagen cargada
		switch (tipo) {
			case 'usuarios':
				console.log('CONSOLE LOG USUARIOS');
				imagenUsuario(id, res, nombreArchivo);
				break;
			case 'productos':
				console.log('CONSOLE LOG PRODUCTOS');
				imagenProducto(id, res, nombreArchivo);
				break;
			default:
				console.log('Acá pasó algo rarísimo');
		}
	});
});

const imagenUsuario = (id, res, nombreArchivo) => {
	Usuario.findById(id, (err, usuarioDb) => {
		if (err) {
			borraArchivo(nombreArchivo, 'usuarios');
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		if (!usuarioDb) {
			// console.log('ESTO NO DEBERIA APARECER');
			borraArchivo(nombreArchivo, 'usuarios');
			return res.status(400).json({
				ok: false,
				err: {
					message: 'El usuario no existe',
				},
			});
		}
		borraArchivo(usuarioDb.imagen, 'usuarios');

		usuarioDb.imagen = nombreArchivo;

		usuarioDb.save((err, usuarioGuardado) => {
			res.json({
				ok: true,
				usuario: usuarioGuardado,
				imagen: nombreArchivo,
			});
		});
	});
};

const imagenProducto = (id, res, nombreArchivo) => {
	Producto.findById(id, (err, productoDb) => {
		if (err) {
			borraArchivo(nombreArchivo, 'productos');
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		if (!productoDb) {
			// console.log('ESTO NO DEBERIA APARECER');
			borraArchivo(nombreArchivo, 'productos');
			return res.status(400).json({
				ok: false,
				err: {
					message: 'El producto no existe',
				},
			});
		}

		borraArchivo(productoDb.imagen, 'productos');

		productoDb.imagen = nombreArchivo;

		productoDb.save((err, productoGuardado) => {
			res.json({
				ok: true,
				producto: productoGuardado,
				imagen: nombreArchivo,
			});
		});
	});
};

const borraArchivo = (nombreImagen, tipo) => {
	let pathImagen = path.resolve(
		__dirname,
		`../../uploads/${tipo}/${nombreImagen}`
	);

	if (fs.existsSync(pathImagen)) {
		fs.unlinkSync(pathImagen);
	}
};

module.exports = app;
