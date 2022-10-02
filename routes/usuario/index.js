const express = require("express");
const router = express.Router();
const UserModel = require("../../models/UserModel/index");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const generateToken = require("../../config/jwt.config");

// rota de sign-Up ##################################################################

router.post("/signup", async (req, res) => {
  try {
    const { password, email } = req.body;
    if (
      !password ||
      !password.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#_!])[0-9a-zA-Z$*&@#_!]{8,}$/
      )
    ) {
      return res
        .status(400)
        .json({ message: "Senha não atende os requisitos de segurança" });
    }

    const salt = await bcrypt.genSalt(saltRounds);

    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      ...req.body,
      passwordHash: passwordHash,
    });
    delete newUser._doc.passwordHash;
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(400).json(error);
  }
});

// rota de LogIN ###################################################################

 router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Por favor, informe seu email e senha." });
    }

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Usuário não cadastrado" });
    }
    if (await bcrypt.compare(password, user.passwordHash)) {
      delete user._doc.passwordHash;
      const token = generateToken(user);
      return res.status(200).json({
        token: token,
        user: user,
      });
    } else {
      return res.status(400).json({ message: "Senha ou email incorretos" });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
}); 



module.exports = router;
