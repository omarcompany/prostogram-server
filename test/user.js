process.env.NODE_ENV = 'test';

require('./user-service');

const { AVATAR_STATIC_PATH } = require('../settings');
const { TEST_USER_EMAIL } = require('config');
const { TOKEN_TYPE } = require('../src/constants/constants');
const server = require('../src/app');
const Token = require('../src/models/token');
const User = require('../src/models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const md5 = require('md5');
const path = require('path');
const should = chai.should();

chai.use(chaiHttp);

const testUser = {
  name: 'Vasya',
  email: TEST_USER_EMAIL,
  password: 'test-password',
  avatar: '',
  about: 'I am a musician',
  id: '',
  token: '',
  avatar: '',
};

const testAvatar = {
  name: 'test-avatar.jpg',
  path: path.join(__dirname, 'src', 'test-avatar.jpg'),
  hashSum: '',
};

describe('User', () => {
  before(async () => {
    if (fs.existsSync(AVATAR_STATIC_PATH)) {
      fs.rmSync(AVATAR_STATIC_PATH, { recursive: true, force: true });
    }
    fs.mkdirSync(AVATAR_STATIC_PATH);

    await User.deleteMany({});
    await Token.deleteMany({});
  });

  describe('POST /signup', () => {
    it('it should POST a user', (done) => {
      const user = {
        name: testUser.name,
        about: testUser.about,
        email: testUser.email,
        password: testUser.password,
      };
      chai
        .request(server)
        .post('/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('avatar');
          res.body.should.have.property('about');
          res.body.should.have.property('email');
          res.body.should.have.property('isActivated');
          res.body.should.not.have.property('password');
          res.body.isActivated.should.be.eql(false);
          done();
        });
    });
  });

  describe('GET /activate/link', () => {
    it('it should activate account', (done) => {
      User.findOne({ email: testUser.email }).then((user) => {
        const { activationLink } = user;
        chai
          .request(server)
          .get(`/activate/${activationLink}`)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });

  describe('POST /signin', () => {
    it('sign in', (done) => {
      const user = {
        email: testUser.email,
        password: testUser.password,
      };
      chai
        .request(server)
        .post('/signin')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('avatar');
          res.body.should.have.property('about');
          res.body.should.have.property('email');
          res.body.should.have.property('isActivated');
          res.body.should.not.have.property('password');
          res.body.isActivated.should.be.eql(true);
          testUser.accessToken = res.body.accessToken;
          testUser.refreshToken = res.header['set-cookie'].pop().split(';')[0];
          done();
        });
    });
  });

  describe('GET /refresh', () => {
    it('it should refresh token', (done) => {
      chai
        .request(server)
        .get('/refresh')
        .set('Cookie', testUser.refreshToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('avatar');
          res.body.should.have.property('about');
          res.body.should.have.property('email');
          res.body.should.have.property('isActivated');
          res.body.should.not.have.property('password');
          res.body.isActivated.should.be.eql(true);
          res.body.accessToken.should.not.be.eql(testUser.accessToken);
          testUser.accessToken = res.body.accessToken;
          testUser.refreshToken = res.header['set-cookie'].pop().split(';')[0];
          done();
        });
    });
  });

  describe('GET /user/me', () => {
    it('should get current user', (done) => {
      chai
        .request(server)
        .get('/user/me/')
        .set('authorization', `${TOKEN_TYPE}${testUser.accessToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('avatar');
          res.body.should.have.property('about');
          res.body.should.have.property('email');
          res.body.should.have.property('isActivated');
          testUser.id = res.body.id;
          done();
        });
    });
  });

  describe('GET /users/:id', () => {
    it('should get user by id', (done) => {
      chai
        .request(server)
        .get('/users/' + testUser.id)
        .set('authorization', `${TOKEN_TYPE}${testUser.accessToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('avatar');
          res.body.should.have.property('about');
          res.body.should.have.property('email');
          res.body.should.not.have.property('isActivated');
          done();
        });
    });
  });

  describe('PATCH /user/me', () => {
    it('should change user name', (done) => {
      testUser.name = 'Vasya';
      testUser.about = 'I am a writer';
      const user = { name: testUser.name, about: testUser.about };
      chai
        .request(server)
        .patch('/user/me')
        .set('authorization', `${TOKEN_TYPE}${testUser.accessToken}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('avatar');
          res.body.should.have.property('about');
          res.body.should.have.property('email');
          done();
        });
    });
  });

  describe('GET /user/me', () => {
    it(`should check current user was changed to ${testUser.name}`, (done) => {
      chai
        .request(server)
        .get('/user/me/')
        .set('authorization', `${TOKEN_TYPE}${testUser.accessToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.name.should.be.eql(testUser.name);
          res.body.should.have.property('about');
          res.body.about.should.be.eql(testUser.about);
          done();
        });
    });
  });

  describe('PATCH /user/me/avatar', () => {
    it('It should test update avatar', (done) => {
      chai
        .request(server)
        .patch('/user/me/avatar')
        .set('authorization', `${TOKEN_TYPE}${testUser.accessToken}`)
        .attach('file', testAvatar.path)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('avatar');
          res.body.should.have.property('about');
          res.body.should.have.property('email');
          testUser.avatar = res.body.avatar;
          done();
        });
    });
  });

  // Get hash of the test file
  before((done) => {
    fs.readFile(testAvatar.path, (err, buf) => {
      testAvatar.hashSum = md5(buf);
      done();
    });
  });

  describe('GET avatar', () => {
    it('It should check the avatar is correct', (done) => {
      chai
        .request(server)
        .get(`/${testUser.avatar}`)
        .end((err, res) => {
          md5(res.body).should.be.eql(testAvatar.hashSum);
          done();
        });
    });
  });
});
