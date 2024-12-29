const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
// const server = require('../server');
const {getDB} = require('../db/connection');
const { faker } = require('@faker-js/faker');

// let testTarget = require('supertest')(server);
const chaiRequest = chai.request('http://localhost:5050');

async function createRecord() {
    const record = {
        name: faker.person.fullName(),
        position: faker.person.jobTitle(),
        level: faker.helpers.arrayElement(['Junior', 'Mid', 'Senior'])
    };
    await chaiRequest.post('/record').send(record);
    return record;
}

describe('Records', () => {
  let recordId;

  // Test the POST route
  describe('/POST record', () => {
    it('it should POST a new record', () => {
      const record = {
        name: faker.person.fullName(),
        position: faker.person.jobTitle(),
        level: faker.helpers.arrayElement(['Junior', 'Mid', 'Senior'])
      };
        chaiRequest.post('/record')
        .send(record)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          // res.body.should.have.property('name').eql('John Doe');
          // res.body.should.have.property('position').eql('Developer');
          // res.body.should.have.property('level').eql('Junior');
          recordId = res.body.insertedId; // Save the record ID for later tests
        });
    });

    it('Search for a record', async () => {
      const db = await getDB();
      const collection = db.collection('records');
      await collection.deleteMany({});
      const record = await createRecord();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      let query = record.name.substring(0, 3);
      const res = await chaiRequest.get(`/record/search?q=${query}`);
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.should.have.length(1);
      res.body[0].should.have.property('name').eql(record.name);
    });
  });

  // Test the GET route
  describe('/GET/:id record', () => {
    it('it should GET a record by the given id', () => {
        chaiRequest.get(`/record/${recordId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('_id').eql(recordId);
        });
    });
  });

  // Test the PATCH route
  describe('/PATCH/:id record', () => {
    it('it should UPDATE a record given the id', () => {
      const updatedRecord = {
        name: 'Jane Doe',
        position: 'Senior Developer',
        level: 'Senior'
      };
        chaiRequest.patch(`/record/${recordId}`)
        .send(updatedRecord)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          // res.body.should.have.property('name').eql('Jane Doe');
          // res.body.should.have.property('position').eql('Senior Developer');
          // res.body.should.have.property('level').eql('Senior');
        });
    });
  });

  // Test the DELETE route
  describe('/DELETE/:id record', () => {
    it('it should DELETE a record given the id', () => {
        chaiRequest.delete(`/record/${recordId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          // res.body.should.have.property('message').eql('Record successfully deleted');
        });
    });
  });

  describe('Create 100 records', () => {
    it('it should create 100 records', async () => {
        for (let i = 0; i < 100; i++) {
            await createRecord();
        }
    });

  });
});
