import db from './connection';
import Account from './models/accountModel';
import Child from './models/childModel';
import Chore from './models/choreModel';
import Schedule from './models/scheduleModel';
import Curfew from './models/curfewModel';

const initializeModels = () => {
  Child.belongsTo(Account, { onDelete: 'CASCADE' });
  Account.hasMany(Child, { onDelete: 'CASCADE' });

  Chore.belongsTo(Child, { onDelete: 'CASCADE' });
  Child.hasMany(Chore, { onDelete: 'CASCADE' });

  Schedule.belongsTo(Child, { onDelete: 'CASCADE' });
  Child.hasOne(Schedule, { onDelete: 'CASCADE' });

  Curfew.belongsTo(Schedule, { onDelete: 'CASCADE' });
  Schedule.hasMany(Curfew, { onDelete: 'CASCADE' });
};

// Build the models
initializeModels();

// Sync the database
db
  .sync({ force: false })
  .then(() => console.log('Successfully synced models'))
  .catch(err => console.log('An error occurred while creating the table:', err));

export default initializeModels;
