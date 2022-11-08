process.env.NODE_ENV = "test";

const User = require("../models/user");

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const should = chai.should();

chai.use(chaiHttp);

const userEmail = "anothertestmail@gmail.com";
const userPassword = "1234567890";
const userAbout = "I am an engeneer";
const userAvatar =
  "https://www.google.com/url?sa=i&url=https%3A%2F%2Fakspic.ru%2Falbum%2Fbest_wallpapers&psig=AOvVaw1KP_9mGiRtqbOXSU4JEw0c&ust=1667986706386000&source=images&cd=vfe&ved=0CA0QjRxqFwoTCKDA3L-knvsCFQAAAAAdAAAAABAE";
let token = "";
let userId = "";
const anotherName = "Vasya";
const anotherAvatar =
  "https://img1.akspic.ru/previews/9/2/2/9/6/169229/169229-fioletovyj_esteticheskoj-estetika-purpur-tsvetnoy-temno_fioletovyj-500x.jpg";
const anotherAbout = "I am a writer";

describe("User", () => {
  before((done) => {
    User.deleteMany({}, (error) => done());
  });

  describe("POST /signup", () => {
    it("it should POST a user", (done) => {
      const user = {
        name: "Fedya",
        avatar: userAvatar,
        about: `I am an engeneer`,
        email: userEmail,
        password: userPassword,
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
        email: userEmail,
        password: userPassword,
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
          token = res.body.token;
          done();
        });
    });
  });

  describe("GET /user/me", () => {
    it("should get current user", (done) => {
      chai
        .request(server)
        .get("/user/me/")
        .set("authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("_id");
          res.body.should.have.property("name");
          res.body.should.have.property("avatar");
          res.body.should.have.property("about");
          res.body.should.have.property("email");
          res.body.should.not.have.property("password");
          userId = res.body._id;
          done();
        });
    });
  });

  describe("GET /users/:id", () => {
    it("should get user by id", (done) => {
      chai
        .request(server)
        .get("/users/" + userId)
        .set("authorization", `Bearer ${token}`)
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
      const user = { name: anotherName, about: anotherAbout };
      chai
        .request(server)
        .patch("/user/me")
        .set("authorization", `Bearer ${token}`)
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
    it(`should check current user was changed to ${anotherName}`, (done) => {
      chai
        .request(server)
        .get("/user/me/")
        .set("authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("name");
          res.body.name.should.be.eql(anotherName);
          res.body.should.have.property("about");
          res.body.about.should.be.eql(anotherAbout);
          done();
        });
    });
  });

  describe("PATCH /user/me/avatar", () => {
    it("should change user avatar", (done) => {
      const user = { avatar: anotherAvatar };
      chai
        .request(server)
        .patch("/user/me/avatar")
        .set("authorization", `Bearer ${token}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("avatar");
          done();
        });
    });
  });

  describe("GET /user/me", () => {
    it(`should check current user avatar was changed to ${anotherAvatar}`, (done) => {
      chai
        .request(server)
        .get("/user/me/")
        .set("authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("avatar");
          res.body.avatar.should.be.eql(anotherAvatar);
          done();
        });
    });
  });
});