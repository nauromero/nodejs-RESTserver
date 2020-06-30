const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/autenticacion');

const app = express();

app.get('/imagen/:tipo/:imagen', verificaTokenImg, (req, res) => {
	let tipo = req.params.tipo;
	let imagen = req.params.imagen;
	let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${imagen}`);

	console.log(pathImagen);
	if (fs.existsSync(pathImagen)) {
		res.sendFile(pathImagen);
		console.log(pathImagen);
	} else {
		let noImagePath = path.resolve(
			__dirname,
			'../assets/img/default-product-img.jpeg'
		);
		console.log(noImagePath);
		res.sendFile(noImagePath);
	}
});
module.exports = app;
