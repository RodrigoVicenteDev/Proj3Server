const express = require("express");
const router = express.Router();

const isAuth = require("../../middlewares/isAuth");
const attachCurrentUser = require("../../middlewares/attachCurrentUser");

const ReceitaModel = require("../../models/ReceitaModel");
const UsuarioModel = require("../../models/UserModel");
const ComentarioModel = require("../../models/ComentariosModel");
const RespostaModel = require("../../models/respostaModel");

// Roda de criação receita ##############################################################

router.post("/criar", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const autorId = req.currentUser._id;
    const novaReceita = await ReceitaModel.create({
      ...req.body,
      autor: autorId,
    });

    await UsuarioModel.findByIdAndUpdate(
      autorId,
      { $push: { receitas: novaReceita._id } },
      { new: true }
    );

    return res.status(201).json(novaReceita);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// rota Buscar todas as receitas #################################################

router.get("/todas", async (req, res) => {
  try {
    const receitas = await ReceitaModel.find().populate({
      path: "autor",
      select: "nome",
    });
    return res.status(200).json(receitas);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});
//Rota buscar receita by ID ######################################################
router.get("/busca/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const receitas = await ReceitaModel.findById(id).populate({
      path: "autor",
      select: "nome",
    });
    return res.status(200).json(receitas);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});
// Rota Editar receita ###########################################################
router.put("/editar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const receita = await ReceitaModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    return res.status(200).json(receita);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});
// Rota adicionar aos Favoritos ##################################################

router.put(
  "/favoritos/adicionar/:id",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const usuario = req.currentUser._id;
      const { id } = req.params;

      const receitafavoritada = await ReceitaModel.findByIdAndUpdate(
        id,
        { $inc: { favoritos: +1 } },
        { new: true }
      );
      await UsuarioModel.findByIdAndUpdate(usuario, {
        $push: { favoritas: id },
      });
      return res.status(200).json(receitafavoritada);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
);
//Rota excluir dos favoritos #####################################################
router.put(
  "/favoritos/excluir/:id",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const usuario = req.currentUser._id;
      const { id } = req.params;

      const receitafavoritada = await ReceitaModel.findByIdAndUpdate(
        id,
        { $inc: { favoritos: -1 } },
        { new: true }
      );
      await UsuarioModel.findByIdAndUpdate(usuario, {
        $pull: { favoritas: id },
      });
      return res.status(200).json(receitafavoritada);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
);
//Rota deletar receita ###########################################################
router.delete("/deletar/:id", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const user = req.currentUser._id;
    const { id } = req.params;

    // excluir a receita das arrays de favoritos dos usuarios

    const delfavoritos = await UsuarioModel.updateMany({
      $pull: { favoritas: id },
    });

    const deletarReceita = await ReceitaModel.findByIdAndDelete(id);

    const atualizarusuariosrec = await UsuarioModel.findByIdAndUpdate(user, {
      $pull: { receitas: deletarReceita._id },
    });

    const comentarios = await ComentarioModel.find({ receita: id });

    comentarios.forEach(async (comentario) => {
      comentario.resposta.forEach(async (element) => {
        await RespostaModel.findByIdAndDelete(element._id);
      });
    });

    const deletarcomentario = await ComentarioModel.deleteMany({ receita: id });

    return res.status(200).json("Sucesso");
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

module.exports = router;
