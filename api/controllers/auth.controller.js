const USER = require("../models/user.model");
const bycryptjs = require("bcryptjs");
const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return res.status(400).json({ msg: "All fields are required" });
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
    res.status(500).json({msg: error.message})
  }
};

module.exports = {
  signup,
};
