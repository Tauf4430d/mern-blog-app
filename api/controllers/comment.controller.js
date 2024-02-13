const { errorHandler } = require("../utils/error")
const COMMENT = require('../models/comment.model')
const createComment = async(req, res, next) => {
  try {
    const { content, postId, userId} = req.body

    if(userId !== req.user.id) {
      return next(errorHandler(403, "You are not allowe dto create this comment"))
    }
    const newComment = new COMMENT({
      content,
      postId,
      userId,
    })
    await newComment.save()
    await res.status(200).json(newComment)
  } catch (error) {
    next(error)
  }
}

const getPostComments = async (req, res, next) => {
  try {
    const comments = await COMMENT.find({ postId: req.params.postId}).sort({
      createdAt: -1,
    })
    res.status(200).json(comments)
  } catch (error) {
    next(error)
  }
}

const likeComment = async (req, res, next) => {
  try {
    const comment = await COMMENT.findById(req.params.commentId)
    if(!comment) {
      return next(errorHandler(404, "Comment Not Found"))
    }
    const userIndex = comment.likes.indexOf(req.user.id)
    if(userIndex === -1) {
      comment.likes.push(req.user.id)
      comment.numberOfLikes += 1
    }else {
      comment.likes.splice(userIndex, 1)
      comment.numberOfLikes -= 1 
    }
    await comment.save()
    res.status(200).json(comment)
  } catch (error) {
    next(error)
  }
}

const editComment = async (req, res, next) => {
  try {
    const comment = await COMMENT.findById(req.params.commentId)
    if(!comment) {
      return next(errorHandler(404, 'Comment not found'))
    }
    if(comment.userId !== req.user.id && !req.user.isAdmin)  {
      return next(errorHandler(403, 'You are not allowed to edit this comment'))
    }
    const editedComment = await COMMENT.findByIdAndUpdate(req.params.commentId,
      {
        content:req.body.content,
      },
      { new: true},
      )
      res.status(200).json(editComment)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createComment,
  getPostComments,
  likeComment,
  editComment,
}