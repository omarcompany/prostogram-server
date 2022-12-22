process.env.NODE_ENV = "test";

const { AVATAR_STATIC_PATH } = require("../settings");
const { TOKEN_TYPE } = require("../constants/constants");
const User = require("../models/user");

const chai = require("chai");
const chaiHttp = require("chai-http");
const fs = require("fs");
const md5 = require("md5");
const path = require("path");
const server = require("../app");
const should = chai.should();

chai.use(chaiHttp);

const testUser = {
  name: "Fedya",
  email: "anothertestmail@gmail.com",
  password: "1234567890",
  about: "I am an engeneer",
  id: "",
  token: "",
  avatar: "",
};

const testAvatar = {
  name: "test-avatar.jpg",
  path: path.join(__dirname, "src", "test-avatar.jpg"),
  hashSum: "",
};

describe("User", () => {
  before((done) => {
    if (fs.existsSync(AVATAR_STATIC_PATH)) {
      fs.rmSync(AVATAR_STATIC_PATH, { recursive: true, force: true });
    }
    fs.mkdirSync(AVATAR_STATIC_PATH);

    User.deleteMany({}, (error) => done());
  });

  describe("POST /signup", () => {
    it("it should POST a user", (done) => {
      const user = {
        name: testUser.name,
        about: testUser.about,
        email: testUser.email,
        password: testUser.password,
      };
      chai
        .request(server)
        .post("/signup")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("_id");
          res.body.should.have.property("name");
          res.body.should.have.property("avatar");
          res.body.should.have.property("about");
          res.body.should.have.property("email");
          res.body.should.not.have.property("password");
          done();
        });
    });
  });

  describe("POST /signin", () => {
    it("sign in", (done) => {
      const user = {
        email: testUser.email,
        password: testUser.password,
      };
      chai
        .request(server)
        .post("/signin")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("token");
          res.body.should.not.have.property("password");
          testUser.token = res.body.token;
          done();
        });
    });
  });

  describe("GET /user/me", () => {
    it("should get current user", (done) => {
      chai
        .request(server)
        .get("/user/me/")
        .set("authorization", `${TOKEN_TYPE}${testUser.token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("_id");
          res.body.should.have.property("name");
          res.body.should.have.property("avatar");
          res.body.should.have.property("about");
          res.body.should.have.property("email");
          res.body.should.not.have.property("password");
          testUser.id = res.body._id;
          done();
        });
    });
  });

  describe("GET /users/:id", () => {
    it("should get user by id", (done) => {
      chai
        .request(server)
        .get("/users/" + testUser.id)
        .set("authorization", `${TOKEN_TYPE}${testUser.token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("_id");
          res.body.should.have.property("name");
          res.body.should.have.property("avatar");
          res.body.should.have.property("about");
          res.body.should.not.have.property("email");
          res.body.should.not.have.property("password");
          done();
        });
    });
  });

  describe("PATCH /user/me", () => {
    it("should change user name", (done) => {
      testUser.name = "Vasya";
      testUser.about = "I am a writer";
      const user = { name: testUser.name, about: testUser.about };
      chai
        .request(server)
        .patch("/user/me")
        .set("authorization", `${TOKEN_TYPE}${testUser.token}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("name");
          res.body.should.have.property("about");
          done();
        });
    });
  });

  describe("GET /user/me", () => {
    it(`should check current user was changed to ${testUser.name}`, (done) => {
      chai
        .request(server)
        .get("/user/me/")
        .set("authorization", `${TOKEN_TYPE}${testUser.token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("name");
          res.body.name.should.be.eql(testUser.name);
          res.body.should.have.property("about");
          res.body.about.should.be.eql(testUser.about);
          done();
        });
    });
  });

  describe("PATCH /user/me/avatar", () => {
    it("It should test update avatar", (done) => {
      chai
        .request(server)
        .patch("/user/me/avatar")
        .set("authorization", `${TOKEN_TYPE}${testUser.token}`)
        .attach("file", testAvatar.path)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("_id");
          res.body.should.have.property("name");
          res.body.should.have.property("avatar");
          res.body.should.have.property("about");
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

  describe("GET avatar", () => {
    it("It should check the avatar is correct", (done) => {
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
