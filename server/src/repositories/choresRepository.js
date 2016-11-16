import Chore from '../models/choreModel';

/**
  * @module Repository: Chore
*/
const choresRepository = {
  /**
    * @function create
    * @param {object} data
    * @param data.title - The chore's title, what my-nanny will have alexa say
    * @param data.description - Extra details for the child
    * @param data.date - "2016-14-3"
  */
  create: (child, { title, details, date }) =>
    Chore.build(Object.assign({},
      {
        childId: child.get('id'),
      },
      {
        title, details, date, completed: false,
      })),

  /**
    * @function update
    * @param {object} chore - Instance of a chore from the db
    * @param {object} changedAttributes - Obj with the keys and attributes to be updated
  */
  update: (chore, changedAttributes) => {
    chore.update(changedAttributes)
    .then((res) => {
      console.log('Chore successfully updated');
      return res;
    });
  },

  /**
    * @function destroy
    * @param {object} chore - Instance of a chore from the db.
  */
  destroy: ({ id }) =>
    new Promise((resolve, reject) => {
      console.log('DESTROYING CHILD');
      Chore.destroy({
        where: {
          id,
        },
      })
      .on('success', resolve('Successfully destroyed chore.'))
      .on('error', reject('Failed to destroy chore.'));
    }),

  save: chore => chore.save(),

  getChoresForChildById: ({ id }) =>
    new Promise((resolve, reject) => {
      Chore.findAll({
        where: {
          childId: id,
        },
      })
      .then((chores) => {
        if (!chores.length) {
          reject('No chores found for this childId.');
        } else {
          resolve(chores);
        }
      })
      .catch(err => console.log(err));
    }),

};

export default choresRepository;
