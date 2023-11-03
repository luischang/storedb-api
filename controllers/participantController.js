const connection = require('../db');

// READ (Obtener todas las categorías)
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