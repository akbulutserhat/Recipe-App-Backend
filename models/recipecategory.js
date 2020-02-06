'use strict';
module.exports = (sequelize, DataTypes) => {
  const RecipeCategory = sequelize.define('RecipeCategory', {
    name: DataTypes.STRING
  }, {});
  RecipeCategory.associate = function(models) {
    RecipeCategory.hasMany(models.Recipe);

  };
  return RecipeCategory;
};