const { sql, poolPromise } = require("../config/db.config");

async function insertOrUpdateMembresia(id, idKeko, tipo, fecha_inicio) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", sql.Int, id || null)
            .input("idKeko", sql.Int, idKeko)
            .input("tipo", sql.VarChar(50), tipo)
            .input("fecha_inicio", sql.Date, fecha_inicio)
            .execute("Sp_InsertOrUpdateMembresia"); // Llamada al SP

        return result.recordset;
    } catch (error) {
        throw error;
    }
}

async function getAllMembresias() {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT m.*, k.nombre AS Nombre
                FROM Membresias m
                INNER JOIN Kekos k ON m.idKeko = k.idKeko;
            `); // Consulta con el INNER JOIN
        return result.recordset; // Devuelve los registros
    } catch (error) {
        throw error;
    }
}

// Función para obtener una membresía por ID
async function getMembresiaById(id) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", sql.Int, id) // Inyectamos el parámetro ID
            .query(`SELECT m.*, k.nombre AS Nombre
                FROM Membresias m
                INNER JOIN Kekos k ON m.idKeko = k.idKeko
                WHERE m.id = @id`); // Consulta con parámetro
        return result.recordset[0]; // Devuelve el primer registro
    } catch (error) {
        throw error;
    }
}

module.exports = { insertOrUpdateMembresia, getAllMembresias, getMembresiaById };