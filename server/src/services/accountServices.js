import Promise from 'bluebird';
import Account from '../models/accountModel';
import Child from '../models/childModel';
import Chore from '../models/choreModel';
import Schedule from '../models/scheduleModel';
import Curfew from '../models/curfewModel';
import accountRepository from '../repositories/accountRepository';
import childrenRepository from '../repositories/childrenRepository';
import choresRepository from '../repositories/choresRepository';
import scheduleRepository from '../repositories/scheduleRepository';
import curfewsRepository from '../repositories/curfewsRepository';
import db from '../connection';

/** @module Services: Account */
const accountServices = {
  /**
    * @function createNewAccount
    * @param {object} data - An object with new account info
    * @param {string} data.account.username - The persons full name from Amazon OAuth
    * @param {object} data.account.email - The account's email that comes from Amazon OAuth
    * @param {string} email - The account's email that comes from Amazon OAuth
    * @returns {promise}
   */
  createNewAccount: (data, email) =>
    new Promise((resolve, reject) => {
      accountRepository.findAccountByEmail(email)
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
    * @function updateAccount
    * @desc Any other params sent in will be ignored, you can't update email
    * @param {object} data - Contains an account object
    * @param {object} data.account - Contains an account info to update
    * @param {string} data.account.username - Optional updated username
    * @param {string} data.account.timezone - Optional updated timezone
    * @param {string} data.account.phone - Optional updated phone number
    * @param {string} email - The email that comes from Amazon Oath
    * @returns {promise}
  */
  updateAccount: (data, email) =>
    new Promise((resolve, reject) => {
      accountRepository.findAccountByEmail(email)
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

  getAccountInfo: (data, email) =>
    new Promise((resolve, reject) => {
      accountRepository.findAccountByEmail(email)
      .then((account) => {
        if (!account) {
          // If account does not exist, login fails
          reject('Failed to get account info, account does not exist.');
        } else {
          // send them all the info for the account
          // accountRepository.getAllAccountInfo(email)
          // .then(accountInfo => resolve(JSON.stringify(accountInfo)));
          accountRepository.getAccountAndChildren(email)
          .then(accountInfo => resolve(JSON.stringify(accountInfo)));
        }
      });
    }),

};

export default accountServices;
