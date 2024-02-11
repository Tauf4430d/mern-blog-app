const mongoose = require('mongoose')


const commentSchem = new mongoose.Schema({
  content: {
    type:String,
    required:true,
  },
  postId: {
    type:String, 
    required:true,
  },
  userId: {
    type:String,
    required:true,
  },
  likes: {
    type:Array,
    default: [],
  },
  numberOfLikes: {
    type:Number,
    default: 0,
  },
}, { timestamps: true })

const COMMENT = mongoose.model('comment', commentSchem)

module.exports = COMMENT