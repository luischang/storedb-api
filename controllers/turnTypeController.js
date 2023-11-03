const connection = require('../db');

// READ (Obtener todos los tipos de turnos)
const getAllTurnTypes= () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM TurnType', (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};


module.exports = {
    getAllTurnTypes,
};