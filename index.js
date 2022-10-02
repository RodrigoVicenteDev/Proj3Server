const express = require("express");
require("dotenv").config();
const cors = require("cors");
const dbConection = require("./config/db.config");
dbConection ();
const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.REACT_APP_URI }));









app.listen(process.env.PORT, () => {
  console.log("SERVER OPEN AND RUNNING ON PORT");
});
