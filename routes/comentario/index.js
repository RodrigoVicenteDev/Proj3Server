const express = require("express");
const router = express.Router();

const isAuth = require("../../middlewares/isAuth");
const attachCurrentUser = require("../../middlewares/attachCurrentUser");

const UsuarioModel = require("../../models/UserModel");
const ComentarioModel = require("../../models/ComentariosModel");
const ReceitaModel = require("../../models/ReceitaModel");
const RespostaModel = require("../../models/respostaModel");

//Rota para criar um comentario ##########################################################

router.post(
  "/criar/:receitaId",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { receitaId } = req.params;
      console.log(receitaId);
      const usuarioID = req.currentUser._id;

      const novocomentario = await ComentarioModel.create({
        ...req.body,
        autor: usuarioID,
        receita : receitaId
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
// rota para editar um comentario ##################################################################
router.put("/editar/:id", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const {id}= req.params
    const editarcomentario = await ComentarioModel.findByIdAndUpdate(id,{...req.body},{new:true})
    return res.status(200).json(editarcomentario)
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});
//rota para popular comentarios por receita #########################################################
router.get("/popular/:idreceita", isAuth, attachCurrentUser, async (req,res)=>{
    try {
        const {idreceita} = req.params
        const comentario = await ReceitaModel.findById(idreceita).populate({
            path: "comentarios"
            
            
          });
        return res.status(200).json(comentario)
    } catch (error) {
        console.log(error);
    return res.status(400).json(error);
    }
})
//rota para excluir um comentario ######################################################################

router.delete("/deletar/:id", isAuth, attachCurrentUser, async (req,res)=>{
  try {
    const {id} = req.params
    const atualizarreceitas = await ReceitaModel.updateMany({comentarios:id}, {$pull:{comentarios:id}})
    const deletarrespostas = await RespostaModel.deleteMany({comentario:id})
    const deletarcomentario = await ComentarioModel.findByIdAndDelete(id)
    return res.status(200).json("sucesso")
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
    
  }
})

module.exports = router;
