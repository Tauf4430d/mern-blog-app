const {errorHandler} = require('../utils/error')
const POST = require('../models/post.model')
const create = async (req, res, next) => {
    if(!req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to create a post'))
    }
    if(!req.body.title || !req.body.content) {
      return next(errorHandler(403, 'Please provide all require fields'))
    }
    const trimmedTitle = req.body.title.trim();
    const slug = trimmedTitle
    .split(/\s+/)
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-_]/g, '');
    const post = new POST({
      ...req.body, slug, userId:req.user.id
    })
    try {
      const savedPost = await post.save()
      res.status(201).json(savedPost)
    } catch (error) {
      next(error)
    }
}


module.exports = {
  create,
}