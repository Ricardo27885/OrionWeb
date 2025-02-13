const { insertOrUpdateMembresia, getAllMembresias, getMembresiaById } = require("../models/membership-model");

async function createOrUpdateMembresia(req, res) {
    try {
        const { id, idKeko, tipo, fecha_inicio } = req.body;
        console.log(req.body)

        if (!idKeko || !tipo || !fecha_inicio) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        const result = await insertOrUpdateMembresia(id, idKeko, tipo, fecha_inicio);
        res.status(200).json({ message: "Operación exitosa", data: result });
    } catch (error) {
        console.error("Error en createOrUpdateMembresia:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

async function getAllMembresia(req, res) {
    try {
        const membresias = await getAllMembresias();
        res.status(200).json(membresias); // Responde con las membresías obtenidas
    } catch (error) {
        console.error("Error al obtener todas las membresías:", error);
        res.status(500).json({ error: "Error al obtener todas las membresías" });
    }
}

// Función para obtener una membresía por ID
async function getMembresiaId(req, res) {
    const { id } = req.params;
    try {
        const membresia = await getMembresiaById(id);
        if (!membresia) {
            return res.status(404).json({ error: 'Membresía no encontrada' });
        }
        res.status(200).json(membresia); // Responde con la membresía encontrada
    } catch (error) {
        console.error(`Error al obtener la membresía con ID ${id}:`, error);
        res.status(500).json({ error: `Error al obtener la membresía con ID ${id}` });
    }
}

module.exports = { createOrUpdateMembresia, getAllMembresia, getMembresiaId };