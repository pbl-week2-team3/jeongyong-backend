'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Like.init({
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Like',
    timestamps: true,
    charset: 'utf8mb4',
  });
  Like.associate = models => {
    Like.belongsTo(models.User, {foreignKey: 'user_id', sourceKey: 'nickname', onDelete: 'cascade', onUpdate: 'no action'});
    Like.belongsTo(models.Post, {foreignKey: 'post_id', sourceKey: 'id', onDelete: 'cascade', onUpdate: 'no action'});
  };
  return Like;
};