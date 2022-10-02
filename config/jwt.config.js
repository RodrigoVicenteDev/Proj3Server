const jwt = require("jsonwebtoken");

function generateToken(user) {
  const { _id, nome, email } = user;

  const signature = process.env.TOKEN_SIGN_SECRET;

  const expiration = "5h";

  return jwt.sign({ _id, nome, email }, signature, { expiresIn: expiration });
}

module.exports = generateToken;
