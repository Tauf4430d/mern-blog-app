const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const userRouter = require('./routes/user.route.js')
const authRouter = require('./routes/auth.route.js')
const postRouter = require('./routes/post.route.js')
const commentRouter = require('./routes/comment.route.js')
const path = require('path')
const cookieParser = require('cookie-parser')
dotenv.config()
mongoose.connect(process.env.MONGO_DB).then(()=> console.log('mongo connected')).catch((err) => console.log(err))
__dirname = path.resolve()
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors())
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/post', postRouter)
app.use('/api/comment', commentRouter)
app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500
    const message = error.message || 'Internal Server error'

    res.status(statusCode).json({
        success:false,
        message,
        statusCode,
    })
    next()
})

app.listen(2000, () => {
    console.log('sever is running')
})