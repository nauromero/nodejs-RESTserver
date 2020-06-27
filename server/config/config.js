//
// Puerto
//

process.env.PORT = process.env.PORT || 3000;

//
// Entorno
//

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//
// Vencimiento del token
//

process.env.CADUCIDAD_TOKEN = '48h';

//
// SEED de autenticación
//

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//
// DB
//

let urlDB;

if (process.env.NODE_ENV === 'dev') {
	urlDB = 'mongodb://localhost:27017/cafe';
} else {
	urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//
// GOOGLE CLIENT ID
//

process.env.CLIENT_ID =
	process.env.CLIENT_ID ||
	'51864033931-6dkpieincc73bpsc6q2admj9234nus5b.apps.googleusercontent.com';
