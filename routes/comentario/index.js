const express = require("express");
const router = express.Router();

const isAuth = require("../../middlewares/isAuth");
const attachCurrentUser = require("../../middlewares/attachCurrentUser");

const ReceitaModel = require("../../models/ReceitaModel");
const UsuarioModel = require("../../models/UserModel");
const ComentarioModel = require("../../models/ComentariosModel");

//Rota para criar um comentario

router.post(
  "/criar/:receitaId",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { receitaId } = req.params;
      console.log(receitaId)
      const usuarioID = req.currentUser._id;

      const novocomentario = await ComentarioModel.create({
        ...req.body,
        autor: usuarioID,
      });
     await ReceitaModel.findByIdAndUpdate(receitaId, {
        $push: {
          comentarios: novocomentario._id,
        },
      });
      return res.status(201).json(novocomentario);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
);
// rota para editar um comentario
//rota para excluir um comentario
//rota para buscar comentarios por receita

module.exports = router;
