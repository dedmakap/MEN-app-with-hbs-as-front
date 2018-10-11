'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    content: DataTypes.STRING,
  }, {});
  Post.associate = function(models) {
    // associations can be defined here
    Post.belongsTo(models.User, {
      foreignKey: 'authorID',
      onDelete: 'CASCADE',
    });
    // Post.belongsToMany(models.User, {
    //   through: 'Likes',
    //   as: 'users',
    //   foreignKey: 'postID'
    // });
    Post.hasMany(models.Like, {
      foreignKey: 'postID'
    })
  };
  return Post;
};