/* global define, it, xit, describe, before,  beforeEach, afterEach, done  */
import { expect } from 'chai';
import accountServices from '../src/services/accountServices';
import childrenServices from '../src/services/childrenServices';
import Account from '../src/models/AccountModel';
import Child from '../src/models/childModel';

describe('Test childrenServices', () => {
  // Before each and every test in below, wipe db
  beforeEach((done) => {
    Account.destroy({ where: {} })
    .then(() =>
      accountServices.create({
        account: {
          username: 'John Doe',
          email: 'john@test.com',
        },
      }, 'john@test.com'))
    .then(() => done())
    .catch(err => console.log('ERROR: ', err.sql));
  });

  describe('Child Creation', () => {
    it('Should create Child for a given user', (done) => {
      childrenServices.addChild({
        child: {
          name: 'Jill',
          phone: '9998887777',
        },
      }, 'john@test.com')
      .then(() => {
        Child.findAll({ where: { name: 'Jill' } })
        .then((results) => {
          expect(results.length).to.equal(1);

          expect(results[0].name).to.equal('Jill');
          done();
        });
      });
    });

    it('Should catch an error when creating a Child if the child\'s name is already in use for the account', (done) => {
      childrenServices.addChild({
        child: {
          name: 'Jill',
          phone: '9998887777',
        },
      }, 'john@test.com')
      .then(() =>
        childrenServices.addChild({
          child: {
            name: 'Jill',
            phone: '9998887777',
          },
        }, 'john@test.com'))
      .catch(() => {
        Child.findAll({ where: { name: 'Jill' } })
        .then((results) => {
          expect(results.length).to.equal(1);
          expect(results[0].name).to.equal('Jill');
          done();
        });
      });
    });

    it('Should not add a child if the child object is missing', (done) => {
      childrenServices.addChild({}, 'john@test.com')
      .catch(() => {
        Child.findAll({ where: {} })
        .then((results) => {
          expect(results.length).to.equal(0);
          done();
        });
      });
    });

    it('Should not add a child if the child object does not contain a name', (done) => {
      childrenServices.addChild({
        child: {
          phone: '1112223333',
        },
      }, 'john@test.com')
      .catch(() => {
        Child.findAll({ where: {} })
        .then((results) => {
          expect(results.length).to.equal(0);
          done();
        });
      });
    });

    it('Should not add a child if the child object does not contain a phone', (done) => {
      childrenServices.addChild({
        child: {
          name: 'Jill',
        },
      }, 'john@test.com')
      .catch(() => {
        Child.findAll({ where: {} })
        .then((results) => {
          expect(results.length).to.equal(0);
          done();
        });
      });
    });
    /* End 'Child Creation' */
  });
});
