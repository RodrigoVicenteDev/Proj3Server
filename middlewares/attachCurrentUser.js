const UserModel = require("../models/User.model");
const UsuarioModel = require("../models/UserModel");

async function attachCurrentUser(req, res, next){
    try {
        const loggedInUser = req.auth
        const user = await UsuarioModel.findById(loggedInUser._id,{
            passwordHash: 0,
        })

        req.currentUser = user;

    next();
        
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}
module.exports = attachCurrentUser;