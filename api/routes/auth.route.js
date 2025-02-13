const express = require("express");
const router = express.Router();
const { signIn } = require("../controllers/auth-controller");
const verifyToken = require('../middlewares/authMiddleware');

router.post("/signIn", signIn);

router.get('/profile', verifyToken, (req, res) => {
    res.json({
        message: 'Acceso a perfil autorizado',
        user: req.user // Información del usuario del token
    });
});

module.exports = router;