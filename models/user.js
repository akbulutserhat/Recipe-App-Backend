'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Recipe, {as: 'postedRecipes'});
    User.belongsTo(models.AccountRole);
    User.belongsTo(models.AccountStatus);
    User.belongsToMany(models.Recipe, {  as: 'favoriteRecipes',
    through: 'Favorite_Recipe'});
  };
  return User;
};