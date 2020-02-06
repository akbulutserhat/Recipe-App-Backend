let router = require('express').Router();
let jwt = require('jsonwebtoken')
let User = require('./models').User;
// lifecycle of this module 
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!'
    });
});

// uplaod recipe image with Multer package.
var multer  = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})
var upload = multer({ storage: storage });  // uploads folder is in the same directory with router.js

// Import controllers 
const signupController = require('./controllers/signupController');
const verifyEmail = require("./controllers/emailVerificationController").verifyEmail;
const loginController = require('./controllers/loginController');
const logoutController = require('./controllers/logoutController');
const userController = require('./controllers/userController');
const recipeController = require("./controllers/recipeController");
const favoriteController = require("./controllers/favoriteController");
/*
router.route('/img').get((req,res) => {
  var base64str = base64_encode('./uploads/1574373076318-file.jpg');
  console.log(base64str);
})*/
router.route('/user').get(userController.user);
router.post('/user/signup',signupController.validateSignupInput,signupController.signup);
router.route('/user/confirmation/:token').get(verifyEmail); // verify email after signup
router.post('/user/login',loginController.validateLoginInput,loginController.login);
router.route('/user/logout').get(logoutController.logout);
router.post('/user/create-recipe', upload.single('recipeImage'), userController.createRecipe);
router.route('/recipe-category').get(recipeController.fetchAllCategories);
router.route('/ingredients').get(recipeController.fetchAllIngredients);
router.route('/recipes/:page').get(recipeController.fetchAllRecipes);
router.route('/user/recipes/:page').get(recipeController.fetchAuthenticatedUserRecipes);
router.route('/recipe/:id').get(recipeController.fetchRecipeById);
router.post("/add-favorite",favoriteController.validateAddFavoritesInput,favoriteController.addFavorites);
router.post("/delete-favorite",favoriteController.validateAddFavoritesInput,favoriteController.deleteFromFavorites);
router.post("/user/update-profile",userController.validateProfileUpdate,userController.updateProfile);
router.post("/delete-recipe",recipeController.validateDeleteRecipeInput,recipeController.deleteRecipe);
module.exports = router;

