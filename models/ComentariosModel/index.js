const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ComentarioSchema = new Schema(
  {
    autor: { type: Schema.Types.ObjectId, ref: "Usuario" },
    content: { type: String, require: true, minlength: 1, maxlength: 300 },
    resposta: [{ type: Schema.Types.ObjectId, ref: "respostas" }],
    avaliacao: { type: Number },
  },
  { timestamps: true }
);

const ComentarioModel = mongoose.model("Comentario", ComentarioSchema);

module.exports = ComentarioModel;
