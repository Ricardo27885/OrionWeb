const express = require("express");
const router = express.Router();
const { signIn } = require("../controllers/auth-controller");
const verifyToken = require('../middlewares/authMiddleware');

router.post("/signIn", signIn);


module.exports = router;