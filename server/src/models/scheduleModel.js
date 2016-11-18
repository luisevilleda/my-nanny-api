const Sequelize = require('sequelize');
const db = require('../connection');

const Schedule = db.define('schedule', {
  lastStart: Sequelize.INTEGER,
});

module.exports = Schedule;
