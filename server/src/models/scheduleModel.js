import Sequelize from 'sequelize';
import { connectDb } from '../connection';

const db = connectDb();

const Schedule = db.define('schedule', {
  sunday: Sequelize.STRING,
  monday: Sequelize.STRING,
  tuesday: Sequelize.STRING,
  wednesday: Sequelize.STRING,
  thursday: Sequelize.STRING,
  friday: Sequelize.STRING,
  saturday: Sequelize.STRING,
  dateOfLastCheckin: Sequelize.STRING,
});

export default Schedule;
