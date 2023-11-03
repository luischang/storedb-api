const connection = require('../db');

// READ (Obtener todos los participantes)
const getAllParticipants= () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM Participant', (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};


module.exports = {
    getAllParticipants,
};