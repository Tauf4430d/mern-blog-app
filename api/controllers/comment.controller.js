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

const deleteComment = async (req, res, next) => {
  try {
    const comment = await COMMENT.findById(req.params.commentId)
    if(!comment) {
      return next(errorHandler(404, 'Comment Not found'))
    }
    if(comment.userId !== req.user._id && !req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to delete this comment'))
    }
    await COMMENT.findByIdAndDelete(req.params.commentId)
    res.status(200).json('Comment has been deleted')
  } catch (error) {
    next(error)
  }
}

const getComments = async (req, res, next) => {
  if(!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to get all comments'))
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 9
    const sortDirection = req.query.sort === 'desc' ? -1 : 1
    const comments = await COMMENT.find().skip(startIndex).limit(limit).sort({ createdAt: sortDirection })
    const totalComments = await COMMENT.countDocuments()
    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const lastMonthComments = await COMMENT.countDocuments({ createdAt: { $gte: oneMonthAgo } })
    res.status(200).json({comments, totalComments, lastMonthComments})
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createComment,
  getPostComments,
  likeComment,
  editComment,
  deleteComment,
  getComments,
}