const Sequelize = require('sequelize');
const db = require('../connection');

const Chore = db.define('chore', {
  title: Sequelize.STRING,
  description: Sequelize.STRING,
  setTime: Sequelize.INTEGER,
  status: Sequelize.BOOLEAN,
});

module.exports = Chore;
