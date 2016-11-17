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
  read: (data, amazonId) => null,

  /**
    * @function create
    * @param {object} data - Contains separate account and child objects
    * @param {object} data.account - Contains a account's info
    * @param {string} amazonId
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
  create: (data, amazonId) =>
    new Promise((resolve, reject) => {
      // Check if the account exists
      accountRepository.findAccountByAmazonId(amazonId)
      .then((account) => {
        if (!account) {
          reject('Cannot add schedule, account does not exist.');
        } else {
          // Check if the child exists
          childrenRepository.findOneByIdAmazonId(data.child, amazonId)
          .then((child) => {
            if (!child) {
              reject('Cannot add schedule, child does not exist.');
            } else {
              // Get the schedule and the child
              scheduleRepository.findScheduleIfExists(data.child, amazonId)
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

  update: (data, amazonId) =>
    new Promise((resolve, reject) => {
      // Check if the account exists
      accountRepository.findAccountByAmazonId(amazonId)
      .then((account) => {
        if (!account) {
          reject('Cannot update schedule, account does not exist.');
        } else {
          // Check if the child exists
          childrenRepository.findOneByIdAmazonId(data.child, amazonId)
          .then((child) => {
            if (!child) {
              reject('Cannot update schedule, child does not exist');
            } else {
              scheduleRepository.findScheduleIfExists(data.child, amazonId)
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

  destroy: (data, amazonId) => null,

};

export default schedlueServices;
