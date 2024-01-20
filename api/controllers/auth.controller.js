const USER = require("../models/user.model");
const bycryptjs = require("bcryptjs");
const {errorHandler} = require('../utils/error.js')
const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All the fields are Required"))
  }
  const hashedPassword = bycryptjs.hashSync(password, 10);
  const user = new USER({
    username,
    email,
    password: hashedPassword,
  });
  try {
    await user.save();
    console.log(user);
    res.json("Signup Successful");
  } catch (error) {
    next(error)
  }
};

module.exports = {
  signup,
};
