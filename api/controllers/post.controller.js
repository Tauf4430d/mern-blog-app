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

const getPosts = async(req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 9
    const sortDirection = req.query.order === 'asc' ? 1 : -1
    const posts = await POST.find({
      ...(req.query.userId && { userId : req.query.userId }),
      ...(req.query.category && { category : req.query.category }),
      ...(req.query.slug && { slug : req.query.slug }),
      ...(req.query.postId && { _id : req.query.postId }),
      ...(req.query.searchTerm && { 
        $or: [
          { title : { $regex: req.query.searchTerm, $options: 'i'}},
          { content : { $regex: req.query.searchTerm, $options: 'i'} },
        ]
       }),
    }).sort({ updatedAt : sortDirection}).skip(startIndex).limit(limit)

    const totalPosts = await POST.countDocuments()
    console.log(posts);
    const now =new Date()
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    )

    const lastMonthPosts = await POST.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    })
    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts
    })

  } catch (error) {
    next(error)
  }
}

const deletePost = async (req, res, next) => {
  if(!req.user.isAdmin || req.user.id != req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this Post"))
  }
  try {
    await POST.findByIdAndDelete(req.params.postId)
    res.status(200).json({msg: 'The post has been Deleted'})
  }catch(error) {
    next(error)
  }
}

const updatePost = async(req, res, next) => {
  if(!req.user.isAdmin || req.user.id != req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this Post"))
  }
  try {
    const updatePost = await POST.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        }
      }, { new : true }
    )
    res.status(200).json(updatePost)
  }catch(error) {
    next(error)
  }
} 

module.exports = {
  create,
  getPosts,
  deletePost,
  updatePost,
}