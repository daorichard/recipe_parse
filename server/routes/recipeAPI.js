const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController.js')

// get Method since we are returning data.. making a request to the server for a response

router.get('/', recipeController.parseRecipe, (req, res) => {
    return res.status(200).json(res.locals.recipe)
});

module.exports = router;