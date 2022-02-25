'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Post.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,      
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contents: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img_url: DataTypes.STRING,
    type: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
    timestamps: true,
    charset: 'utf8mb4',
  });
  Post.associate = models => {
    Post.hasMany(models.Like, {foreignKey: 'post_id', sourceKey: 'id'});
    Post.belongsTo(models.User, {foreignKey: 'user_id', sourceKey: 'nickname', onDelete: 'cascade'})
  };
  return Post;
};