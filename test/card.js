process.env.NODE_ENV = "test";

require("./user");

const User = require("../models/user");
const Card = require("../models/card");

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const should = chai.should();

chai.use(chaiHttp);

const userEmail = "anothertestmail@gmail.com";
const userPassword = "1234567890";
let token = "";
let cardName = "Some card";
let cardLink = "some-link";
let cardId = "";

describe("Card", () => {
  before((done) => {
    User.deleteMany({}, (error) => done());
  });

  before((done) => {
    Card.deleteMany({}, (error) => done());
  });

  before((done) => {
    const user = {
      name: "Fedya",
      avatar: "no avatar",
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
        done();
      });
  });

  before((done) => {
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
        token = res.body.token;
        done();
      });
  });

  describe("POST /cards", () => {
    it("it should creat a card", (done) => {
      const card = {
        name: cardName,
        link: cardLink,
      };
      chai
        .request(server)
        .post("/cards")
        .set("authorization", `Bearer ${token}`)
        .send(card)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("_id");
          res.body.should.have.property("name");
          res.body.should.have.property("link");
          res.body.should.have.property("likes");
          res.body.should.have.property("createdAt");
          done();
        });
    });
  });

  describe("GET /cards", () => {
    it("it should get all cards", (done) => {
      chai
        .request(server)
        .get("/cards")
        .set("authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.should.have.lengthOf(1);

          const card = res.body[0];
          card.should.have.property("_id");
          card.should.have.property("name");
          card.should.have.property("link");
          card.should.have.property("createdAt");
          card.should.have.property("likes");
          card.likes.should.be.a("array");
          cardId = card._id;

          const { name, link, likes } = card;
          name.should.be.eql(cardName);
          link.should.be.eql(cardLink);
          likes.should.have.lengthOf(0);
          done();
        });
    });
  });

  describe("PUT /cards/:id/likes", () => {
    it("it should add like to card", (done) => {
      chai
        .request(server)
        .put(`/cards/${cardId}/likes`)
        .set("authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  describe("GET /cards", () => {
    it("it should check the card has a like", (done) => {
      chai
        .request(server)
        .get("/cards")
        .set("authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.should.have.lengthOf(1);

          const card = res.body[0];
          card.should.have.property("likes");
          card.likes.should.be.a("array");
          card.likes.should.have.lengthOf(1);
          done();
        });
    });
  });

  describe("DELETE /cards/:id/likes", () => {
    it("it should remove like from card", (done) => {
      chai
        .request(server)
        .delete(`/cards/${cardId}/likes`)
        .set("authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  describe("GET /cards", () => {
    it("it should check the like has been removed from the card", (done) => {
      chai
        .request(server)
        .get("/cards")
        .set("authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.should.have.lengthOf(1);

          const card = res.body[0];
          card.should.have.property("likes");
          card.likes.should.be.a("array");
          card.likes.should.have.lengthOf(0);
          done();
        });
    });
  });

  describe("DELETE /cards/:id", () => {
    it("it should remove the card", (done) => {
      chai
        .request(server)
        .delete(`/cards/${cardId}`)
        .set("authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("GET /cards", () => {
    it("it should check the card has been removed", (done) => {
      chai
        .request(server)
        .get("/cards")
        .set("authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.should.have.lengthOf(0);
          done();
        });
    });
  });
});
