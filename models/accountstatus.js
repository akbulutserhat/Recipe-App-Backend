'use strict';
module.exports = (sequelize, DataTypes) => {
  const AccountStatus = sequelize.define('AccountStatus', {
    status: DataTypes.STRING
  }, {});
  AccountStatus.associate = function(models) {
    // associations can be defined here
  };
  return AccountStatus;
};