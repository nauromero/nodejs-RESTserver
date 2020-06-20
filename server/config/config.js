//
// Puerto
//

process.env.PORT = process.env.PORT || 3000;

//
// Entorno
//

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//
// DB
//

let urlDB;

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB =
    'mongodb+srv://nau91:OhuCw2m88Xti25kM@cluster0-ugqig.mongodb.net/cafe';
}

process.env.URLDB = urlDB;
