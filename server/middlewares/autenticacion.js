const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {
	let token = req.get('token');
	jwt.verify(token, process.env.SEED, (err, decoded) => {
		if (err) {
			return res.status(401).json({
				ok: false,
				err,
			});
		}
		req.usuario = decoded.usuario;
		next();
	});
};

let verificaAdminRole = (req, res, next) => {
	let usuario = req.usuario;
	if (usuario.role != 'ADMIN_ROLE') {
		return res.status(403).json({
			ok: false,
			err: {
				mensaje: 'El usuario no es ADMIN',
			},
		});
	}
	next();
};

let verificaTokenImg = (req, res, next) => {
	let token = req.query.token;
	jwt.verify(token, process.env.SEED, (err, decoded) => {
		if (err) {
			return res.status(401).json({
				ok: false,
				err,
			});
		}
		req.usuario = decoded.usuario;
		next();
	});
};

module.exports = {
	verificaToken,
	verificaAdminRole,
	verificaTokenImg,
};
