const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
  nome: { type: String, require: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  receitas: [{ type: Schema.Types.ObjectId, ref: "Receita" }],
  comentarios: [{ type: Schema.Types.ObjectId, ref: "Comentario" }],
  resposta: [{ type: Schema.Types.ObjectId, ref: "Resposta" }],
  passwordHash: { type: String, required: true },
  emailConfirm: { type: Boolean, default: false },
  profilePic: {
    type: String,
    default:
      "https://toppng.com/uploads/preview/instagram-default-profile-picture-11562973083brycehrmyv.png",
  },
});


const UsuarioModel = mongoose.model("Usuario", UsuarioSchema)
module.exports = UsuarioModel