const { insertCabecera,
        getAllTiempos,
        getTiemposByUsuario,
        iniciarDetalle,
        cancelarDetalle,
        finalizarDetalle,
        getUltimoHoraFin,
        actualizarTiempos
 } = require("../models/times-model");

// Endpoint para iniciar un tiempo
async function createTime(req, res) {
    try {
        const { idKeko, idUsuario } = req.body;

        // 🔍 Verificar que los datos requeridos estén presentes
        if (!idKeko || !idUsuario) {
            return res.status(400).json({ error: "Faltan datos obligatorios (idKeko o idUsuario)." });
        }

        console.log("Datos recibidos:", req.body);

        // 🔹 Insertar la cabecera
        const resultado = await insertCabecera(idKeko, idUsuario);

        if (resultado.mensaje) {
            return res.status(400).json({ error: resultado.mensaje }); // ❌ Enviar mensaje de error al frontend
        }

        res.status(201).json({ idCabecera: resultado.idCabecera }); // ✅ Si se insertó, devolver el ID

    } catch (error) {
        console.error("❌ Error en createTime:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
}


    // Obtener todos los tiempos de hoy
    async function getAll(req, res) {
      try {
        const tiempos = await getAllTiempos();
        res.status(200).json(tiempos);
      } catch (error) {
        res.status(500).json({ message: "Error al obtener los tiempos", error });
      }
    }

    async function getByUsuario(req, res) {
        try {
          const { idUsuario } = req.params;
          if (!idUsuario) {
            return res.status(400).json({ message: "El ID de usuario es requerido" });
          }
    
          const tiempos = await getTiemposByUsuario(idUsuario);
          res.status(200).json(tiempos);
        } catch (error) {
          res.status(500).json({ message: "Error al obtener los tiempos por usuario", error });
        }
      }

      async function iniciarDetalles(req, res){
        const { idCabecera, descripcion, horaInicio } = req.body;
        
    
        if (!idCabecera || !descripcion || !horaInicio) {
            return res.status(400).json({ message: "Faltan parámetros requeridos." });
        }

        try {
            const result = await iniciarDetalle(idCabecera, descripcion, horaInicio);
            return res.status(200).json({ message: "Detalle iniciado con éxito", result });
        } catch (err) {
            return res.status(500).json({ message: "Error al iniciar detalle", error: err.message });
        }
    };
    
    // 2. Endpoint para cancelar un detalle
    async function cancelarDetalles (req, res) {
        const { idDetalle, idCabecera } = req.params;
    
        if (!idDetalle || !idCabecera) {
            return res.status(400).json({ message: "Faltan parámetros requeridos." });
        }
    
        try {
            const result = await cancelarDetalle(idDetalle, idCabecera);
            return res.status(200).json({ message: "Detalle cancelado con éxito", result });
        } catch (err) {
            return res.status(500).json({ message: "Error al cancelar detalle", error: err.message });
        }
    };
    
    // 3. Endpoint para finalizar un detalle
    async function finalizarDetalles(req, res)  {
        const { idDetalle, idCabecera } = req.params;
    
        if (!idDetalle || !idCabecera) {
            return res.status(400).json({ message: "Faltan parámetros requeridos." });
        }
    
        try {
            const result = await finalizarDetalle(idDetalle, idCabecera);
            return res.status(200).json({ message: "Detalle finalizado con éxito", result });
        } catch (err) {
            return res.status(500).json({ message: "Error al finalizar detalle", error: err.message });
        }
    };

    async function obtenerUltimoHoraFin  (req, res){
        const { idCabecera } = req.params;
    
        if (!idCabecera) {
            return res.status(400).json({ message: 'Falta el parámetro IDCabecera.' });
        }
    
        try {
            const ultimoHoraFin = await getUltimoHoraFin(idCabecera);
            
            if (ultimoHoraFin) {
                return res.status(200).json({ HoraFin: ultimoHoraFin.HoraFin });
            } else {
                return res.status(404).json({ message: 'No se encontró ningún detalle para la IDCabecera proporcionada.' });
            }
        } catch (err) {
            return res.status(500).json({ message: 'Error al obtener el último HoraFin.', error: err.message });
        }
    };

    const actualizarTiemposController = async (req, res) => {
        const { idDetalle, idCabecera } = req.params;
      
        try {
          const result = await actualizarTiempos(idDetalle, idCabecera);
      
          if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Detalle no encontrado o no se pudo actualizar' });
          }
      
          return res.status(200).json({
            message: 'Horas actualizadas correctamente',
            result: result.recordset
          });
        } catch (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error interno del servidor' });
        }
      };

module.exports = {
    createTime,
    getAll,
    getByUsuario,
    iniciarDetalles,
    cancelarDetalles,
    finalizarDetalles,
    obtenerUltimoHoraFin,
    actualizarTiemposController
};
