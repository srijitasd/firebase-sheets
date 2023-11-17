const { signupUser, signinUser, editUser } = require("../controller/user.controller");

const Router = require("express").Router();

Router.post("/signup", signupUser);
Router.post("/signin", signinUser);
Router.patch("/edit", editUser);

module.exports = Router;
