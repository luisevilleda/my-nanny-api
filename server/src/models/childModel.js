const Sequelize = require('sequelize');
const db = require('../connection');

const Child = db.define('child', {
  name: Sequelize.STRING,
});

module.exports = Child;
