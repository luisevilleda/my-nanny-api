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
    * @param {string} data.account.username
    * @param {string} data.account.token - The token given my Amazon's OAuth
    * @param {string} email - The account's email that comes from the Amazon token
    * @param {string} data.account.timeZone
    * @param {object} data.account.phone
    * @param {object} data.account.email
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
          newAccount.save();
          const { id, username, token } = newAccount;
          resolve(JSON.stringify({ id, username, token }));
        }
      });
    }),

  /**
    * @function login
    * @param {object} data - Contains an account
    * @param {string} email
    * @returns {promise} - Resolves to the user's account info
  */
  login: (data, email) =>
    new Promise((resolve, reject) => {
      accountRepository.findAccountByEmail(email)
      .then((account) => {
        if (!account) {
          // If account does not exist, login fails
          reject('Failed to log in.');
        } else {
          // send them all the info for the account
          accountRepository.getAllAccountInfo(email)
          .then(accountInfo => resolve(JSON.stringify(accountInfo)));
        }
      });
    }),

  /**
    * @function updateAccount
    * @param {object} data - Contains an account
    * @param {string} email
    * @param {object} data.account
    * @returns {promise}
  */
  updateAccount: (data, email) =>
    new Promise((resolve, reject) => {
      accountRepository.findAccountByEmail(email)
      .then((account) => {
        if (!account) {
          reject('Cannot update account. Account doesn\'t exist');
        } else {
          // Strip amazonId from the data.account object
            // So that they can't update that part of it
            // This doesn't provide protection without amazon actually
            // Authenticating who the user is
          const updatedAccount = data.account;
          delete updatedAccount.amazonId;
          delete updatedAccount.email;
          account.updateAttributes(data.account);
          resolve('Account updated successfully.');
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
          accountRepository.getAllAccountInfo(email)
          .then(accountInfo => resolve(JSON.stringify(accountInfo)));
        }
      });
    }),
};

export default accountServices;
