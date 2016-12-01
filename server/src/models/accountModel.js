import Sequelize from 'sequelize';
import { connectDb } from '../connection';

const db = connectDb();

const Account = db.define('account', {
  username: Sequelize.STRING,
  timezone: Sequelize.STRING,
  phone: Sequelize.STRING,
  email: Sequelize.STRING,
});

export default Account;
