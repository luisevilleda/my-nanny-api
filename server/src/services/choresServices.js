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
const choresServices = {

  /**
    * @function create
    * @param {object} data - Contains separate account and child objects
    * @param {string} email
    * @param {object} data.child
    * @param {string} data.child.name
    * @param {object} data.chore
    * @param {string} data.chore.title
    * @param {string} data.chore.details
    * @param {string} data.chore.date - "2016-12-24"
    * @returns {promise}
  */
  create: (data, email) =>
    new Promise((resolve, reject) => {
      accountRepository.findAccountByEmail(email)
      .then((account) => {
        if (!account) {
          reject('Cannot add chore, account does not exist.');
        } else {
          // Find the account's child (by name) that the chore is for
          childrenRepository.findOneByIdEmail(data.child, email)
          .then((child) => {
            if (!child) {
              reject('Cannot add chore, child does not exist.');
            } else {
              // It doesn't matter if the chore is a duplicate
              // The chores should always come in an array
              // This is to mitigate the number of requests
              const chores = data.chores;
              chores.forEach((chore) => {
                const newChore = choresRepository.create(child, chore);
                newChore.save()
                .then(() => child.addChore(newChore));
                // Associate the newChore with the child
                // child.addChore(newChore);
              });
              resolve('Chores added successfully.');
            }
          });
        }
      });
    }),

  update: (data, email) =>
    new Promise((resolve, reject) => {
      // Check if account exists
      accountRepository.findAccountByEmail(email)
      .then((account) => {
        if (!account) {
          reject('Cannot update chore, account does not exist.');
        } else {
          // Find the account's child by the child's id that the chore is for
          childrenRepository.findOneByIdEmail(data.child, email)
          .then((child) => {
            if (!child) {
              reject('Cannot update chores, child does not exist.');
            } else {
              // Get all of the chores for the child model
              choresRepository.getChoresForChildById(child)
              .then((existingChores) => {
                const updatedChores = data.chores;
                existingChores.forEach((existingChore) => {
                  updatedChores.forEach((updatedChore) => {
                    if (existingChore.id === updatedChore.id) {
                      existingChore.update(updatedChore);
                    }
                  });
                });
                resolve('Successfully updated chores');
              });
            }
          });
        }
      });
    }),

  destroy: (data, email) =>
    new Promise((resolve, reject) => {
      // Check if account exists
      accountRepository.findAccountByEmail(email)
      .then((account) => {
        if (!account) {
          reject('Cannot destroy chore, account does not exist.');
        } else {
          // Find the account's child by the child's id
          childrenRepository.findOneByIdEmail(data.child, email)
          .then((child) => {
            if (!child) {
              reject('Cannot destroy chore, child does not exist.');
            } else {
              // Get all of the chores for the child model
              choresRepository.getChoresForChildById(child)
              .then((chores) => {
                const choresToDelete = data.chores;
                chores.forEach((chore) => {
                  choresToDelete.forEach((choreToDelete) => {
                    if (Number(chore.id) === Number(choreToDelete.id)) {
                      choresRepository.destroy(chore);
                    }
                  });
                });
                resolve('Successfully destroyed chores.');
              });
            }
          });
        }
      });
    }),

  readOneChildsChores: (data, email) =>
    new Promise((resolve, reject) => {
      // Check if account exists
      accountRepository.findAccountByEmail(email)
      .then((account) => {
        if (!account) {
          reject('Cannot get chores, account does not exist.');
        } else {
          // Check if child exists
          // Find the account's child by the child's id
          childrenRepository.findOneByIdEmail(data.child, email)
          .then((child) => {
            if (!child) {
              reject('Cannot get chores, child does not exist.');
            } else {
              // Get all of the chores for the child model
              choresRepository.getChoresForChildById(child)
              .then((chores) => {
                const choresToDelete = data.chores;
                chores.forEach((chore) => {
                  choresToDelete.forEach((choreToDelete) => {
                    if (Number(chore.id) === Number(choreToDelete.id)) {
                      choresRepository.destroy(chore);
                    }
                  });
                });
                resolve('Successfully destroyed chores.');
              });
            }
          });
        }
      });
    }),

};

export default choresServices;
