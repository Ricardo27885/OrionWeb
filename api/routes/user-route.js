const express = require("express");
const router = express.Router();
const {getAllUsers, getUserById, createUser, updateUser } = require("../controllers/user-controller");

router.get('/usuarios', getAllUsers);
router.post("/usuarios", createUser);


module.exports = router;