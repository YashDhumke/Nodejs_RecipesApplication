const express = require('express')
const recipeController = require('../controllers/recipeController.js')

const router = express.Router();

router.get('/',recipeController.getHomepage );
router.get('/categories', recipeController.getExploreCategories);
router.get('/recipe/:id', recipeController.getRecipe);
router.get('/categories/:id', recipeController.getRecipesByCategory);
router.post('/search', recipeController.getSearchRecipes);
router.get('/explore-latest', recipeController.getExploreRecipes);
router.get('/explore-random', recipeController.getRandomRecipes);
router.get('/submit-recipe', recipeController.getSubmitRecipe);
router.post('/submit-recipe', recipeController.postSubmitRecipe)

module.exports = router;