const express = require("express");
const router = express.Router();
const {getAllUsers, createUser,  } = require("../controllers/user-controller");

router.get('/usuarios', getAllUsers);
router.post("/usuarios", createUser);


module.exports = router;