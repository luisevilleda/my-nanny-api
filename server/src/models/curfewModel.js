import Sequelize from 'sequelize';
import { connectDb } from '../connection';

const db = connectDb();

const Curfew = db.define('curfew', {
  utc: Sequelize.STRING,
});

export default Curfew;
