// Logout user
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); // No Content
  }

  // Clear the cookies
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: false, // Secure cookie for production
  });

  res.sendStatus(204);
};

module.exports = { logout };