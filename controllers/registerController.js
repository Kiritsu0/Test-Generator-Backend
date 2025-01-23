const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register a new user
const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are Required" });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email: email }).exec();
  if (userExists) {
    return res.status(409).json({ message: "Account already exists" }); // Conflict
  }

  try {
    // Create new user
    const newUser = await User.create({
      email: email,
      password: password,
    });

    // Generate accessToken
    const accessToken = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Generate refreshToken
    const refreshToken = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // // Send refreshToken in a cookie
    // res.cookie("jwt", refreshToken, {
    //   httpOnly: true,
    //   secure: false, // Secure cookie for production
    //   sameSite: "None",
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // });

    res.status(201).json({
      status: "success",
      message: `User created successfully`,
      accessToken, // Send access token in response body
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
};

module.exports = { register };