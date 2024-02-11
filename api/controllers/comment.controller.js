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

module.exports = {
  createComment,
  getPostComments,
}