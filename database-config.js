var mysql = require('mysql2');
const Sequelize = require('sequelize');
/*
dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'recipe_database'
}); 
module.exports= dbConn;*/

// connect to database
const sequelize = new Sequelize('recipe_database', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  });

module.exports = sequelize;
