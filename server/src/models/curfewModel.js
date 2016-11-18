const Sequelize = require('sequelize');
const db = require('../connection');

const Curfew = db.define('curfew', {
  utcTime: Sequelize.INTEGER,
});

module.exports = Curfew;
