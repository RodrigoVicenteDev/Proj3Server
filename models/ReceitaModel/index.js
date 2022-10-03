const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReceitaSchema = new Schema({
  autor: { type: Schema.Types.ObjectId, ref: "Usuario" },
  imagemurl: {
    type: String,
    default:
      "https://img.elo7.com.br/product/zoom/258B7CB/adesivo-parede-restaurante-prato-feito-comida-caseira-lenha-adesivo-restaurante-fritas-salada.jpg",
  },
  imagemupload: { type: String },
  nome: { type: String, require: true },
  tempo: { type: Number, require: true },
  feito: { type: Number },
  categoria: {
    type: String,
    enum: [
      "Acompanhamentos e Entradas",
      "Arroz e Risotos",
      "Bolos e Tortas Doces",
      "Carne Suína",
      "Carnes",
      "Frangos e Aves",
      "Lanches,",
      "Massas",
      "Peixes e Frutos do Mar",
      "Sobremesas",
      "Sopas",
    ],
  },
  dificuldade: {
    type: String,
    enum: ["facil", "medio", "dificil"],
    require: true,
  },
  porcoes: { type: Number, require: true },
  ingredientes: [{ type: String, require: true }],
  preparo: [{ type: String, require: true }],
  comentarios: [{ type: Schema.Types.ObjectId, ref: "Comentarios" }],
  favoritos: { type: Number },
});

const ReceitaModel = mongoose.model("Receita", ReceitaSchema);

module.exports = ReceitaModel;
