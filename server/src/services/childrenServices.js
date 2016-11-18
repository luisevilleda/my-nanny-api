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

/** @module Services: Children */
const childrenServices = {

  /**
    * @function addChild
    * @param {object} data - Contains separate account and child objects
    * @param {string} email, the email associated with the account
    * @param {object} data.child - The child
    * @param {string} data.child.name
    * @param {string} data.child.phone
    * @returns {promise}
  */
  addChild: (data, email) =>
    new Promise((resolve, reject) => {
      accountRepository.findAccountByEmail(email)
      .then((account) => {
        if (!account) {
          reject('Cannot add child, account does not exist.');
        } else {
          childrenRepository.findOneByNameEmail(data.child, email)
          .then((children) => {
            if (children) {
              reject('Child already exists');
            } else {
              const newChild = childrenRepository.create(account, data.child);
              newChild.save()
              .then(() => account.addChild(newChild));
              resolve('Child successfully added.');
            }
          });
        }
      });
    }),

  /**
    * @function updateChild
    * @param {object} data - Contains an account
    * @param {string} email
    * @param {object} data.child - MUST contains ORIGINAL child name
    * @param {string} data.child.name - MUST be ORIGINAL child name
    * @param {string} data.updatedChild.name - Child's updated name
    * @param {string} data.updatedChild.phone - Child's updated name
    * @returns {promise}
  */
  updateChild: (data, email) =>
  new Promise((resolve, reject) => {
    accountRepository.findAccountByEmail(email)
      .then((account) => {
        if (!account) {
          reject('Cannot edit child, account does not exist.');
        } else {
          childrenRepository.findOneByIdEmail(data.child, email)
          .then((child) => {
            if (!child) {
              reject('Child doesn\'t exist.');
            } else {
              child.updateAttributes(data.child)
              .on('success', resolve('Child updated successfully.'))
              .on('error', reject('Error updating child.'));
            }
          });
        }
      });
  }),

  /**
    * @function deleteChild
    * @param {string} email
    * @param {object} data.child - MUST contains child ID
    * @returns {promise}
  */
  deleteChild: (data, email) =>
  new Promise((resolve, reject) => {
    accountRepository.findAccountByEmail(email)
      .then((account) => {
        if (!account) {
          reject('Cannot delete child, account does not exist.');
        } else {
          childrenRepository.findOneByIdEmail(data.child, email)
          .then((child) => {
            console.log(child);
            if (!child) {
              reject('Cannot delete child, child does not exist.');
            } else {
              childrenRepository.destroy(child)
              .then(status => resolve(status))
              .catch(err => reject(err));
            }
          });
        }
      });
  }),

};

export default childrenServices;
