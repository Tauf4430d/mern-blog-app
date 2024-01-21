const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const userRouter = require('./routes/user.route.js')
const authRouter = require('./routes/auth.route.js')
dotenv.config()
mongoose.connect(process.env.MONGO_DB).then(()=> console.log('mongo connected')).catch((err) => console.log(err))
const app = express()
app.use(express.json())
app.use(cors())
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500
    const message = error.message || 'Internal Server error'

    res.json({
        success:false,
        message,
        statusCode,
    })
    next()
})

app.listen(2000, () => {
    console.log('sever is running')
})