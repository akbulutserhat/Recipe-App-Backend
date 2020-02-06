'use strict';
module.exports = (sequelize, DataTypes) => {
  const Recipe_Ingredient = sequelize.define('Recipe_Ingredient', {
    amount: DataTypes.STRING,
    prepInfo: DataTypes.STRING
  }, {});
  Recipe_Ingredient.associate = function(models) {
    // associations can be defined here
   /* Recipe_Ingredient.belongsTo(models.Recipe);
    Recipe_Ingredient.belongsTo(models.Ingredient); */
  };
  return Recipe_Ingredient;
};