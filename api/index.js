const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRouter = require('./routes/user.route.js')
const authRouter = require('./routes/auth.route.js')
dotenv.config()
mongoose.connect(process.env.MONGO_DB).then(()=> console.log('mongo connected')).catch((err) => console.log(err))
const app = express()
app.use(express.json())

app.use('/', userRouter)
app.use('/', authRouter)

app.listen(2000, () => {
    console.log('sever is running')
})