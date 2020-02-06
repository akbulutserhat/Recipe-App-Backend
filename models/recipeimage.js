'use strict';
module.exports = (sequelize, DataTypes) => {
  const RecipeImage = sequelize.define('RecipeImage', {
    imagePath: DataTypes.STRING
  }, {});
  RecipeImage.associate = function(models) {
    // associations can be defined here
    RecipeImage.belongsTo(models.Recipe);
  };
  return RecipeImage;
};