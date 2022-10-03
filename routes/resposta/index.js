const express = require("express");
const router = express.Router();

const isAuth = require("../../middlewares/isAuth");
const attachCurrentUser = require("../../middlewares/attachCurrentUser");

const UsuarioModel = require("../../models/UserModel");
const ComentarioModel = require("../../models/ComentariosModel");
const ReceitaModel = require("../../models/ReceitaModel");
const RespostaModel = require("../../models/respostaModel");


// Rota criar resposta ###############################################################################################
router.post(
  "/criar/:comentarioID",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { comentarioID } = req.params;

      const usuarioID = req.currentUser._id;

      const novaresposta = await RespostaModel.create({
        ...req.body,
        autor: usuarioID,
        comentario: comentarioID,
      });
      await ComentarioModel.findByIdAndUpdate(comentarioID, {
        $push: {
          resposta: novaresposta._id,
        },
      });
      return res.status(201).json(novaresposta);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
);

// rota para editar uma resposta ##################################################################
router.put("/editar/:id", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const { id } = req.params;
    const respostaeditada = await RespostaModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).json(respostaeditada);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});
//rota para popular respostas por  #########################################################
router.get(
  "/popular/:idcomentario",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { idcomentario } = req.params;
      const respostas = await ComentarioModel.findById(idcomentario).populate(
        "respostas"
      );
      return res.status(200).json(respostas);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
);
//rota para excluir um comentario ######################################################################

router.delete("/deletar/:id", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const { id } = req.params;
    const atualizarcomentario = await ComentarioModel.updateMany(
      { resposta: id },
      { $pull: { resposta: id } }
    );
    const deletarresposta = await RespostaModel.findOneAndDelete(id);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

module.exports = router;
