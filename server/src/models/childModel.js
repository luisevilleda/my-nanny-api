import Sequelize from 'sequelize';
import { connectDb } from '../connection';

const db = connectDb();

const Child = db.define('child', {
  name: Sequelize.STRING,
  phone: Sequelize.STRING,
  photo: Sequelize.STRING,
});

export default Child;
