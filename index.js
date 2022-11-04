const express = require("express");
require("dotenv").config();
const cors = require("cors");
const dbConection = require("./config/db.config");
dbConection();
const fastify = require("fastify")({ logger: true });

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.REACT_APP_URI }));

const UsuarioRoute = require("./routes/usuario");
app.use("/usuario", UsuarioRoute);

const ReceitaRoute = require("./routes/receita");
app.use("/receita", ReceitaRoute);

const ComentarioRoute = require("./routes/comentario");
app.use("/comentario", ComentarioRoute);

const RespostaRoute = require("./routes/resposta");
app.use("/resposta", RespostaRoute);

const UploadRoute = require("./routes/upload/index");
app.use("/", UploadRoute);

const start = async () => {
  try {
    await fastify.listen(8080, "0.0.0.0");
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

/* app.listen(process.env.PORT, () => {
  console.log("SERVER OPEN AND RUNNING ON PORT");
});
 */
