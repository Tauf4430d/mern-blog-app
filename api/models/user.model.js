const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    usename:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
},{ timestamps : true })

const USER = mongoose.model('user', userSchema)

module.exports = USER