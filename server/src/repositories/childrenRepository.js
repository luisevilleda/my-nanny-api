import Child from '../models/childModel';
import Account from '../models/accountModel';

/**
  * @module Repository: Child
*/
const childrenRepository = {
  /**
    * @function create
    * @param {object} data
    * @param data.name - Child's first name
    * @param data.phone - Child's phone number
  */
  create: function createChild(account, { name, phone }) {
    return Child.build(Object.assign({}, { accountId: account.get('id') }, { name, phone }));
  },

  /**
    * @function update
    * @param {object} child - Instance of a child from the db
    * @param {object} changedAttributes - Obj with the keys and attributes to be updated
  */
  update: (child, changedAttributes) => {
    child.update(changedAttributes)
    .then((res) => {
      console.log('Child successfully updated');
      return res;
    });
  },

  /**
    * @function destroy
    * @param {object} child - Instance of a child from the db.
  */
  destroy: ({ id }) =>
    new Promise((resolve, reject) => {
      // console.log('DESTROYING CHILD');
      Child.destroy({
        where: {
          id,
        },
      })
      .on('success', resolve('Successfully destroyed child.'))
      .on('error', reject('Failed to destroy child.'));
    }),

  /**
    * @function save
    * @description - Useless, it is easier to just call .save() on a model instance
    * @param {object} child - The child instance you built
  */
  save: child => child.save(),

  /**
    * @function findOneByIdEmail
    * @desc Finds one child based on their name and account email
    * @param {object} child
    * @param {string} child.id
    * @param {string} email - The email of the account
    * @returns {promise} promise - Resolves to array of children or []
   */


  findOneByIdEmail: (child, email) =>
    new Promise((resolve) => {
      Account.findOne({
        where: {
          email,
        },
        include: [{
          model: Child,
          where: {
            id: child.id,
          },
        }],
      })
      .then((foundAccount) => {
        if (foundAccount) {
          resolve(foundAccount.children[0]);
        } else {
          resolve(null);
        }
      })
      .catch(err => console.log(err));
    }),

  /**
    * @function findOneByNameEmail
    * @desc Finds one child of a account based on their name and account email
    * @param {object} child
    * @param {string} child.name
    * @param {string} email - The email of the account
    * @returns {promise} promise - Resolves to array of children or []
   */

  findOneByNameEmail: ({ name }, email) =>
    new Promise((resolve) => {
      Account.findOne({
        where: {
          email,
        },
        include: [{
          model: Child,
          where: {
            name,
          },
        }],
      })
      .then((foundAccount) => {
        if (foundAccount) {
          resolve(foundAccount.children[0]);
        } else {
          resolve(null);
        }
      })
      .catch(err => console.log(err));
    }),

  /**
    * @function getBasicInfoForAllChildren
    * @desc Gets basic details (name, phone) for all account's children
    * @param {string} email - The email of the account
    * @returns {promise} promise - Resolves to array of children or []
   */

  getBasicInfoForAllChildren: email =>
    new Promise((resolve, reject) => {
      Account.findOne({
        where: {
          email,
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        include: [{
          model: Child,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'accountId'],
          },
        }],
      })
    .then((foundAccount) => {
      if (foundAccount) {
        resolve({ children: foundAccount.children });
      } else {
        resolve(null);
      }
    })
    .catch(err => reject(err));
    }),


/**
    * @function getDetailedInfoForOneChild
    * @desc Gets basic details (name, phone) for all account's children
    * @param {string} email - The email of the account
    * @returns {promise} promise - Resolves to array of children or []
   */

  getDetailedInfoForOneChild: (id, email) =>
    new Promise((resolve) => {
      Child.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'accountId'],
        },
      })
      .then((child) => {
        if (child) {
          resolve(child);
        } else {
          resolve(null);
        }
      })
      .catch(err => console.log(err));
    }),

  /**
    * @function findAccountByEmail
    * @param {string} email
   */
  findAccountByEmail: email =>
    Child.findOne({ where: { email } }),

  /**
    * @function findAccountByPhone
    * @param {string} phone
   */
  findAccountByPhone: phone =>
    Child.findOne({ where: { phone } }),


};

export default childrenRepository;
