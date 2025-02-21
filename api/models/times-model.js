const { sql, poolPromise } = require("../config/db.config");

async function insertCabecera(idKeko, idUsuario) {
    try {
        let pool = await poolPromise;

        // 🔍 Verificar si el usuario ya tiene un registro en la fecha actual
        let checkResult = await pool.request()
        .input("idKeko", sql.Int, idKeko)
        .query(`
            SELECT COUNT(*) AS count 
            FROM CabeceraTiempos 
            WHERE idKeko = @idKeko 
            AND CONVERT(DATE, Fecha) = CONVERT(DATE, GETDATE())  
        `);
    
    if (checkResult.recordset[0].count > 0) {
        return { mensaje: "Ya existe un registro para este idKeko en la fecha actual." };
    }

        // ✅ Insertar solo si no hay registro previo hoy
        let result = await pool.request()
            .input("idKeko", sql.Int, idKeko)
            .input("idUsuario", sql.Int, idUsuario)
            .query(`
                INSERT INTO CabeceraTiempos (idKeko, idUsuario, Fecha) 
                OUTPUT INSERTED.IDCabecera 
                VALUES (@idKeko, @idUsuario, GETDATE())
            `);
        await insertDetalle(result.recordset[0].IDCabecera)
        return result.recordset[0].IDCabecera;
      
    } catch (error) {
        console.error("Error al insertar en CabeceraTiempos:", error);
        throw error;
    }
}


// Función para insertar automáticamente en DetalleTiempos
async function insertDetalle(idCabecera) {
    try {
        const pool = await poolPromise; // 🔹 Asegurar que pool es obtenido correctamente
        let result = await pool.request()
            .input("IDCabecera", sql.Int, idCabecera)
            .input("idEstadoTiempo", sql.Int, 1)
            .query(`
                INSERT INTO DetalleTiempos (IDCabecera, Descripcion, HoraInicio, HoraFin, idEstadoTiempo) 
                VALUES (@IDCabecera, 'Primera', GETDATE(), DATEADD(HOUR, 1, GETDATE()), @idEstadoTiempo)
            `);

        return result.recordset;
    } catch (error) {
        console.error("Error al insertar en DetalleTiempos:", error);
        throw error;
    }
}


    // Obtener todos los tiempos de hoy
    async function getAllTiempos(idUsuario) {
        try {
          const pool = await poolPromise;
          const result = await pool.request().input('idUsuario', idUsuario).execute("Sp_GetAllTiempos");
          return result.recordset;
        } catch (error) {
          throw error;
        }
      }
    async function getTiemposByUsuario(idUsuario) {
        try {
          const pool = await poolPromise;
          const result = await pool.request()
            .input("idUsuario", sql.Int, idUsuario)
            .execute("Sp_GetTiemposByUsuario");
          return result.recordset;
        } catch (error) {
          throw error;
        }
      }

       // 1. Iniciar un detalle de tiempo
       async function iniciarDetalle(idCabecera, descripcion, horaInicio) {
        try {
            const fechaHora = new Date(); // Fecha actual en el servidor
            const [horas, minutos] = horaInicio.split(':');
            
            // ⚠️ Usa setUTCHours para trabajar en UTC
            fechaHora.setUTCHours(horas, minutos, 0, 0); 
    
            const pool = await poolPromise;
            const result = await pool.request()
                .input('IDCabecera', sql.Int, idCabecera)
                .input('Descripcion', sql.NVarChar, descripcion)
                .input('HoraInicio', sql.DateTime, fechaHora)
                .query('EXEC IniciarDetalle @IDCabecera, @Descripcion, @HoraInicio');
    
            return result.recordset;
        } catch (err) {
            throw new Error("Error al iniciar detalle: " + err.message);
        }
    }
  

    async function cancelarDetalle(idDetalle, idCabecera) {
        try {
            const pool = await poolPromise; // 🔹 Obtener el pool de conexiones
    
            // Ejecutar el procedimiento almacenado con los parámetros adecuados
            const result = await pool.request()
                .input('IDDetalle', sql.Int, idDetalle)
                .input('IDCabecera', sql.Int, idCabecera)
                .query('EXEC CancelarDetalle @IDDetalle, @IDCabecera'); // Procedimiento almacenado
    
            return result.recordset; // Retornar los resultados
        } catch (err) {
            throw new Error("Error al cancelar detalle: " + err.message); // Manejo de errores
        }
    }
    
    // 3. Finalizar un detalle
    async function finalizarDetalle(idDetalle, idCabecera) {
        try {
            const pool = await poolPromise; // 🔹 Obtener la conexión al pool
    
            // Ejecutar el procedimiento almacenado en SQL Server con parámetros
            const result = await pool.request()
                .input('IDDetalle', sql.Int, idDetalle)
                .input('IDCabecera', sql.Int, idCabecera)
                .query('EXEC FinalizarDetalle @IDDetalle, @IDCabecera');
    
            return result.recordset; // Retornar el resultado de la consulta
        } catch (err) {
            throw new Error("Error al finalizar detalle: " + err.message);
        }
    }

    async function getUltimoHoraFin (idCabecera) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('IDCabecera', sql.Int, idCabecera)
                .query(`
                    SELECT TOP 1 HoraFin
                    FROM DetalleTiempos
                    WHERE IDCabecera = @IDCabecera
                    ORDER BY HoraFin DESC
                `);
            
            return result.recordset[0]; // Devuelve el primer registro
        } catch (error) {
            throw new Error("Error al obtener el último HoraFin: " + error.message);
        }
    };

    const actualizarTiempos = async (idDetalle, idCabecera) => {
        try {
          const pool = await poolPromise;
      
          // Ejecutar el procedimiento almacenado
          const result = await pool.request()
            .input('IDDetalle', sql.Int, idDetalle)
            .input('IDCabecera', sql.Int, idCabecera)
            .query('EXEC ActualizarTiempos @IDDetalle, @IDCabecera');
      
          return result;
        } catch (err) {
          throw new Error('Error al ejecutar el procedimiento almacenado: ' + err.message);
        }
      };

module.exports = {
    insertCabecera,
    insertDetalle,
    getAllTiempos,
    getTiemposByUsuario,
    iniciarDetalle,
    cancelarDetalle,
    finalizarDetalle,
    getUltimoHoraFin,
    actualizarTiempos
};