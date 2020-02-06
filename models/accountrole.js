'use strict';
module.exports = (sequelize, DataTypes) => {
  const AccountRole = sequelize.define('AccountRole', {
    role: DataTypes.STRING
  }, {});
  AccountRole.associate = function(models) {
    // associations can be defined here
  };
  return AccountRole;
};