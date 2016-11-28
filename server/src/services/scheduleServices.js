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
const schedlueServices = {
  read: (req, email) =>
    new Promise((resolve, reject) => {
      // Check if the account exists
      accountRepository.findAccountByEmail(email)
      .then((account) => {
        if (!account) {
          reject('Cannot get schedule, account does not exist.');
        } else {
          // Check if the child exists
          childrenRepository.findOneByIdEmail({ id: req.params.id }, email)
          .then((child) => {
            if (!child) {
              reject('Cannot get schedule, child does not exist');
            } else {
              scheduleRepository.getScheduleForOneChild({ id: req.params.id }, email)
              .then((schedule) => {
                if (!schedule) {
                  reject('Cannot get schedule, schedule does not exist.');
                } else {
                  resolve({ schedule });
                }
              });
            }
          });
        }
      });
    }),

  /**
    * @function create
    * @param {object} data - Contains separate account and child objects
    * @param {object} data.account - Contains a account's info
    * @param {string} email
    * @param {object} data.child
    * @param {string} data.child.name
    * @param {object} data.schedule
    * @param {string} data.schedule.sunday
    * @param {string} data.schedule.monday
    * @param {string} data.schedule.tuesday
    * @param {string} data.schedule.wednesday
    * @param {string} data.schedule.thursday
    * @param {string} data.schedule.sunday
    * @param {string} data.schedule.sunday
    * @param {string} data.schedule.sunday
    * @returns {promise}
  */
  create: (data, email) =>
    new Promise((resolve, reject) => {
      // Check if the account exists
      accountRepository.findAccountByEmail(email)
      .then((account) => {
        if (!account) {
          reject('Cannot add schedule, account does not exist.');
        } else {
          // Check if the child exists
          childrenRepository.findOneByIdEmail(data.child, email)
          .then((child) => {
            if (!child) {
              reject('Cannot add schedule, child does not exist.');
            } else {
              // Get the schedule and the child
              scheduleRepository.findScheduleIfExists(data.child, email)
              .then((schedule) => {
                if (schedule) {
                  reject('Schedule already exists, please PUT to update a schedule');
                } else {
                  const newSchedule = scheduleRepository.create(data.schedule, child);
                  newSchedule.save()
                  .then(() => child.setSchedule(newSchedule))
                  .then(() => resolve('Successfully added schedule.'));
                }
              });
            }
          });
        }
      });
    }),

  update: (data, email) =>
    new Promise((resolve, reject) => {
      // Check if the account exists
      accountRepository.findAccountByEmail(email)
      .then((account) => {
        if (!account) {
          reject('Cannot update schedule, account does not exist.');
        } else {
          // Check if the child exists
          childrenRepository.findOneByIdEmail(data.child, email)
          .then((child) => {
            if (!child) {
              reject('Cannot update schedule, child does not exist');
            } else {
              scheduleRepository.findScheduleIfExists(data.child, email)
              .then((schedule) => {
                if (!schedule) {
                  reject('Cannot update schedule, schedule does not exist.');
                } else {
                  scheduleRepository.update(schedule, data.schedule)
                  .then(() => resolve('Successfully updated schedule.'));
                }
              });
            }
          });
        }
      });
    }),

  destroy: (data, email) => null,

};

export default schedlueServices;
