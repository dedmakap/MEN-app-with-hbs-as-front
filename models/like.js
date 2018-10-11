'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    userID: DataTypes.INTEGER,
    postID: DataTypes.INTEGER
  }, {});
  Like.associate = function(models) {
    // associations can be defined here
    Like.belongsTo(models.User, {
      foreignKey: 'userID',
    })
    Like.belongsTo(models.Post, {
      foreignKey: 'postID',
    })
    // Like.hasMany(models.User, {
    //   foreignKey: 'id',
    //   as: 'userId'
    // });
    // Like.hasMany(models.Post, {
    //   foreignKey: 'id',
    //   as: 'postId'
    // });
  };
  return Like;
};