const KekoModel = require('../models/kekos-model');

class KekoController {
    static async getAll(req, res) {
        try {
            // Asegúrate de que el modelo esté correctamente configurado
            const kekos = await KekoModel.getAll(); // Esto debería devolver los datos
            if (!kekos || kekos.length === 0) {
                // Si no hay datos, retorna un 404
                return res.status(404).json({ message: 'No se encontraron Kekos' });
            }
            res.json(kekos); // Responde con los datos
        } catch (error) {
            // Si hay un error en la base de datos o el modelo, responde con un 500 y un mensaje de error
            console.error("Error al obtener los Kekos:", error); // Puedes ver el error en la consola para depuración
            res.status(500).json({ message: 'Error al obtener los Kekos', error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const { idKeko } = req.params;
            const keko = await KekoModel.getById(idKeko);
    
            if (!keko) {
                return res.status(404).json({ message: 'Keko no encontrado' });
            }
    
            res.json(keko);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el Keko', error });
        }
    }

    static async searchKekos(req, res) {
        try {
            const { search } = req.query;  // Obtenemos el término de búsqueda desde los parámetros de la query
            const kekos = await KekoModel.getKekosByName(search);  // Llamamos al modelo para obtener los resultados
            res.json(kekos);  // Retornamos los resultados como respuesta en formato JSON
        } catch (error) {
            console.error("Error al obtener Kekos:", error);
            res.status(500).json({ error: "Error al obtener Kekos." });  // En caso de error, respondemos con un código 500
        }
    }

    static async create(req, res) {
        try {
            const { nombre } = req.body;
            console.log(nombre)
            if (!nombre) {
                return res.status(400).json({ message: 'El nombre es requerido' });
            }
            const idKeko = await KekoModel.create(nombre);
            res.status(201).json({ message: 'Keko creado', idKeko });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el Keko', error });
        }
    }

    static async update(req, res) {
        try {
            const { idKeko } = req.params;
            const { nombre } = req.body;

            if (!nombre) {
                return res.status(400).json({ message: 'El nombre es requerido' });
            }

            const updatedRows = await KekoModel.update(idKeko, nombre);
            if (updatedRows === 0) {
                return res.status(404).json({ message: 'Keko no encontrado' });
            }

            res.json({ message: 'Keko actualizado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el Keko', error });
        }
    }
}

module.exports = KekoController;