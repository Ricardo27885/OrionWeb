const express = require("express");
const router = express.Router();
const { createOrUpdateMembresia, getAllMembresia, getMembresiaId } = require("../controllers/membership-controller");
const verifyToken = require("../middlewares/authMiddleware");

router.post("/membership", createOrUpdateMembresia); // Endpoint para insertar o actualizar
router.get('/membership', verifyToken, getAllMembresia);
router.get('/membership/:id', getMembresiaId);

module.exports = router;