import Account from '../models/accountModel';
import Child from '../models/childModel';
import Schedule from '../models/scheduleModel';
import Chore from '../models/choreModel';

/**
  * @module Repository: Account
*/
const accountRepository = {
  /**
    * @function create
    * @param {object} data - An object with new account info
    * @param data.username - The username from Amazon OAuth
    * @param email - The account's email from Amazon OAuth
  */
  create: function createaccount({ username }, email) {
    return Account.build({
      username,
      email,
    });
  },

  /**
    * @function update
    * @param {object} account - Instance of a account from the db
    * @param {object} changedAttributes - Obj with the keys and attributes to be updated
  */
  update: (account, changedAttributes) => {
    account.update(changedAttributes)
    .then((res) => {
      console.log('Account successfully updated');
      return res;
    });
  },

  destroy: account => account.destroy(),

  save: account => account.save(),

  /**
    * @function findAccountByAmazonId
    * @param {string} amazonId - The amazonId of the account
   */
  findAccountByAmazonId: amazonId =>
    Account.findOne({ where: { amazonId } }),

  /**
    * @function findAccountByEmail
    * @param {string} email - The email associated with the account
   */
  findAccountByEmail: email =>
    Account.findOne({ where: { email } }),

  /**
    * @function findAccountByPhone
    * @param {string} phone - The phone number of the account
   */
  findAccountByPhone: phone =>
    Account.findOne({ where: { phone } }),

  /**
    * @function findAccountByUsername
    * @param {string} username - The username of the account
  */
  findAccountByUsername: username =>
    Account.findOne({ where: { username } }),

  /**
    * @function getAllAccountInfo
    * @param {string} email - The email of the account
    * @returns {object} - An object containing all relevant account info
  */
  getAllAccountInfo: email =>
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
            exclude: ['createdAt', 'updatedAt'],
          },
          include: [
            {
              model: Schedule,
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
            {
              model: Chore,
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
          ],
        }],
      })
      .then((foundAccount) => {
        if (foundAccount) {
          resolve(foundAccount);
        } else {
          resolve(null);
        }
      })
      .catch(err => reject(err));
    }),

  getAccountAndChildren: email =>
    new Promise((resolve, reject) => {
      Account.findOne({
        where: {
          email,
        },
        attributes:
        ['id',
          'username',
          'email',
          'timezone',
          'phone'],
        include: [{
          model: Child,
          attributes:
          ['id',
            'name',
            'phone'],
        }],
      })
      .then((accountInfo) => {
        if (accountInfo) {
          resolve(accountInfo);
        } else {
          resolve(null);
        }
      })
      .catch(err => reject(err));
    }),

};

export default accountRepository;
