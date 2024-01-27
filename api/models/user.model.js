const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username:{
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
    },
    profilePhoto:{
        type:String,
        default:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzCb4DonWw5pT1-A3Su9HzG6TTN4nMOmj7tg&usqp=CAU'
    },
    isAdmin: {
        type:Boolean,
        default:false,
    },
},{ timestamps : true })

const USER = mongoose.model('user', userSchema)

module.exports = USER