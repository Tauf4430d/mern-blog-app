const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

mongoose.connect(process.env.MONGO_DB).then(()=> console.log('mongo connected')).catch((err) => console.log(err))
const app = express()

app.listen(2000, () => {
    console.log('sever is running')
})