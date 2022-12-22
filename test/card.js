process.env.NODE_ENV = "test";

require("./user");

const Card = require("../models/card");
const { CARD_STATIC_PATH } = require("../settings");
const User = require("../models/user");
const { TOKEN_TYPE } = require("../constants/constants");

const chai = require("chai");
const chaiHttp = require("chai-http");
const fs = require("fs");
const md5 = require("md5");
const path = require("path");
const server = require("../app");
const should = chai.should();

chai.use(chaiHttp);

const testUser = {
  email: "anothertestmail@gmail.com",
  password: "1234567890",
  token: "",
};

const testCard = {
  name: "Some card",
  id: "",
  filePath: path.join(__dirname, "src", "test-card.jpg"),
};

describe("Card", () => {
  before(async () => {
    if (fs.existsSync(CARD_STATIC_PATH)) {
      fs.rmSync(CARD_STATIC_PATH, { recursive: true, force: true });
    }
    fs.mkdirSync(CARD_STATIC_PATH);

    await User.deleteMany({});
    await Card.deleteMany({});
  });

  before((done) => {
    const user = {
      name: "Fedya",
      about: `I am an engeneer`,
      email: testUser.email,
      password: testUser.password,
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
      email: testUser.email,
      password: testUser.password,
    };
    chai
      .request(server)
      .post("/signin")
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        testUser.token = res.body.token;
        done();
      });
  });

  describe("POST /cards", () => {
    it("it should create a card", (done) => {
      const card = {
        name: testCard.name,
      };
      chai
        .request(server)
        .post("/cards")
        .set("authorization", `${TOKEN_TYPE}${testUser.token}`)
        .field(card)
        .attach("file", testCard.filePath)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("_id");
          res.body.should.have.property("name");
          res.body.should.have.property("urn");
          res.body.should.have.property("likes");
          res.body.should.have.property("createdAt");
          testCard.urn = res.body.urn;
          done();
        });
    });
  });

  // Get hash of the test card
  before((done) => {
    fs.readFile(testCard.filePath, (err, buf) => {
      testCard.hashSum = md5(buf);
      done();
    });
  });

  describe("GET card image by static path ", () => {
    it("It should check the test card is correct", (done) => {
      chai
        .request(server)
        .get(`/${testCard.urn}`)
        .end((err, res) => {
          md5(res.body).should.be.eql(testCard.hashSum);
          done();
        });
    });
  });

  describe("GET /cards", () => {
    it("it should get all cards", (done) => {
      chai
        .request(server)
        .get("/cards")
        .set("authorization", `${TOKEN_TYPE}${testUser.token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.should.have.lengthOf(1);

          const card = res.body[0];
          card.should.have.property("_id");
          card.should.have.property("name");
          card.should.have.property("urn");
          card.should.have.property("createdAt");
          card.should.have.property("likes");
          card.likes.should.be.a("array");
          testCard.id = card._id;

          const { name, likes } = card;
          name.should.be.eql(testCard.name);
          likes.should.have.lengthOf(0);
          done();
        });
    });
  });

  describe("PUT /cards/:id/likes", () => {
    it("it should add like to card", (done) => {
      chai
        .request(server)
        .put(`/cards/${testCard.id}/likes`)
        .set("authorization", `${TOKEN_TYPE}${testUser.token}`)
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
        .set("authorization", `${TOKEN_TYPE}${testUser.token}`)
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
        .delete(`/cards/${testCard.id}/likes`)
        .set("authorization", `${TOKEN_TYPE}${testUser.token}`)
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
        .set("authorization", `${TOKEN_TYPE}${testUser.token}`)
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
        .delete(`/cards/${testCard.id}`)
        .set("authorization", `${TOKEN_TYPE}${testUser.token}`)
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
        .set("authorization", `${TOKEN_TYPE}${testUser.token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.should.have.lengthOf(0);
          done();
        });
    });
  });
});
