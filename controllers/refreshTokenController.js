const jwt = require("jsonwebtoken");

// Refresh Token
const refreshToken = (req, res) => {
  // const cookies = req.cookies;
  // if (!cookies?.jwt) {
  //   return res.sendStatus(401);
  // }
  // const refreshToken = cookies?.jwt;
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    req.status(400).json({message: "Refresh token not found"})
  }

  jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }

    // Issue a new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ accessToken: newAccessToken });
  });
};

module.exports = { refreshToken };