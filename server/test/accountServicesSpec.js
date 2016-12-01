/* global define, it, xit, describe, before,  beforeEach, afterEach, done  */

import sinon from 'sinon';
import mysql from 'mysql';
import request from 'request';
import chai from 'chai';
import config from '../src/config';
import { connectDb, authenticateDb } from '../src/connection';
import initializeSchemas from '../src/initializeSchemas';

import accountServices from '../src/services/accountServices';
import Account from '../src/models/accountModel';
import Child from '../src/models/childModel';
import Chore from '../src/models/choreModel';
import Schedule from '../src/models/scheduleModel';


let connection = null;
const expect = chai.expect;

describe('accountServices', () => {
  // let dbConnection;
  before((done) => {
    connection = connectDb();
    done();
  });

  beforeEach((done) => {
    connection.sync()
    .then((results) => {
      Account.destroy({ where: {} })
      .then(() => done())
      .catch(err => console.log('ERROR: ', err.sql));
    });
  });

  // afterEach(() => dbConnection.end());

  it('Should create an Account when a new req.user email comes in', (done) => {
    accountServices.createNewAccount({
      account: {
        username: 'John Doe',
        email: 'john@test.com',
      },
    }, 'john@test.com')
    .then(() => {
      Account.findAll({ where: {} })
      .then((results) => {
        expect(results.length).to.equal(1);

        expect(results[0].username).to.equal('John Doe');
        done();
      });
    });
  });

  it('Should not create a new account if the email is already in use', (done) => {
    accountServices.createNewAccount({
      account: {
        username: 'John Doe',
        email: 'john@test.com',
      },
    }, 'john@test.com')
    .then(() =>
      accountServices.createNewAccount({
        account: {
          username: 'John Doe',
          email: 'john@test.com',
        },
      }, 'john@test.com'))
    .catch(() => {
      Account.findAll({ where: {} })
      .then((results) => {
        // Should have one result:
        expect(results.length).to.equal(1);
        expect(results[0].username).to.equal('John Doe');
        done();
      });
    });
  });

  it('Should create another new account if the email is not use', (done) => {
    accountServices.createNewAccount({
      account: {
        username: 'John Doe',
        email: 'john@test.com',
      },
    }, 'john@test.com')
    .then(() =>
      accountServices.createNewAccount({
        account: {
          username: 'Mary Jane',
          email: 'mary@test.com',
        },
      }, 'mary@test.com'))
    .then(() => {
      Account.findAll({ where: {} })
      .then((results) => {
        expect(results.length).to.equal(2);
        expect(results[1].username).to.equal('Mary Jane');
        done();
      });
    });
  });

});
