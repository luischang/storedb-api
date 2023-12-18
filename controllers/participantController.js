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


// CREATE (Agregar un nuevo participante)
const createParticipant = (participant) => {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO Participant SET ?', participant, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

// UPDATE (Actualizar un participante existente)
const updateParticipant = (participantId, updatedParticipant) => {
  return new Promise((resolve, reject) => {
    connection.query('UPDATE Participant SET ? WHERE Id = ?', [updatedParticipant, participantId], (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

// DELETE (Eliminar un participante)
const deleteParticipant = (participantId) => {
  return new Promise((resolve, reject) => {
    connection.query('DELETE FROM Participant WHERE Id = ?', participantId, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  getAllParticipants,
  createParticipant,
  updateParticipant,
  deleteParticipant,
};