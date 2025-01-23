const jwt = require("jsonwebtoken");

// verifyToken (middleware)
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token from the header

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Unauthorized: Invalid token" });
    }

    // Attach the decoded user information to the request object
    req.userId = decoded.userId;
    next();
  });
};

module.exports = { verifyJWT };
