'use strict';
module.exports = (sequelize, DataTypes) => {
  const Favorite_Recipe = sequelize.define('Favorite_Recipe', {
  }, {});
  Favorite_Recipe.associate = function(models) {
    // associations can be defined here
  };
  return Favorite_Recipe;
};