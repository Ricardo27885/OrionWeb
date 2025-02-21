const express = require("express");
const router = express.Router();
const timeController = require("../controllers/times-controller");
const verifyToken = require("../middlewares/authMiddleware"); // Middleware para JWT

router.post("/time", timeController.createTime);
router.get("/time/all/:idUsuario", timeController.getAll);
router.get("/time/:idUsuario", timeController.getByUsuario);
router.post('/time/iniciar', timeController.iniciarDetalles);
router.delete('/time/cancelar/:idDetalle/:idCabecera', timeController.cancelarDetalles);
router.put('/time/finalizar/:idDetalle/:idCabecera', timeController.finalizarDetalles);
router.get('/time/ultimoHoraFin/:idCabecera', verifyToken, timeController.obtenerUltimoHoraFin);
router.put('/time/actualizar/:idDetalle/:idCabecera', timeController.actualizarTiemposController);


module.exports = router;