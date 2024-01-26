const { errorHandler } = require("../utils/error")
const bcryptjs = require('bcryptjs')
const USER = require('../models/user.model')
const test = (req, res) => {
    res.json({msg: "hello world"})
}
const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this user'))
    }
    if(req.body.password) {
        if(req.body.password.length < 6) {
            return next(errorHandler(400, "Password must be atleast 6 characters"))
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }
    if(req.body.username) {
        
        if(req.body.username.length < 7 || req.body.username.length > 20 ) {
            return next(errorHandler(400, "Username must be between 7 and 20 characters"))
        }
        if(req.body.username != req.body.username.toLowerCase()) {
            return next(errorHandler(400, "Username must be lowercase"))
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(400, "Username can only contain letters and numbers"))
        }
        try {
            const updateUser = await USER.findByIdAndUpdate(req.params.userId, {
                $set: {
                    username:req.body.username,
                    email:req.body.email,
                    profilePhoto:req.body.profilePhoto,
                    password:req.body.password
                },
            }, {new : true})
            const { password, ...rest } = updateUser._doc
            res.status(200).json(rest)
        }catch(error) {

        }
    }
    
}
module.exports = {
    test,
    updateUser
}