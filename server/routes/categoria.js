const express = require('express');
const {
	verificaToken,
	verificaAdminRole,
} = require('../middlewares/autenticacion.js');
const app = express();

const Categoria = require('../models/categoria');

// Muestra todas las categorías

app.get('/categoria', verificaToken, (req, res) => {
	Categoria.find({})
		.populate('usuario')
		.exec((err, categorias) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err,
				});
			}
			res.json({
				ok: true,
				categorias,
			});
		});
});

// Mostrar una categoria por id

app.get('/categoria/:id', verificaToken, (req, res) => {
	let id = req.params.id;
	console.log(id);
	Categoria.findById(id, (err, categoria) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		if (!categoria) {
			return res.status(400).json({
				ok: false,
				err,
			});
		}

		res.json({
			ok: true,
			categoria,
		});
	});
});

// Crear categoria

app.post('/categoria', verificaToken, (req, res) => {
	let body = req.body;
	// let usuario = req.usuario._id;
	console.log(req);

	let categoria = new Categoria({
		nombre: body.nombreCategoria,
		descripcion: body.descripcion,
		imagen: body.imagen,
		usuario: req.usuario._id,
	});

	categoria.save((err, categoriaDb) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		if (!categoriaDb) {
			return res.status(400).json({
				ok: false,
				err,
			});
		}

		res.json({
			ok: true,
			categoria: categoriaDb,
		});
	});
});

// Actualizar Categoria

app.put('/categoria/:id', verificaToken, (req, res) => {
	let id = req.params.id;

	Categoria.findByIdAndUpdate(
		id,
		req.body,
		{ new: true, runValidators: true },
		(err, categoriaDb) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err,
				});
			}

			if (!categoriaDb) {
				return res.status(400).json({
					ok: false,
					err,
				});
			}

			res.json({
				ok: true,
				categoria: categoriaDb,
			});
		}
	);
});

// Borrar categoria

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
	let id = req.params.id;
	Categoria.findByIdAndDelete(id, (err, categoriaEliminada) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err: {
					err,
					message: 'El id es incorrecto o la categoría no existe',
				},
			});
		}

		if (!categoriaEliminada) {
			return res.status(400).json({
				ok: false,
				err: {
					message: 'El id no existe',
					err,
				},
			});
		}

		res.json({
			ok: true,
			message: 'Categoría Borrada',
			categoria: categoriaEliminada,
		});
	});
});

module.exports = app;
