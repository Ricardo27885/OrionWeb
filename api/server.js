const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Importar CORS
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user-route");
const KekoRoutes = require('./routes/kekos-route');
const timeRoutes = require("./routes/times-route");
const membershipRoutes = require("./routes/membership-route");
const verifyToken = require("./middlewares/authMiddleware");


const app = express();

// Habilitar CORS para permitir acceso desde cualquier origen
app.use(cors());

// Middleware para procesar JSON
app.use(bodyParser.json());
app.use(express.json());

// Rutas
app.use("/api", authRoutes);
app.use("/api", verifyToken, userRoutes);
app.use('/api/kekos', verifyToken, KekoRoutes);
app.use("/api", verifyToken, timeRoutes);
app.use("/api", verifyToken, membershipRoutes);


// Configurar puerto
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`Servidor activo en: http://localhost:${PORT}`);
// });

const PORT = 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor activo en: http://0.0.0.0:${PORT}`);
});









