const User = require('../models').User;
const Recipe = require('../models').Recipe;
const Favorite_Recipe = require('../models').Favorite_Recipe;
const {check, validationResult} = require('express-validator/check');

const jwt = require('jsonwebtoken');
const tokenConfig = require('../token-config');

exports.validateAddFavoritesInput = [  // öncelik sırası önemlidir ona göre ayarlı!
    check('recipeId', 'No recipe id provided').not().isEmpty(),
    check('recipeId','No recipe found with the recipe id').custom( async value => {
        let recipeCheck = await Recipe.findOne({ where: {
            id: value
            }
        });
        if (!recipeCheck) {
            return Promise.reject();
          }
    })   
];
exports.addFavorites = (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array()); // bad request
    } 
    const token = req.headers['x-access-token'];
    if (!token)  return res.status(401).send({ auth: false, message: 'No token provided.' });  // forbidden to create data.
    jwt.verify(token, tokenConfig.secret, async function(err, decoded) {
        if (err) 
        res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        else {
            const userId = decoded.id;
            const recipeId = req.body['recipeId'];
     
            try {
                const recipe = await Recipe.findOne({  // alse makes sure that the recipe with the given input REALLY EXISTS.
                    where: {
                        id: recipeId
                    }
                });
                const user = await User.findOne({
                    where: {
                        id: userId
                    }
                });
                recipe.addFavoriteRecipe(user); // insert a new record to the many-to-many favorite_recipe table
                res.status(200).json({
                    recipeId: recipe.id,
                    message: 'recipe has been successfully inserted to your favorites'
                });
            }
            catch(error) {
                res.status(500).send(error);
            }
        }
    });
}
exports.deleteFromFavorites = (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array()); // bad request
    } 
    const token = req.headers['x-access-token'];
    if (!token)  return res.status(401).send({ auth: false, message: 'No token provided.' });  // forbidden to create data.
    jwt.verify(token, tokenConfig.secret, async function(err, decoded) {
        if (err) 
        res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        else {
            const userId = decoded.id;
            const recipeId = req.body['recipeId'];
     
            try {
                const recipe = await Recipe.findOne({  // alse makes sure that the recipe with the given input REALLY EXISTS.
                    where: {
                        id: recipeId
                    }
                });
                const user = await User.findOne({
                    where: {
                        id: userId
                    }
                });
                recipe.removeFavoriteRecipe(user); // insert a new record to the many-to-many favorite_recipe table
                res.status(200).json({
                    recipeId: recipe.id,
                    message: 'recipe has been successfully deleted from your favorites'
                });
            }
            catch(error) {
                res.status(500).send(error);
            }
        }
    });
}
exports.getFavorites = (req,res) => {
    const token = req.headers['x-access-token'];
    if (!token)  return res.status(401).send({ auth: false, message: 'No token provided.' });  // forbidden to create data.
    jwt.verify(token, tokenConfig.secret, async function(err, decoded) {
        if (err) 
        res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        else {
            
        }

    });
}