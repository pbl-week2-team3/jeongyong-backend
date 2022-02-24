'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nickname: {
      primaryKey: true,
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_img_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true,
    charset: 'utf8mb4',
  });
  User.associate = models => {
    User.hasMany(models.Post, {foreignKey: 'user_id', sourceKey: 'nickname'});
    User.hasMany(models.Like, {foreignKey: 'user_id', sourceKey: 'nickname'});
  };
  return User;
};