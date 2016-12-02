/* global define, it, xit, describe, before,  beforeEach, afterEach, done  */
import { expect } from 'chai';
import accountServices from '../src/services/accountServices';
import Account from '../src/models/accountModel';

describe('Test accountServices', () => {
  // Before each and every test in below, wipe db
  beforeEach((done) => {
    Account.destroy({ where: {} })
    .then(() => done())
    .catch(err => console.log('ERROR: ', err.sql));
  });

  describe('Account Creation', () => {
    it('Should create an Account when a new req.user email comes in', (done) => {
      accountServices.create({
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
      accountServices.create({
        account: {
          username: 'John Doe',
          email: 'john@test.com',
        },
      }, 'john@test.com')
      .then(() =>
        accountServices.create({
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
      accountServices.create({
        account: {
          username: 'John Doe',
          email: 'john@test.com',
        },
      }, 'john@test.com')
      .then(() =>
        accountServices.create({
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
    /* End 'Account Creation' */
  });

  describe('Account Updating', () => {
    // Before only this block of tests
      // Create a test account to work with
    beforeEach((done) => {
      accountServices.create({
        account: {
          username: 'John Doe',
          email: 'john@test.com',
        },
      }, 'john@test.com')
      .then(() => done())
      .catch(err => console.log('Error in beforeEach Acount Updating', err));
    });

    it('Should update an account\'s information', (done) => {
      accountServices.update({
        account: {
          username: 'Barry Allen',
          timezone: 'EST',
          phone: '1112223333',
        },
      }, 'john@test.com')
      .then(() => {
        Account.findAll({ where: {} })
        .then((results) => {
          expect(results.length).to.equal(1);
          const user = results[0];
          expect(user.username).to.equal('Barry Allen');
          expect(user.phone).to.equal('1112223333');
          expect(user.timezone).to.equal('EST');
          expect(user.email).to.equal('john@test.com');
          done();
        });
      });
    });

    it('Should not update an account\'s email if passed in a new one', (done) => {
      accountServices.update({
        account: {
          email: 'barry@test.com',
        },
      }, 'john@test.com')
      .then(() => {
        Account.findAll({ where: {} })
        .then((results) => {
          expect(results.length).to.equal(1);
          const user = results[0];
          expect(user.email).to.not.equal('barry@test.com');
          done();
        });
      });
    });

    it('Should not update any accounts if the account does not exist', (done) => {
      accountServices.update({
        account: {
          username: 'maliciousUser',
        },
      }, 'non-existant-email@test.com')
      .catch(() => {
        Account.findAll({ where: { username: 'maliciousUser' } })
        .then((results) => {
          expect(results.length).to.equal(0);
          done();
        });
      });
    });

    it('Should not update the account for malformed data passed in', (done) => {
      accountServices.update({
        badData: {
          username: 'bad-data',
          account: {
            username: 'should not use this',
          },
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

    it('Should not update the account for an empty body', (done) => {
      accountServices.update({}, 'john@test.com')
      .then(() => {
        Account.findAll({ where: {} })
        .then((results) => {
          expect(results.length).to.equal(1);
          expect(results[0].username).to.equal('John Doe');
          done();
        });
      });
    });
    /* End 'Account Updating' */
  });


  describe('Account Info Retrieval', () => {
    // Create a new account and fill in blank fields
    beforeEach((done) => {
      accountServices.create({
        account: {
          username: 'John Doe',
          email: 'john@test.com',
        },
      }, 'john@test.com')
      .then(() => accountServices.update({
        account: {
          phone: '1112223333',
          timezone: 'EST',
        },
      }, 'john@test.com'))
      .then(() => done())
      .catch(err => console.log('Error in beforeEach Acount Info Retrieval', err));
    });

    it('Should retrieve account info we put in based on Amazon OAuth email as a string', (done) => {
      accountServices.read({}, 'john@test.com')
      .then((account) => {
        expect(account).to.be.a('string');

        const parsedAccount = JSON.parse(account);
        expect(parsedAccount.username).to.equal('John Doe');
        expect(parsedAccount.email).to.equal('john@test.com');
        expect(parsedAccount.phone).to.equal('1112223333');
        expect(parsedAccount.timezone).to.equal('EST');
        done();
      });
    });

    it('Should retrieve account info with id that Sequelize added automatically', (done) => {
      accountServices.read({}, 'john@test.com')
      .then((account) => {
        const parsedAccount = JSON.parse(account);
        expect(parsedAccount.id).to.be.a('number');
        done();
      });
    });

    it('Should retrieve account info with an array of children', (done) => {
      accountServices.read({}, 'john@test.com')
      .then((account) => {
        const parsedAccount = JSON.parse(account);
        expect(parsedAccount.children).to.be.an('array');
        done();
      });
    });

    it('Should catch an error with a string if an incorrect email is given', (done) => {
      accountServices.read({}, 'badEmail@test.com')
      .catch((error) => {
        expect(error).to.be.a('string');
        done();
      });
    });
    /* End 'Account Info Retrieval' */
  });
});
