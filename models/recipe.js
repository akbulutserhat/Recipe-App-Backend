'use strict';
module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define('Recipe', {
    name: DataTypes.STRING,
    directions: DataTypes.STRING,
    prepTimeMins: DataTypes.INTEGER,
    cookTimeMins: DataTypes.INTEGER,
    yieldServingsLow: DataTypes.INTEGER,
    yieldServingsHigh: DataTypes.INTEGER
  }, {});
  Recipe.associate = function(models) {
    // associations can be defined here
    Recipe.belongsTo(models.RecipeCategory);
    Recipe.hasMany(models.RecipeImage);
    //Recipe.hasMany(models.Recipe_Ingredient);
    Recipe.belongsTo(models.User);
    
    Recipe.belongsToMany(models.Ingredient, {through: 'Recipe_Ingredient'});
    Recipe.belongsToMany(models.User, {through: 'Favorite_Recipe', as: 'favoriteRecipe'});

  };
  return Recipe;
};