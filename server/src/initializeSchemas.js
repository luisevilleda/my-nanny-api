import Account from './models/accountModel';
import Child from './models/childModel';
import Chore from './models/choreModel';
import Schedule from './models/scheduleModel';
import Curfew from './models/curfewModel';
// import { connectDb } from './connection';

const initializeSchemas = () => {
  // const db = connectDb();
  Child.belongsTo(Account, { onDelete: 'CASCADE', foreignKey: 'accountId' });
  Account.hasMany(Child, { onDelete: 'CASCADE', foreignKey: 'accountId' });

  Chore.belongsTo(Child, { onDelete: 'CASCADE', foreignKey: 'childId' });
  Child.hasMany(Chore, { onDelete: 'CASCADE', foreignKey: 'childId' });

  Schedule.belongsTo(Child, { onDelete: 'CASCADE', foreignKey: 'childId' });
  Child.hasOne(Schedule, { onDelete: 'CASCADE', foreignKey: 'childId' });

  Curfew.belongsTo(Schedule, { onDelete: 'CASCADE', foreignKey: 'scheduleId' });
  Schedule.hasMany(Curfew, { onDelete: 'CASCADE', foreignKey: 'scheduleId' });


  Account.sync()
  .then(() => {
    Child.sync();
  })
  .then(() => {
    Schedule.sync();
    Chore.sync();
  })
  .then(() => {
    Curfew.sync();
  })
  .catch(err => console.log('An error occurred while creating the table:', err));
};

export default initializeSchemas;
