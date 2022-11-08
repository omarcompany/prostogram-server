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
const userAvatar =
  "https://www.google.com/url?sa=i&url=https%3A%2F%2Fakspic.ru%2Falbum%2Fbest_wallpapers&psig=AOvVaw1KP_9mGiRtqbOXSU4JEw0c&ust=1667986706386000&source=images&cd=vfe&ved=0CA0QjRxqFwoTCKDA3L-knvsCFQAAAAAdAAAAABAE";
let token = "";
let cardName = "Some card";
let cardLink =
  "https://cakeshop.com.ua/images/m8S25qCov4Y/h:5000/watermark:0.8:ce:0:0:1/bG9jYWw/6Ly8vY2FrZXNob3AuY29tLnVhL3B1YmxpY19odG1sL3N0b3JhZ2UvYXBwL3B1YmxpYy9pbWcvcHJvZHVjdC85NDc0XzEuanBn";
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
