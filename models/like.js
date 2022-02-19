'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  like.init({
    user_id: DataTypes.STRING,
    post_id: DataTypes.BIGINT,
    like: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'like',
  });
  return like;
};