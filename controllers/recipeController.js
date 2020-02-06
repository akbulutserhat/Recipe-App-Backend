const User = require('../models').User;
const AccountRole = require('../models').AccountRole;
const Recipe = require('../models').Recipe;
const Ingredient = require('../models').Ingredient;
const RecipeCategory = require('../models').RecipeCategory;
const RecipeImage = require('../models').RecipeImage;
const {sequelize}=require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {check, validationResult} = require('express-validator/check');
const tokenConfig = require('../token-config');
const fs = require('fs');
// function to encode file data to base64 encoded string

exports.validateDeleteRecipeInput = [  // öncelik sırası önemlidir ona göre ayarlı!
    check('recipeId', 'No recipe id provided').not().isEmpty(),
    check('recipeId','No recipe found with the recipe id').custom( async value => {
        console.log("\nRecipe checke girdi\n");
        let recipeCheck = await Recipe.findOne({ where: {
            id: value
            }
        });
        console.log(recipeCheck);
        if (!recipeCheck) {
            return Promise.reject();
          }
    })   
];

exports.fetchAllRecipes = (req,res) => {
    getRecipes(req,res,null); // userID condition is null
}

exports.fetchAuthenticatedUserRecipes = (req,res) => {
    var token = req.headers['x-access-token'];
    if (!token)  return res.status(401).send({ auth: false, message: 'No token provided.' });  // forbidden to create data.
    else {
         jwt.verify(token, tokenConfig.secret,async function(err, decoded) {
            if (err) 
                res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
                else {
                    const userId = decoded.id;
                    getRecipes(req,res,userId); // userID condition is null
                }
            }); 
    }
}
function getRecipes(req,res,userIdCondition){
    const condition = {};
    if (userIdCondition) {
        condition.UserId = userIdCondition;
    }
    Recipe.findAll({
        where: condition
        ,
        include: [{  // JOIN OPERATIONS
          model: Ingredient,
          required: true,
          through: {
            attributes: ['createdAt', 'updatedAt','amount']
          },
        },{
            model: RecipeCategory,
        },{
            model: User,
            attributes: ['id','firstName','lastName','email'],
            include: [
                {
                    model: AccountRole
                }
            ]
        },
        /*{
            model: User, as: 'favoriteRecipe',
            attributes: ['firstName','lastName']
        }
        ,*/{
            model: RecipeImage
        }],
        order: [['createdAt','DESC']],

      }).then(records => records.map(record =>
        record.get({ plain: true }))
        ).then(rec => {
            let page = 1;
            if(req.params.page)
                page = req.params.page;
            const pagingOffSet = 16;
            const start = (page - 1) * pagingOffSet;
            const end = start + pagingOffSet;
            const data = rec.slice(start, end);
            if(!data[0])
                res.status(404).send("404-Page Not Found"); // recipe page not found
            else {
                let totalPage = 1;
                if(rec.length > pagingOffSet) {   // calculation of the totalPages. 
                    totalPage = Math.floor(rec.length / pagingOffSet);
                    if(rec.length % pagingOffSet > 0) {
                        totalPage++;
                    }
                }
                const result = {
                    totalPage,
                    pagingOffSet,
                    result: data
                }
                return result;
            }

      }).then(async (data) => {
            await fetchAllImages(data.result);  // pass the recipes of the data. (result = recipes)
            res.status(200).send(data);
      }).catch(err => {
            res.status(500).json(err);
    });
}
async function fetchAllImages (recipes) { // all recipes given as parameter
   // await Promise.all(recipes.map((recipe) => {
    Promise.all(recipes.map((recipe) => {
        recipe.RecipeImages.map(recipeImage => {
            return new Promise((resolve,reject) =>  {
                if(recipeImage.imagePath) {
                    var img = fs.readFileSync(recipeImage.imagePath);
                    recipeImage.image = new Buffer(img).toString('base64');
                    resolve(true);
                }
            })
        })
    }));
}
async function fetchImageById(recipe){ // single recipe given as parameter
    //await 
        return await new Promise((resolve,reject) =>  {
            if(recipe.recipe.imagePath) {
                console.log(recipe.recipe.imagePath);
                let img = fs.readFileSync(recipe.recipe.imagePath);
                recipe.recipe.image = new Buffer(img).toString('base64');
                resolve(true);
            }
        })
    
}

exports.fetchRecipeById  = async (req,res) => {
    try{
        const id = req.params.id;
        const rec=await sequelize.query('CALL findRecipeById(:recipeId)',{
            replacements:{
                recipeId:id
            },
            raw:true
        });
           
       const Ingredients=await sequelize.query('CALL findRecipeIngredientsById(:recipeId)',{
            replacements:{
                recipeId:id
            },
            raw:true
        });

        let allRecipeDetail = {
            recipe:rec[0],
            Ingredients:Ingredients
        }
        console.log(allRecipeDetail);
        if(!allRecipeDetail)
            return res.status(404).send("recipe is not found");
        else {
            await fetchImageById(allRecipeDetail);
            res.status(200).send(allRecipeDetail);
        } 
        
    }catch(err){
        res.status(500).json(err);
    }
}

exports.fetchAllCategories = (req,res) => {
    RecipeCategory.findAll().then(cat => {
        res.status(200).send(cat);
    }).catch(err => {
        res.status(500).json(err);
    })
}

exports.fetchAllIngredients = (req,res) => {
    Ingredient.findAll().then(ings => {
        res.status(200).send(ings);
    }).catch(err => {
        res.status(500).json(err);
    })
}

exports.deleteRecipe = (req,res) =>{
    console.log("\n delete recipeye girdi. \n")
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

            const recipeId = req.body['recipeId'];
            console.log(recipeId);
            try {
                const recipe = await Recipe.findOne({  // alse makes sure that the recipe with the given input REALLY EXISTS.
                    where: {
                        id: recipeId
                    }
                });
                console.log(recipe);
                const delRecipe=await sequelize.query('DELETE FROM recipes WHERE id=:recipeId',{
                    replacements:{
                        recipeId:recipe.id
                    },
                    raw:true
                })
                console.log(delRecipe);
                res.status(200).json({
                    recipeId: recipe.id,
                    message: 'recipe has been successfully deleted'
                });
            }
            catch(error) {
                res.status(500).send(error);
            }
        }
    });
}

