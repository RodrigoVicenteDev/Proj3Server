const mongoose = require("mongoose");

async function connect() {
  try {
    const dbConnection = await mongoose.connect(process.env.MONGODB_URI);
    console.log("CONECTADO AO DB", dbConnection.connection.name);
  } catch (error) {
    console.log(error);
  }
}


module.exports = connect