const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();
const cloudinary = require('cloudinary').v2;


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const userRouter = require('../backend/controller/userController')
const recipeRouter = require('../backend/controller/recipeController')
require('./db');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.get('/',(req, res) =>{
    res.json({message:"backend chal gya"});

})

app.use("/api", userRouter);
app.use("/api", recipeRouter);
const port = 3000; 
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
// Change this to your desired port