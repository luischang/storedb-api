const connection = require("../db");
const assignmentController = require("./assignmentController");

// READ (Obtener todas las solicitudes de cambio de turno)
const getAllRequests = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM RequestChangeTurn", (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

// READ (Obtener todas las solicitudes de cambio de turno con detalles de participantes y asignaciones)
const getAllRequestsWithDetails = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
    SELECT
    rct.Id,
    rct.ParticipantRequesterId,
    pr.FullName AS RequesterFullName,
    pr.TypeUser AS RequesterTypeUser,
    pr.DocumentNro AS RequesterDocumentNro,
    rct.ParticipantDestinationId,
    pd.FullName AS DestinationFullName,
    pd.TypeUser AS DestinationTypeUser,
    pd.DocumentNro AS DestinationDocumentNro,
    rct.AssignmentRequesterId,
    pr.TypeUser AS RequesterParticipantType,
    ar.TurnTypeId AS RequesterTurnTypeId,
    CONCAT(ttr.ShortDescription, ' (', ttr.HourNum, ')') AS RequesterTurn,
    ar.AssignDate AS RequesterAssignDate,
    rct.AssignmentDestinationId,
    pd.TypeUser AS DestinationParticipantType,
    ad.TurnTypeId AS DestinationTurnTypeId,
    CONCAT(ttd.ShortDescription, ' (', ttd.HourNum, ')') AS DestinationTurn,
    ad.AssignDate AS DestinationAssignDate,
    rct.Status,
    rct.CreationDateTime,
    rct.ApprovalDateTime
    FROM RequestChangeTurn rct
    JOIN Participant pr ON rct.ParticipantRequesterId = pr.Id
    JOIN Participant pd ON rct.ParticipantDestinationId = pd.Id
    JOIN Assignment ar ON rct.AssignmentRequesterId = ar.Id
    JOIN Assignment ad ON rct.AssignmentDestinationId = ad.Id
    JOIN TurnType ttr ON ar.TurnTypeId = ttr.Id
    JOIN TurnType ttd ON ad.TurnTypeId = ttd.Id
    `,
      (err, results) => {
        if (err) reject(err);
        // Mapear los resultados a un formato deseado
        const formattedResults = results.map((result) => ({
          Id: result.Id,
          ParticipantRequester: {
            ParticipantId: result.ParticipantRequesterId,
            FullName: result.RequesterFullName,
            TypeUser: result.RequesterTypeUser,
            DocumentNro: result.RequesterDocumentNro,
          },
          ParticipantDestination: {
            ParticipantId: result.ParticipantDestinationId,
            FullName: result.DestinationFullName,
            TypeUser: result.DestinationTypeUser,
            DocumentNro: result.DestinationDocumentNro,
          },
          AssignmentRequester: {
            ParticipantType: result.RequesterParticipantType,
            TurnTypeId: result.RequesterTurnTypeId,
            Turn: result.RequesterTurn,
            AssignDate: result.RequesterAssignDate,
          },
          AssignmentDestination: {
            ParticipantType: result.DestinationParticipantType,
            TurnTypeId: result.DestinationTurnTypeId,
            Turn: result.DestinationTurn,
            AssignDate: result.DestinationAssignDate,
          },
          Status: result.Status,
          CreationDateTime: result.CreationDateTime,
          ApprovalDateTime: result.ApprovalDateTime,
        }));

        resolve(formattedResults);
      }
    );
  });
};

// READ (Obtener una solicitud por su ID)
const getRequestById = (requestId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM RequestChangeTurn WHERE Id = ?",
      [requestId],
      (err, results) => {
        if (err) reject(err);
        if (results.length === 0) resolve(null);
        resolve(results[0]);
      }
    );
  });
};

// CREATE (Crear una nueva solicitud de cambio de turno)
const createRequest = (request) => {
  return new Promise((resolve, reject) => {
    const newRequest = { ...request, CreationDateTime: new Date() };
    connection.query(
      "INSERT INTO RequestChangeTurn SET ?",
      newRequest,
      (err, results) => {
        if (err) reject(err);
        resolve(results.insertId);
      }
    );
  });
};

// UPDATE (Actualizar una solicitud de cambio de turno existente)
const updateRequest = (requestId, request) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE RequestChangeTurn SET ? WHERE Id = ?",
      [request, requestId],
      (err, results) => {
        if (err) reject(err);
        resolve(results.affectedRows > 0);
      }
    );
  });
};

// DELETE (Eliminar una solicitud de cambio de turno)
const deleteRequest = (requestId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "DELETE FROM RequestChangeTurn WHERE Id = ?",
      [requestId],
      (err, results) => {
        if (err) reject(err);
        resolve(results.affectedRows > 0);
      }
    );
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
      const exchangeParticipantsResult =
        await assignmentController.exchangeParticipants(
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
            "UPDATE RequestChangeTurn SET Status = ?, ApprovalDateTime = ? WHERE Id = ?",
            ["APROBADO", approvalDateTime, requestId],
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
      "UPDATE RequestChangeTurn SET Status = ?, ApprovalDateTime = ? WHERE Id = ?",
      ["DENEGADO", approvalDateTime, requestId],
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
  getAllRequestsWithDetails,
};
