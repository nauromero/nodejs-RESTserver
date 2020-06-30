const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

const app = express();
const Producto = require('../models/producto');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');

app.get('/producto', verificaToken, (req, res) => {
	let desde = req.query.desde || 0;
	desde = Number();

	Producto.find({ disponible: true })
		.skip(desde)
		.limit(5)
		.populate({ path: 'usuario', model: Usuario })
		.populate({ path: 'categoria', model: Categoria })
		.exec((err, productos) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err,
				});
			}
			if (!productos) {
				return res.status(500).json({
					ok: false,
					err: {
						err,
						message: 'No hay productos',
					},
				});
			}
			res.json({
				ok: true,
				productos,
			});
		});
});

app.get('/producto/:id', verificaToken, (req, res) => {
	let id = req.params.id;
	Producto.findById(id, (err, producto) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err,
			});
		}
		if (!producto) {
			return res.status(400).json({
				ok: false,
				err: {
					err,
					message: 'El producto no existe',
				},
			});
		}
		res.status(200).json({
			ok: true,
			producto,
		});
	});
});

// buscar productos

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
	let termino = req.params.termino;
	let regex = new RegExp(termino, 'i');

	Producto.find({ nombre: regex })
		.populate({ path: 'categoria', model: Categoria })
		.exec((err, productos) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err,
				});
			}
			res.status(200).json({
				ok: true,
				producto: productos,
			});
		});
});

app.post('/producto', verificaToken, (req, res) => {
	let body = req.body;
	let usuario = req.usuario._id;

	let producto = new Producto({
		nombre: body.nombre,
		precioUni: body.precioUni,
		descripcion: body.descripcion,
		usuario,
		categoria: body.categoria,
	});

	producto.save((err, productoDb) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err,
			});
		}
		res.status(200).json({
			ok: true,
			producto: productoDb,
		});
	});
});

app.put('/producto/:id', (req, res) => {
	let id = req.params.id;
	Producto.findByIdAndUpdate(
		id,
		req.body,
		{ new: true, runValidators: true },
		(err, productoDb) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err,
				});
			}
			res.json({
				ok: true,
				producto: productoDb,
			});
		}
	);
});

app.delete('/producto/:id', (req, res) => {
	let id = req.params.id;
	Producto.findByIdAndUpdate(
		id,
		{ disponible: false },
		{ new: true, runValidators: true },
		(err, productoDb) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err,
				});
			}
			if (!productoDb) {
				return res.status(500).json({
					ok: false,
					err: {
						message: 'El id no existe',
					},
				});
			}
			res.json({
				ok: true,
				producto: productoDb,
				message: 'Producto borrado',
			});
		}
	);
});

module.exports = app;
