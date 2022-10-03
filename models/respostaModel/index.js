const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const RespostaSchema = new Schema({
    autor: { type: Schema.Types.ObjectId, ref: "Usuario" },
    content: { type: String, require: true, minlength: 1, maxlength: 300 },
    comentario: { type: Schema.Types.ObjectId, ref: "Comentario" },
    receita: { type: Schema.Types.ObjectId, ref: "Receita" },

    resposta: [{ type: Schema.Types.ObjectId, ref: "Resposta" }],
},
{ timestamps: true })



const RespostaModel = mongoose.model("Resposta", RespostaSchema);

module.exports = RespostaModel;
