import Promise from 'bluebird';
import accountRepository from '../repositories/accountRepository';

/** @module Services: Account */
const accountServices = {
  /**
    * @function create
    * @param {object} data - An object with new account info
    * @param {string} data.account.username - The persons full name from Amazon OAuth
    * @param {object} data.account.email - The account's email that comes from Amazon OAuth
    * @param {string} email - The account's email that comes from Amazon OAuth
    * @returns {promise}
   */
  create: (data, email) =>
    new Promise((resolve, reject) => {
      accountRepository.findByEmail(email)
      .then((account) => {
        if (account) {
          // If account exists already, return an error
          reject('Failed to create account.');
        } else {
          const newAccount = accountRepository.create(data.account, email);
          newAccount.save()
          .then(() => {
            const { id, username, token } = newAccount;
            resolve(JSON.stringify({ id, username, token }));
          });
        }
      });
    }),

  /**
    * @function update
    * @desc Any other params sent in will be ignored, you can't update email
    * @param {object} data - Contains an account object
    * @param {object} data.account - Contains an account info to update
    * @param {string} data.account.username - Optional updated username
    * @param {string} data.account.timezone - Optional updated timezone
    * @param {string} data.account.phone - Optional updated phone number
    * @param {string} email - The email that comes from Amazon Oath
    * @returns {promise}
  */
  update: (data, email) =>
    new Promise((resolve, reject) => {
      accountRepository.findByEmail(email)
      .then((account) => {
        if (!account) {
          reject('Cannot update account. Account doesn\'t exist');
        } else {
          // Unable to update email because that is the basis
            // The account info is based on
          const updatedAccount = data.account || {};
          delete updatedAccount.email;
          account.updateAttributes(updatedAccount)
          .then(() => resolve('Account updated successfully.'));
        }
      });
    }),

    /**
     * @typedef {Object} returnedAccountInfo
     * @property {object} account
     * @property {number} account.id - The account's id given by Sequelize
     * @property {string} account.username
     * @property {string} account.email - The email given by Amazon OAuth
     * @property {string} account.phone
     * @property {string} account.timezone
     * @property {array} account.children - An array of children
     * @property {string} account.children.name
     * @property {string} account.children.phone
     */
    /**
      * @function read
      * @desc Retrieves account info
      * @param {object} data - Contains an account object
      * @param {object} data.account - Contains an account info to update
      * @param {string} data.account.username - Optional updated username
      * @param {string} data.account.timezone - Optional updated timezone
      * @param {string} data.account.phone - Optional updated phone number
      * @param {string} email - The email that comes from Amazon Oath
      * @returns {returnedAccountInfo}
    */
  read: (data, email) =>
    new Promise((resolve, reject) => {
      accountRepository.findByEmail(email)
      .then((account) => {
        if (!account) {
          // If account does not exist, login fails
          reject('Failed to get account info, account does not exist.');
        } else {
          accountRepository.read(email)
          .then(accountInfo => resolve(JSON.stringify(accountInfo)));
        }
      });
    }),

};

export default accountServices;
