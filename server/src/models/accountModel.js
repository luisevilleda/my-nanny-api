import Sequelize from 'sequelize';
import db from '../connection';

const Account = db.define('account', {
  username: Sequelize.STRING,
  timezone: Sequelize.STRING,
  phone: Sequelize.STRING,
  email: Sequelize.STRING,
});

export default Account;
