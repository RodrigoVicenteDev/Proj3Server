const jwt = require("jsonwebtoken");

function generateToken(user) {
  const { _id, nome, email, profilePic } = user;

  const signature = process.env.TOKEN_SIGN_SECRET;

  const expiration = "5h";

  return jwt.sign({ _id, nome, email, profilePic }, signature, {
    expiresIn: expiration,
  });
}

module.exports = generateToken;
