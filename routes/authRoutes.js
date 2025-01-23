const express = require("express");
const router = express.Router();
const { register } = require("../controllers/registerController");
const { login } = require("../controllers/loginController");
const { logout } = require("../controllers/logoutController");
const { verifyJWT } = require("../middleware/verifyJWT");
const { refreshToken } = require("../controllers/refreshTokenController");

// Define routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyJWT, logout);
router.post("/refreshToken", refreshToken);
router.get('/verifyJWT', verifyJWT, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});


module.exports = router;
