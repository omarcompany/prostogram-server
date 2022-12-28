process.env.NODE_ENV = 'test';
require('./token-service');

const chai = require('chai');
const fs = require('fs');
const should = chai.should();

const { AVATAR_STATIC_PATH } = require('../settings');
const { HTTP_RESPONSE } = require('../src/constants/errors');
const { TEST_USER_EMAIL } = require('config');
const Token = require('../src/models/token');
const User = require('../src/models/user');
const UserService = require('../src/services/user-service');

const testUser = {
  name: 'Vasya',
  email: TEST_USER_EMAIL,
  password: 'test-password',
  avatar: '',
  about: 'I am a musician',
};

describe('User Service', () => {
  // Clear test files before starting
  before(async () => {
    if (fs.existsSync(AVATAR_STATIC_PATH)) {
      fs.rmSync(AVATAR_STATIC_PATH, { recursive: true, force: true });
    }
    fs.mkdirSync(AVATAR_STATIC_PATH);

    await User.deleteMany({});
    await Token.deleteMany({});
  });

  describe('Create user', () => {
    it('it should test create user', (done) => {
      UserService.createUser({
        name: testUser.name,
        avatar: testUser.avatar,
        about: testUser.about,
        email: testUser.email,
        password: testUser.password,
      })
        .then((userData) => {
          userData.should.have.property('id');
          userData.should.have.property('name');
          userData.should.have.property('email');
          userData.should.have.property('isActivated');
          userData.should.have.property('avatar');
          userData.should.have.property('about');
          userData.should.not.have.property('accessToken');
          userData.should.not.have.property('refreshToken');
          userData.should.not.have.property('password');
          userData.isActivated.should.be.eql(false);
          done();
        })
        .catch((err) => done(err));
    });

    it('it should return bad request error', (done) => {
      UserService.createUser({
        name: testUser.name,
        avatar: testUser.avatar,
        about: testUser.about,
        email: testUser.email,
        password: testUser.email,
      })
        .then()
        .catch((error) => {
          error.message.should.be.eql(HTTP_RESPONSE.badRequest.message);
          done();
        });
    });
  });

  describe('Activate account', () => {
    it('it should return error after trying signin without account activation', (done) => {
      UserService.login(testUser.email, testUser.password)
        .then()
        .catch((error) => {
          error.message.should.be.eql(
            HTTP_RESPONSE.forbidden.absentMessage.noActivation
          );
          done();
        });
    });

    it('it should test activation link', async () => {
      const { activationLink } = await User.findOne({ email: testUser.email });

      const userData = await UserService.activateAccount(activationLink);

      userData.should.have.property('isActivated');
      userData.isActivated.should.be.eql(true);
    });

    it('it should test the activation link was used', async () => {
      const { activationLink } = await User.findOne({ email: testUser.email });
      activationLink.should.be.eql('');
    });
  });

  describe('Login', () => {
    it('it should test login', (done) => {
      UserService.login(testUser.email, testUser.password)
        .then((userData) => {
          userData.should.have.property('id');
          userData.should.have.property('name');
          userData.should.have.property('email');
          userData.should.have.property('isActivated');
          userData.should.have.property('avatar');
          userData.should.have.property('about');
          userData.should.have.property('accessToken');
          userData.should.have.property('refreshToken');
          userData.should.not.have.property('password');
          userData.isActivated.should.be.eql(true);
          testUser.refreshToken = userData.refreshToken;
          done();
        })
        .catch((err) => done(err));
    });

    it('it should return not found error', (done) => {
      UserService.login('fakeemail@mail.ru', testUser.password)
        .then()
        .catch((error) => {
          error.message.should.be.eql(HTTP_RESPONSE.notFound.absentedMessage.user);
          done();
        });
    });
  });

  describe('Refresh token', () => {
    it('it should test refresh token', (done) => {
      UserService.refreshToken(testUser.refreshToken)
        .then((userData) => {
          userData.should.have.property('id');
          userData.should.have.property('name');
          userData.should.have.property('email');
          userData.should.have.property('isActivated');
          userData.should.have.property('avatar');
          userData.should.have.property('about');
          userData.should.have.property('accessToken');
          userData.should.have.property('refreshToken');
          userData.should.not.have.property('password');
          done();
        })
        .catch((err) => done(err));
    });
  });
  describe('Logout', () => {
    it('it should test logout', (done) => {
      UserService.logout(testUser.refreshToken)
        .then((isSuccess) => {
          isSuccess.should.be.eql(true);
          done();
        })
        .catch((err) => done(err));
    });
  });
  describe('Refresh token after logout', () => {
    it('it should return unauthorized error', (done) => {
      UserService.refreshToken(testUser.refreshToken)
        .then()
        .catch((error) => {
          error.message.should.be.eql(HTTP_RESPONSE.unauthorized.message);
          done();
        });
    });
  });
});
