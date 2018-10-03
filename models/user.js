'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: DataTypes.SERIAL,
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    age: DataTypes.SMALLINT,
    avatar: DataTypes.STRING,
    role_id: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};