const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ComentarioSchema = new Schema(
  {
    autor: { type: Schema.Types.ObjectId, ref: "Usuario" },
    content: { type: String, require: true, minlength: 1, maxlength: 300 },
    receita: { type: Schema.Types.ObjectId, ref: "Receita" },
    resposta: [{ type: Schema.Types.ObjectId, ref: "respostas" }],
    avaliacao: { type: String },
  },
  { timestamps: true }
);

const ComentarioModel = mongoose.model("Comentarios", ComentarioSchema);

module.exports = ComentarioModel;
