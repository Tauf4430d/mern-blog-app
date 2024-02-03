const express = require('express')
const {verifyToken} = require('../utils/verifyUser')
const { create, getPosts } = require('../controllers/post.controller.js')
const router = express.Router()

router.post('/create', verifyToken, create)
router.get('/getPosts', getPosts)
module.exports = router