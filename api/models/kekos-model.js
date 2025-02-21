const { poolPromise, sql } = require("../config/db.config");

class KekoModel {
    // Obtener todos los kekos
    static async getAll() {
        try {
            // Se obtiene el pool de conexiones
            const pool = await poolPromise;

            // Realizar la consulta
            const result = await pool.request().query('SELECT idKeko, nombre as Nombre FROM Kekos');
            return result.recordset; // Acceder al resultado de la consulta

        } catch (error) {
            console.error("Error al obtener Kekos:", error);
            throw new Error("Error al obtener Kekos");
        }
    }
    static async getById(idKeko) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('idKeko', sql.Int, idKeko) // Parámetro de entrada para evitar inyecciones SQL
                .query('SELECT * FROM Kekos WHERE idKeko = @idKeko');
            return result.recordset.length > 0 ? result.recordset[0] : null;
        } catch (error) {
            console.error("Error al obtener Keko por ID:", error);
            throw new Error("Error al obtener Keko por ID");
        }
    }

    static async getKekosByName(searchTerm) {
        try {
            const pool = await poolPromise;
            // Usar template strings correctamente con las comillas invertidas
            const result = await pool.request()
                .query(`SELECT idKeko, nombre FROM Kekos WHERE nombre LIKE '%${searchTerm}%'`);
    
            // Retornar el resultado
            return result.recordset;
        } catch (error) {
            console.error("Error en getKekosByName:", error);
            throw error; // Lanzamos el error para que pueda ser manejado por quien llame a esta función
        }
    }

    static async create(nombre) {
        try {
            const pool = await poolPromise;
                // Verificar si el nombre ya existe en la base de datos
                const result = await pool.request()
                .input('nombre', sql.VarChar, nombre)
                .query('SELECT COUNT(*) AS count FROM Kekos WHERE nombre = @nombre');

            if (result.recordset[0].count > 0) {
                throw new Error(`El nombre "${nombre}" ya existe en la base de datos`);
            }
            // Ejecutamos la consulta de inserción sin devolver nada
            await pool.request()
                .input('nombre', sql.VarChar, nombre) // Parámetro de entrada para evitar inyecciones SQL
                .query('INSERT INTO Kekos (nombre) VALUES (@nombre)');
    
            console.log('Keko creado exitosamente');
        } catch (error) {
            console.error("Error al crear Keko:", error);
            throw new Error("Error al crear Keko");
        }
    }
    
    static async update(idKeko, nombre) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('idKeko', sql.Int, idKeko)
                .input('nombre', sql.NVarChar, nombre)
                .query('UPDATE Kekos SET nombre = @nombre WHERE idKeko = @idKeko');
            return result.rowsAffected; // Devuelve el número de filas afectadas
        } catch (error) {
            console.error("Error al actualizar Keko:", error);
            throw new Error("Error al actualizar Keko");
        }
    }
}

module.exports = KekoModel;
