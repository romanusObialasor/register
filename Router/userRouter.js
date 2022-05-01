const express = require("express");
const {
  register,
  login,
  getAll,
  getUser,
  verify,
} = require("../Controller/userController");

const userRouter = express.Router();

userRouter.post("/register", register);

userRouter.post("/login", login);

userRouter.get("/users", verify, getAll);

userRouter.get("/user/:id", verify, getUser);

module.exports = userRouter;
