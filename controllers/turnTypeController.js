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


// CREATE (Agregar un nuevo tipo de turno)
const createTurnType = (turnType) => {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO TurnType SET ?', turnType, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

// UPDATE (Actualizar un tipo de turno existente)
const updateTurnType = (turnTypeId, updatedTurnType) => {
  return new Promise((resolve, reject) => {
    connection.query('UPDATE TurnType SET ? WHERE Id = ?', [updatedTurnType, turnTypeId], (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

// DELETE (Eliminar un tipo de turno)
const deleteTurnType = (turnTypeId) => {
  return new Promise((resolve, reject) => {
    connection.query('DELETE FROM TurnType WHERE Id = ?', turnTypeId, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  getAllTurnTypes,
  createTurnType,
  updateTurnType,
  deleteTurnType,
};