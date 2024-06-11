const express = require("express");
const router = express.Router();
const authenticateToken = require('../middleware/authentication')
const dotenv = require('dotenv');
dotenv.config();
const zod = require("zod");
const cloudinary = require('cloudinary').v2;
const { Recipe } = require("../models/recipe");
const { storage } = require('../storage/storage');
const multer = require('multer');
const upload = multer({ storage });
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const recipeBody = zod.object({
    recipeImage: zod.string(),
    recipeName: zod.string(),
    ingredients: zod.string(),
    steps: zod.string(),
});
router.post("/recipe",  upload.single("file"),authenticateToken, async (req, res) => {
    try {
        
     if (!req.file) {
         return res.status(400).json({ message: "No file uploaded" });
     }
    
     const uploadResponse = await cloudinary.uploader.upload(req.file.path); // Use the temporary file path provided by Multer
   
     const recipe = new Recipe({
         userId: req.body.userId,
         recipeImage: uploadResponse.url,
         recipeName: req.body.recipeName,
         ingredients: req.body.ingredients,
         steps: req.body.steps
     });
 
     await recipe.save();
     res.status(201).send(recipe);
 
    } catch (error) {
     console.log(error);
     res.status(500).json({message:"something went wrong"})
    }
 });

 router.post("/recipe/edit/:id", authenticateToken, upload.single('file'),  async(req, res) =>{
    try {
        const {id} = req.params;
        const {recipeName, ingredients, steps} = req.body;
        const recipe = await Recipe.findOneAndUpdate({_id:id});

        const uploadResponse = await cloudinary.uploader.upload(req.file.path);

        recipe.recipeName = recipeName;
        recipe.recipeImage = uploadResponse.url;
        recipe.ingredients = ingredients;
        recipe.steps = steps;
        await recipe.save();
        res.status(200).json({ message: "Recipe updated successfully", recipe });


        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Something went wrong with the update"})
        
    }


 })
 router.get("/recipe", async(req, res) =>{
    try {
        const recipe = await Recipe.find();
        res.send(recipe);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Something went wrong with getting recipes"})
        
    }
 })
 router.post("/recipe/user", authenticateToken, async(req, res) =>{
    try {
        const userId = req.body.userId;
        const recipe = await Recipe.find({ userId: userId });
        res.send(recipe);

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Something went wrong with getting recipes for user"})
        
    }
 })
 router.post("/recipe/search", async(req, res) =>{
    try {
        const recipeName = req.body.recipeName;
        const recipe = await Recipe.find({ recipeName: recipeName });
        res.send(recipe);

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Something went wrong with getting recipes for user"})
        
    }
 })
module.exports = router;

