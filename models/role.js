
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    title: DataTypes.STRING
  });
  
  Role.associate = function(models) {
    // associations can be defined here
    Role.hasMany(models.User, {
      foreignKey: 'roleID',
      as: 'sameRoleUsers',
    })
  };
  return Role;
};