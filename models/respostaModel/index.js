const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const RespostaSchema = new Schema({
    autor: { type: Schema.Types.ObjectId, ref: "Usuario" },
    content: { type: String, require: true, minlength: 1, maxlength: 300 },
    resposta: [{ type: Schema.Types.ObjectId, ref: "respostas" }],
},
{ timestamps: true })



const RespostaModel = mongoose.model("Resposta", RespostaSchema);

module.exports = RespostaModel;
