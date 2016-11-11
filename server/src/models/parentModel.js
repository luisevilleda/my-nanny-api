const Sequelize = require('sequelize');
const db = require('../connection');

const Parent = db.define('parent', {
  householdName: Sequelize.STRING,
  token: Sequelize.STRING,
  alexaId: Sequelize.STRING,
  timeZone: Sequelize.STRING,
});

module.exports = Parent;
