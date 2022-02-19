'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

// const Sequelize = require('sequelize'); // 시퀄라이즈 패키지이자 생성자

// const env = process.env.NODE_ENV || 'development'; 
// const config = require('../config/config')[env]; // config/config.json에서 데이터베이스 설정을 불러옴
// const db = {};

// const sequelize = new Sequelize(config.database, config.username, config.password, config); // new Sequelize를 통해 MySQL 연결 객체 생성

// db.sequelize = sequelize; // 연결 객체를 나중에 재사용 하기 위해 db.Sequelize에 넣음

// module.exports = db; 
