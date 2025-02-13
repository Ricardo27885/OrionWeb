const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Importar CORS
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user-route");
const KekoRoutes = require('./routes/kekos-route');
const timeRoutes = require("./routes/times-route");
const membershipRoutes = require("./routes/membership-route");

const app = express();

// Habilitar CORS para permitir acceso desde cualquier origen
app.use(cors());

// Middleware para procesar JSON
app.use(bodyParser.json());
app.use(express.json());

// Rutas
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use('/api/kekos', KekoRoutes);
app.use("/api", timeRoutes);
app.use("/api", membershipRoutes);

// Configurar puerto
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor activo en: http://localhost:${PORT}`);
});









