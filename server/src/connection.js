import Sequelize from 'sequelize';
import Promise from 'bluebird';
import config from './config';

exports.connectDb = () =>
  new Sequelize(config.database, config.username, config.password, {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false,
  });

exports.authenticateDb = db =>
  new Promise((resolve, reject) => {
    db.authenticate()
      .then(() => console.log(`Sequelize connection has been established successfully to db: ${config.database}`))
      .then(() => resolve())
      .catch((err) => {
        console.log('Unable to connect to the database:', err);
        reject();
      });
  });
