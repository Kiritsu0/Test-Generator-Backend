const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Logging in Now")
  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are Required" });
  }

  // Find user by email
  const user = await User.findOne({ email: email }).exec();
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" }); // Unauthorized
  }

  // Compare password
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (matchedPassword) {
    // Generate accessToken
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Generate refreshToken
    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Send refreshToken in a cookie
    // res.cookie("jwt", refreshToken, {
    //   httpOnly: true,
    //   secure: false, // Secure cookie for production
    //   sameSite: "None",
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // });

    res.status(200).json({
      message: "Login successful",
      status: "success",
      accessToken, // Send access token in response body
      refreshToken,
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { login };