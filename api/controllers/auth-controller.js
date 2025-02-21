const { loginUser } = require("../models/auth-model");

async function signIn(req, res) {
  try {
    const { username, password } = req.body;
    const result = await loginUser(username, password);
    res.json(result);
  } catch (error) {
    console.error("Error en signIn:", error.message);
    res.status(400).json({ message: error.message });
  }
}

module.exports = { signIn };
  