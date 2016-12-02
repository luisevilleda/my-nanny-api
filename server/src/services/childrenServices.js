import Promise from 'bluebird';
import accountRepository from '../repositories/accountRepository';
import childrenRepository from '../repositories/childrenRepository';

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
      if (!data.child || !data.child.name || !data.child.phone) {
        reject('Cannot add child, child data is missing');
        return;
      }
      accountRepository.findByEmail(email)
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
              .then(() => account.addChild(newChild))
              .then(() => resolve('Child successfully added.'));
            }
          });
        }
      });
    }),


  getChildren: (data, email) =>
    new Promise((resolve, reject) => {
      accountRepository.findByEmail(email)
      .then((account) => {
        if (!account) {
          reject('Failed to get info, account does not exist.');
        } else {
          childrenRepository.getBasicInfoForAllChildren(email)
          .then(childrenInfo => resolve(JSON.stringify(childrenInfo)));
        }
      });
    }),


  getChild: (data, email, id) =>
    new Promise((resolve, reject) => {
      accountRepository.findByEmail(email)
      .then((account) => {
        if (!account) {
          reject('Failed to get info, account does not exist.');
        } else {
          childrenRepository.findOneByIdEmail({ id }, email)
          .then((child) => {
            if (!child) {
              reject('Child does not exist.');
            } else {
              childrenRepository.getDetailedInfoForOneChild(id, email)
              .then(childInfo => resolve({ child: childInfo }));
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
    accountRepository.findByEmail(email)
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
    accountRepository.findByEmail(email)
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
