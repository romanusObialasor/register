const userModel = require("../Model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const res = require("express/lib/response");

// register a user with name, email and password

const register = async (req, res) => {
  try {
    const email = await userModel.findOne({ email: req.body.email });

    if (email) {
      res.status(500).json({
        data: "email already exist",
      });
    }

    const password = req.body.password;

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    const data = await userModel.create({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
    });
    res.status(200).json({
      msg: "data created successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

// login with email and password

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkForEmail = await userModel.findOne({ email });
    if (checkForEmail) {
      const checkForPassword = await bcrypt.compare(
        password,
        checkForEmail.password
      );

      if (checkForPassword) {
        const { password, ...info } = checkForEmail._doc;
        const token = jwt.sign(
          {
            _id: checkForEmail._id,
            email: checkForEmail.email,
            isAdmin: checkForEmail.isAdmin,
          },
          process.env.token,
          { expiresIn: "30min" }
        );
        res.status(200).json({
          message: "users login in successfully",
          data: { ...info, token },
        });
      } else {
        res.status(400).json({ message: `Your password is incorrect` });
      }
    } else {
      res.status(400).json({ message: `Email not found` });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// verify userModel

const verify = async (req, res, next) => {
  try {
    const authCheck = await req.headers.authorization;

    if (authCheck) {
      const token = await authCheck.split(" ")[1];

      jwt.verify(token, process.env.token, (error, payload) => {
        if (error) {
          res.status(400).json({ message: error.message });
        } else {
          req.user = payload;
          next();
        }
      });
    } else {
      res.status(500).json({
        message: "either your token has expired or your don't have a token",
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// to use the get method include your token authorization in your header

//get all users

const getAll = async (req, res) => {
  try {
    const data = await userModel.find();
    res.status(200).json({
      message: "all data found successflly",
      data: data,
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// get a user

const getUser = async (req, res) => {
  try {
    const data = await userModel.findById(req.params.id);
    res.status(200).json({
      message: "user data found successflly",
      data: data,
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
  getAll,
  getUser,
  verify,
};
