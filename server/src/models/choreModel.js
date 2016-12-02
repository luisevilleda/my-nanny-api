import Sequelize from 'sequelize';
import { connectDb } from '../connection';

const db = connectDb();

const Chore = db.define('chore', {
  title: Sequelize.STRING,
  details: Sequelize.STRING,
  date: Sequelize.STRING,
  completed: Sequelize.BOOLEAN,
});

export default Chore;
