const { parseRecipeFromUrl } = require("../services/recipeParser.js")
// controller purpose will be to handle the HTTP request 
const recipeController = {};

recipeController.parseRecipe = async (req, res, next) => {
    try {
        const { url } = req.query;
        if (!url) return next({ status: 400, err: 'Missing ?url= query param' });

        res.locals.recipe = await parseRecipeFromUrl(url) // store on locals
        return next()
    }
    catch (error) {
        return next({
            err: 'recipeController.ParseRecipe: ERROR: Check server logs for details',
        });
    }
}

module.exports = recipeController;