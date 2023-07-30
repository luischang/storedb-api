// db.js

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'qbotech.net', // Cambia esto por el nombre de tu host
  user: 'qbotech_root', // Cambia esto por tu nombre de usuario de MySQL
  password: 'Qbotech123', // Cambia esto por tu contraseña de MySQL
  database: 'qbotech_storedb', // Cambia esto por el nombre de tu base de datos
});

module.exports = connection;
