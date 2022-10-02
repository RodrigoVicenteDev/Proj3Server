const express = require("express");
require("dotenv").config();
const cors = require("cors");
const dbConection = require("./config/db.config");
dbConection ();
const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.REACT_APP_URI }));


const UsuarioRoute = require("./routes/usuario");
app.use("/usuario", UsuarioRoute);

const ReceitaRoute = require("./routes/receita");
app.use("/receita", ReceitaRoute);

const ComentarioRoute = require("./routes/comentario");
app.use("/comentario", ComentarioRoute);

const RespostaRoute = require("./routes/Resposta");
app.use("/resposta", RespostaRoute);





app.listen(process.env.PORT, () => {
  console.log("SERVER OPEN AND RUNNING ON PORT");
});
