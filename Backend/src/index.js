const cors =require('cors')
const express = require("express")
const route = require("./route/route")
const mongoose = require("mongoose")
const connectDB = require("./config/db")
const dotenv = require("dotenv")



// Create Express App
const app = express()

// configure dotenv
dotenv.config();

// parse application/json
app.use(express.json())

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
app.use(cors())

// Connect MongoDB 
connectDB();

  // Route App
app.use("/", route)


// Listen server
app.listen(process.env.PORT||5000,function(){
    console.log("Server is running port " + (process.env.PORT||5000) )
})

