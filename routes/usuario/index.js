const express = require("express");
const router = express.Router();
const UsuarioModel = require("../../models/UserModel/index");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const generateToken = require("../../config/jwt.config");

const isAuth = require("../../middlewares/isAuth");
const attachCurrentUser = require("../../middlewares/attachCurrentUser");
const { route } = require("../receita");
const ReceitaModel = require("../../models/ReceitaModel");
const ComentarioModel = require("../../models/ComentariosModel");
const RespostaModel = require("../../models/respostaModel");

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

    const newUser = await UsuarioModel.create({
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

    const user = await UsuarioModel.findOne({ email: email });
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

// Rota para editar usuario ###############################################################

router.put("/editar", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;

    const editarusuario = await UsuarioModel.findByIdAndUpdate(
      loggedInUser._id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    delete editarusuario._doc.passwordHash;
    return res.status(200).json(editarusuario);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Rota para consultar todos os usuario ###############################################################

router.get("/todos", async (req, res) => {
  try {
    const todos = await UsuarioModel.find();

    return res.status(200).json(todos);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Rota para buscar usuario pelo ID #####################################################################

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await UsuarioModel.findById(id);
    return res.status(200).json(usuario);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Rota para buscar o current user #####################################################################

router.get("/usuario/logado", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const usuariologado = req.currentUser;

    const usuario = await UsuarioModel.findById(usuariologado._id).populate({path:"receitas"});
    return res.status(200).json(usuario);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Rota para deletar Usuario ##########################################################################
router.delete("/deletar", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const user = req.currentUser._id;
    const deletarUsuarui = await UsuarioModel.findByIdAndDelete(user);
    const deletarReceita = await ReceitaModel.deleteMany({ autor: user });
    const deletarComentario = await ComentarioModel.deleteMany({ autor: user });
    const deleteRespostas = await RespostaModel.deleteMany({ autor: user });
    return res.status(204).json("Usuario excluido com sucesso");
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

module.exports = router;
