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

// Obtener la cantidad de solicitudes por mes para un participante
const getRequestCountsByMonth = (participantId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        MONTH(CreationDateTime) AS Month,
        COUNT(*) AS Total,
        SUM(CASE WHEN Status = 'APROBADO' THEN 1 ELSE 0 END) AS Aprobado,
        SUM(CASE WHEN Status = 'DENEGADO' THEN 1 ELSE 0 END) AS Denegado,
        SUM(CASE WHEN Status = 'PENDIENTE' THEN 1 ELSE 0 END) AS Pendiente
      FROM RequestChangeTurn
      WHERE ParticipantRequesterId = ? OR ParticipantDestinationId = ?
      GROUP BY MONTH(CreationDateTime)
    `;

    connection.query(query, [participantId, participantId], (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};


// Obtener la cantidad de solicitudes por mes para todos los participantes con el nombre del mes y el número del año
const getAllParticipantsRequestCountsByMonth = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        P.Id AS ParticipantId,
        P.FullName AS ParticipantName,
        MONTH(RCT.CreationDateTime) AS Month,
        YEAR(RCT.CreationDateTime) AS Year,
        COUNT(*) AS Total,
        SUM(CASE WHEN RCT.Status = 'APROBADO' THEN 1 ELSE 0 END) AS Aprobado,
        SUM(CASE WHEN RCT.Status = 'DENEGADO' THEN 1 ELSE 0 END) AS Denegado,
        SUM(CASE WHEN RCT.Status = 'PENDIENTE' THEN 1 ELSE 0 END) AS Pendiente,
        DATE_FORMAT(RCT.CreationDateTime, '%M %Y') AS MonthYearName
      FROM Participant AS P
      INNER JOIN RequestChangeTurn AS RCT ON P.Id = RCT.ParticipantRequesterId OR P.Id = RCT.ParticipantDestinationId
      GROUP BY P.Id, MONTH(RCT.CreationDateTime), YEAR(RCT.CreationDateTime)
    `;

    connection.query(query, (err, results) => {
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
  getRequestCountsByMonth,
  getAllParticipantsRequestCountsByMonth,
};