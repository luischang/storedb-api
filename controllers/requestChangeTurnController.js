const connection = require('../db');
const assignmentController = require('./assignmentController');


// READ (Obtener todas las solicitudes de cambio de turno)
const getAllRequests = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM RequestChangeTurn', (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

// READ (Obtener una solicitud por su ID)
const getRequestById = (requestId) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM RequestChangeTurn WHERE Id = ?', [requestId], (err, results) => {
      if (err) reject(err);
      if (results.length === 0) resolve(null);
      resolve(results[0]);
    });
  });
};

// CREATE (Crear una nueva solicitud de cambio de turno)
const createRequest = (request) => {
  return new Promise((resolve, reject) => {
    const newRequest = { ...request, CreationDateTime: new Date() };
    connection.query('INSERT INTO RequestChangeTurn SET ?', newRequest, (err, results) => {
      if (err) reject(err);
      resolve(results.insertId);
    });
  });
};

// UPDATE (Actualizar una solicitud de cambio de turno existente)
const updateRequest = (requestId, request) => {
  return new Promise((resolve, reject) => {
    connection.query('UPDATE RequestChangeTurn SET ? WHERE Id = ?', [request, requestId], (err, results) => {
      if (err) reject(err);
      resolve(results.affectedRows > 0);
    });
  });
};

// DELETE (Eliminar una solicitud de cambio de turno)
const deleteRequest = (requestId) => {
  return new Promise((resolve, reject) => {
    connection.query('DELETE FROM RequestChangeTurn WHERE Id = ?', [requestId], (err, results) => {
      if (err) reject(err);
      resolve(results.affectedRows > 0);
    });
  });
};

// Aprobar una solicitud de cambio de turno y realizar el intercambio en las asignaciones
const approveRequest = async (requestId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const approvalDateTime = new Date();
  
        // Obtener la información de la solicitud de cambio de turno
        const requestInfo = await getRequestById(requestId);
  
        // Verificar que la solicitud existe
        if (!requestInfo) {
          resolve(false);
          return;
        }
  
        // Obtener las asignaciones correspondientes a la solicitud
        const assignmentRequesterId = requestInfo.AssignmentRequesterId;
        const assignmentDestinationId = requestInfo.AssignmentDestinationId;
        const participantRequesterId = requestInfo.ParticipantRequesterId;
        const participantDestinationId = requestInfo.ParticipantDestinationId;
  
        // Realizar el intercambio de ParticipantId en las asignaciones
        const exchangeParticipantsResult = await assignmentController.exchangeParticipants(
          assignmentRequesterId,
          assignmentDestinationId,
          participantRequesterId,
          participantDestinationId
        );
  
        // Verificar que el intercambio de participantes fue exitoso
        if (exchangeParticipantsResult) {
          // Actualizar la solicitud de cambio de turno
          const updateRequestResult = await new Promise((resolve, reject) => {
            connection.query(
              'UPDATE RequestChangeTurn SET Status = ?, ApprovalDateTime = ? WHERE Id = ?',
              ['APROBADO', approvalDateTime, requestId],
              (err, results) => {
                if (err) reject(err);
                resolve(results.affectedRows > 0);
              }
            );
          });
  
          resolve(updateRequestResult);
        } else {
          resolve(false); // El intercambio de participantes no fue exitoso
        }
      } catch (error) {
        reject(error);
      }
    });
  };
  
  // Denegar una solicitud de cambio de turno
  const denyRequest = (requestId) => {
    return new Promise((resolve, reject) => {
      const approvalDateTime = new Date();
      connection.query(
        'UPDATE RequestChangeTurn SET Status = ?, ApprovalDateTime = ? WHERE Id = ?',
        ['DENEGADO', approvalDateTime, requestId],
        (err, results) => {
          if (err) reject(err);
          resolve(results.affectedRows > 0);
        }
      );
    });
  };
  
  module.exports = {
    getAllRequests,
    getRequestById,
    createRequest,
    updateRequest,
    deleteRequest,
    approveRequest,
    denyRequest,
  };