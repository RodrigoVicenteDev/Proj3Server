const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReceitaSchema = new Schema({
  autor: { type: Schema.Types.ObjectId, ref: "Usuario" },
  imagemurl: {type:String},
  imagemupload:{type:String},
  nome: { type: String, require: true },
  tempo: { type: Number, require: true },
  feito: { type: Number },
  dificuldade: {
    type: String,
    enum: ["facil", "medio", "dificil"],
    require: true,
  },
  porcoes: { type: String, require: trus },
  ingredientes: [{ type: String, require: true }],
  preparo: [{ type: String, require: true }],
  comentarios: [{ type: Schema.Types.ObjectId, ref: "Comentarios" }],
  favoritos: {type:Number},
});

const ReceitaModel = mongoose.model("Receita", ReceitaSchema);

module.exports = ReceitaModel
