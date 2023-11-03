const connection = require("../db");
const moment = require("moment-timezone");

// READ (Obtener todas las asignaciones)
const getAllAssignments = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM Assignment", (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

// READ (Obtener una asignación por su ID)
const getAssignmentById = (assignmentId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM Assignment WHERE Id = ?",
      [assignmentId],
      (err, results) => {
        if (err) reject(err);
        if (results.length === 0) resolve(null);
        resolve(results[0]);
      }
    );
  });
};

// CREATE (Crear una nueva asignación)
const createAssignment = (assignment) => {
  return new Promise((resolve, reject) => {
    try {
      // Debes proporcionar los valores necesarios en el cuerpo de la solicitud para crear una nueva asignación
      const { ParticipantType, ParticipantId, TurnTypeId, AssignDate } =
        assignment;

      // Calcular "DayNum," "MonthNum," y "YearNum" a partir de "AssignDate"
      const assignDate = moment(AssignDate);
      const dayNum = assignDate.date(); // Obtén el día del mes
      const monthNum = assignDate.month() + 1; // Obtén el mes (se suma 1 porque los meses en moment van de 0 a 11)
      const yearNum = assignDate.year();

      const newAssignment = {
        ParticipantType,
        ParticipantId,
        TurnTypeId,
        AssignDate,
        DayNum: dayNum,
        MonthNum: monthNum,
        YearNum: yearNum,
      };

      // Validar si ya existe una asignación para el mismo participante en la misma fecha
      connection.query(
        "SELECT COUNT(*) as count FROM Assignment WHERE ParticipantId = ? AND AssignDate = ?",
        [ParticipantId, AssignDate],
        (err, results) => {
          if (err) {
            console.error("Error en la inserción:", err);
            reject("Error en la inserción de datos");
          } else {
            const count = results[0].count;
            if (count > 0) {
              // Ya existe una asignación para el mismo participante en la misma fecha
              reject(
                "Ya existe una asignación para el mismo participante en la misma fecha."
              );
            } else {
              // No existe una asignación, puedes proceder a insertar la nueva asignación en la base de datos
              connection.query(
                "INSERT INTO Assignment SET ?",
                newAssignment,
                (err, results) => {
                  if (err) {
                    console.error("Error en la inserción:", err);
                    reject("Error en la inserción de datos");
                  } else {
                    resolve(results.insertId);
                  }
                }
              );
            }
          }
        }
      );
    } catch (error) {
      console.error("Error en la inserción:", error);
      reject("Error en la inserción de datos");
    }
  });
};

// UPDATE (Actualizar una asignación existente)
const updateAssignment = (assignmentId, assignment) => {
  return new Promise((resolve, reject) => {
    // Debes proporcionar los valores necesarios en el cuerpo de la solicitud para actualizar una asignación
    const {
      ParticipantType,
      ParticipantId,
      TurnTypeId,
      AssignDate,
      MonthNum,
      YearNum,
    } = assignment;

    // Calcular "DayNum" a partir de "AssignDate"
    const assignDate = new Date(AssignDate);
    const dayNum = assignDate.getDate(); // Obtén el día del mes

    const updatedAssignment = {
      ParticipantType,
      ParticipantId,
      TurnTypeId,
      AssignDate,
      MonthNum,
      YearNum,
      DayNum,
    };

    // Validar si ya existe una asignación para el mismo participante en la misma fecha
    connection.query(
      "SELECT COUNT(*) as count FROM Assignment WHERE ParticipantId = ? AND AssignDate = ? AND Id <> ?",
      [ParticipantId, AssignDate, assignmentId],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          const count = results[0].count;
          if (count > 0) {
            // Ya existe una asignación para el mismo participante en la misma fecha
            resolve(
              "Ya existe una asignación para el mismo participante en la misma fecha."
            );
          } else {
            // No existe una asignación duplicada, puedes proceder a actualizar la asignación en la base de datos
            connection.query(
              "UPDATE Assignment SET ? WHERE Id = ?",
              [updatedAssignment, assignmentId],
              (err, results) => {
                if (err) reject(err);
                resolve(results.affectedRows > 0);
              }
            );
          }
        }
      }
    );
  });
};

// DELETE (Eliminar una asignación)
const deleteAssignment = (assignmentId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "DELETE FROM Assignment WHERE Id = ?",
      [assignmentId],
      (err, results) => {
        if (err) reject(err);
        resolve(results.affectedRows > 0);
      }
    );
  });
};

// READ (Obtener todas las asignaciones por MonthNum y/o YearNum)
const getAssignmentsByMonthAndYear = (monthNum, yearNum) => {
  return new Promise((resolve, reject) => {
    let query = "SELECT * FROM Assignment WHERE 1"; // Consulta base

    if (monthNum !== undefined) {
      query += " AND MonthNum = ?";
    }

    if (yearNum !== undefined) {
      query += " AND YearNum = ?";
    }

    connection.query(query, [monthNum, yearNum], (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentsByMonthAndYear,
};
