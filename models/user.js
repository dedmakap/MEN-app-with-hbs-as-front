
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    fullname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      }
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    age: DataTypes.SMALLINT,
    avatar: DataTypes.STRING,
  });
  User.associate = function(models) {
    // associations can be defined here
    User.belongsTo(models.Role, {
      foreignKey: 'roleID',
      onDelete: 'CASCADE',
    });
  };
  return User;
};