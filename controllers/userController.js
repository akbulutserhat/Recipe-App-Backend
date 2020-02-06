const User = require('../models').User;
const Recipe = require('../models').Recipe;
const Ingredient = require('../models').Ingredient;
const RecipeImage = require('../models').RecipeImage;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {check, validationResult} = require('express-validator/check');
const tokenConfig = require('../token-config');


exports.user = (req,res) => {
    var token = req.headers['x-access-token'];
    if (!token)  return res.status(401).send({ auth: false, message: 'No token provided.' });  // forbidden to create data.
    else {
         jwt.verify(token, tokenConfig.secret,async function(err, decoded) {
            if (err) 
                res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            else {
                const userId = decoded.id;
                User.findOne({
                    where: {
                        id: userId
                    },
                    attributes: {
                        exclude: ['password'] // we don't want to show password to client even though it's HASHED.
                    },
                    include: [
                        {
                            model: Recipe, as: 'favoriteRecipes',
                            attributes: ['id','name']
                        },
                        {
                            model: Recipe, as: 'postedRecipes',
                            attributes: ['id','name']
                        }
                    ]
                }).then(user => {
                    res.status(200).send(user);
                }).catch(err => {
                    res.status(500).send(err);
                })
            }
        });
    }
}


function createDirectionsText(directions) {  // auxilary method
    let text = '';
    directions.forEach((element,idx) => {
        text = text + element.direction;
        if(idx !== directions.length-1)
            text = text + '\n';
    });
    return text;
} 
const createRecipeModel = (userId,data) => {
    return Recipe.create({name: data.recipeName, directions: createDirectionsText(data.directions),
     prepTimeMins: data.prepTimeMins
    ,cookTimeMins: data.cookTimeMins, yieldServingsLow: data.yieldServingsLow,
    yieldServingsHigh: data.yieldServingsHigh, UserId: userId, RecipeCategoryId: data.categoryId });
}

const createRecipe_IngredientModel = (recipe,data) => { // recipeId obtained after recipe created.
   const ingredients = data.ingredients;
    var promises = [];  
    for(let i=0; i<ingredients.length; i++) {
        promises.push(
            Ingredient.findOne({
                where: {
                    id: ingredients[i].id
                }
            }).then((ingredient)=> {
                recipe.addIngredient(ingredient, {through: {amount: ingredients[i].amount}});
            }) 
        );
    }
    return Promise.all(promises);
}
const createRecipeImageRecord = (file, recipe) => {
    const filePath = `${file.destination}/${file.filename}`;
    console.log(file.destination);
    console.log(file.filename);
    console.log(filePath);
    return RecipeImage.create({imagePath: filePath}).then((image)=> {
        recipe.addRecipeImage(image);
        return image;
    });
}
exports.createRecipe = (req, res, next) => {  // post a new recipe
    var token = req.headers['x-access-token'];
    if (!token)  return res.status(401).send({ auth: false, message: 'No token provided.' });  // forbidden to create data.
    else {
         jwt.verify(token, tokenConfig.secret,async function(err, decoded) {
            if (err) 
                res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            else {
                try {
                    const userId = decoded.id;
                    const recipe = await createRecipeModel(userId,req.body);  // awaiting a function returning PROMISE
                    await createRecipe_IngredientModel(recipe,req.body);    // awaiting a function returning PROMISE
                    if(req.file) {
                        const recipeImage = await createRecipeImageRecord(req.file,recipe);
                    }
                    res.status(200).send('recipe posted successfully');
                }
                catch(err) {
                    //return console.log(err);
                    return res.status(200).send(err);
                }
            }
        }); 
    } 
}

exports.validateProfileUpdate = [  // öncelik sırası önemlidir ona göre ayarlı!
    check('firstname', 'firstname field can not be empty').not().isEmpty(),
    check('lastname', 'lastname field can not be empty').not().isEmpty(),
];

exports.updateProfile = (req,res) => {
  var token = req.headers['x-access-token'];
    if (!token)  return res.status(401).send({ auth: false, message: 'No token provided.' });  // forbidden to create data.
    else {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
         jwt.verify(token, tokenConfig.secret,async function(err, decoded) {
            if (err) 
                res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            else {
                
                const {firstname, lastname} = req.body;
                User.update({
                    firstName: firstname,
                    lastName: lastname
                },
                {
                    where: {
                        id: decoded.id
                    }
                }).then(user=> { //
                    
                    res.status(200).json({
                        msg: "user updated successfully"
                    });
                }).catch(err => {
                    res.status(500).send(err);
                });
            }
        });
    }
    
}