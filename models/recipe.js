const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    userId: String,
    recipeImage: String,
    recipeName: String,
    ingredients: String,
    steps: String,

});

const Recipe = mongoose.model('Recipe', recipeSchema );

module.exports ={
    Recipe
}