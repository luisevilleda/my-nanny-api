const db = require('./connection');
const Parent = require('./models/parentModel');
const Child = require('./models/childModel');
const Chore = require('./models/choreModel');
const Schedule = require('./models/scheduleModel');
const Curfew = require('./models/curfewModel');

const initializeModels = () => {
  Parent.hasMany(Child);
  Child.hasMany(Chore);
  Child.hasOne(Schedule);
  Schedule.hasMany(Curfew);
};

// Build the models
initializeModels();

// Sync the database
db
  .sync({ force: true })
  .then(() => console.log('Successfully synced models'))
  .catch(err => console.log('An error occurred while creating the table:', err));

module.exports = initializeModels;
