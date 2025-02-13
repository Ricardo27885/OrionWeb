const express = require("express");
const router = express.Router();
const { createOrUpdateMembresia, getAllMembresia, getMembresiaId } = require("../controllers/membership-controller");

router.post("/membership", createOrUpdateMembresia); // Endpoint para insertar o actualizar
router.get('/membership', getAllMembresia);
router.get('/membership/:id', getMembresiaId);

module.exports = router;