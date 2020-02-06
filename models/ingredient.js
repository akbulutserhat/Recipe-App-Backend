'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ingredient = sequelize.define('Ingredient', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Ingredient.associate = function(models) {
    // associations can be defined here
    //Ingredient.hasMany(models.Recipe_Ingredient);
    Ingredient.belongsToMany(models.Recipe, {through: 'Recipe_Ingredient'});
  };
  return Ingredient;
};