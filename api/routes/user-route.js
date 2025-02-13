const express = require("express");
const router = express.Router();
const {getAllUsers, getUserById, createUser, updateUser } = require("../controllers/user-controller");

router.get('/usuarios', getAllUsers);
router.get('/usuarios/:idUsuario', getUserById);
router.post("/usuarios", createUser);
router.put("/usuarios", updateUser);

module.exports = router;