'use strict';
module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define('Log', {
    timestamp: DataTypes.STRING,
    level: DataTypes.STRING,
    message: DataTypes.STRING
  }, {});
  Log.associate = function(models) {
    // associations can be defined here
  };
  return Log;
};