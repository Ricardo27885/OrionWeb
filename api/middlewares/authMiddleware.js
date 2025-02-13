const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const token = req.header("headers");

    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. No hay token." });
    }

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: "Token no válido" });
    }
}

module.exports = verifyToken;