const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require('../db_config');

const User = sequelize.define("user", {
    fullname: {
     type: DataTypes.STRING,
     allowNull: false
   },
   email: {
     type: DataTypes.STRING,
     allowNull: false,
     unique: true,
   },
   password: {
    type: DataTypes.STRING,
    allowNull: false
  },
});

sequelize.sync().then(() => {
    console.log('Users table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = User;