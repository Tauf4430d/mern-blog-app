const USER = require("../models/user.model");
const bycryptjs = require("bcryptjs");
const {errorHandler} = require('../utils/error.js')
const jwt = require('jsonwebtoken')
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
    res.json("Signup Successful");
  } catch (error) {
    next(error)
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body
    if(!email || !password ||  email === '' || password === '') {
      next(errorHandler(400, "All fields are required"))
    }
    try {
      const user = await USER.findOne({email})
      if(!user) {
        return next(errorHandler(404, "Invalid Username or Password"))
      }
      const validPassword = bycryptjs.compareSync(password, user.password)
      if(!validPassword) {
        return next(errorHandler(400, "Invalid Username or Password"))
      }
      const token = jwt.sign({
        id:user._id, isAdmin: user.isAdmin,
      }, process.env.JWT_SECRET)
      const {password : pass, ...rest} = user._doc
      res.status(200).cookie('access_token', token, {
        httpOnly : true
      }).json(rest)
    } catch (error) {
      next(error)
    }
}

const google = async (req, res, next) => {
  const { username, email, googlePhotoUrl } = req.body
  try {
    const user =await USER.findOne({email})
    if(user) {
      const token = jwt.sign({id: user._id, isAdmin : user.isAdmin} ,process.env.JWT_SECRET)
      const { password, ...rest } = user._doc
      res.status(200).cookie("access-token", token,  {
        httpOnly:true,
      }).json(rest)
    }else{
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
      const hashedPassword = bycryptjs.hashSync(generatedPassword,10)
      const validUser = new USER({
        username : username.toLowerCase().split(' ').join('') +Math.random().toString(9).slice(-4),
        email,
        password:hashedPassword,
        profilePicture:googlePhotoUrl,
      })
      await validUser.save()
      const token = jwt.sign({id:validUser._id, isAdmin: validUser.isAdmin}, process.env.JWT_SECRET)
      const { password, ...rest } = validUser._doc
      res.status(200).cookie('access-token', token, {
        httpOnly:true,
      }).json(rest)
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  signup,
  signin,
  google,
};