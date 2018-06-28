//var assert = require('assert');


const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const should = chai.should();

chai.use(chaiHttp);

describe('API endpoints test', () => {
  describe('default route test /', () => {
    it('should return Hello World', (done) => {
      chai
        .request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message');
 		  res.body.message.should.eql('Hello World!');
        });
      done();
    });
  });

  describe('CREATE ride offer', () => {
    it('should create a new ride offer', (done) => {
      const ride = {
		    id: 0,
		    boarding_stop : 'Ikorodu',
			final_dest : 'CMS',
			ride_time : '6:30am',
			ride_date : '29/06/2018',
		    vehicle_type : 'toyota',
			possible_stops :[],
			requests : []
		  };
      chai
        .request(server)
        .post('/api/v1/rides')
        .send(ride)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('message');
        });
      done();
    });

    it('should return a status code 400 if a required field is missing when creating ride', (done) => {
      const ride = {
		    id: 0,
		    boarding_stop : 'Ikorodu',
			final_dest : 'CMS',
			ride_time : '6:30am'
      };
      chai
        .request(server)
        .post('/api/v1/rides')
        .send(ride)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
 		  res.body.error.should.eql('missing fields');
        });
      done();
    });
  });

  describe('GET all rides api/v1/rides', () => {
    it('should return all ride offers', (done) => {
      chai
        .request(server)
        .get('/api/v1/rides')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
      	  res.body.should.be.a('array');
        });
      done();
    });
  });

  describe('GET single ride offer', () => {
    it('should get a single ride offer with given id', (done) => {
      chai
        .request(server)
        .get('/api/v1/rides/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
        });
      done();
    });
  });

  describe('POST request to join a ride', () => {
    it('should return a request received ok status 200', (done) => {
      chai
        .request(server)
        .post('/api/v1/rides/2/requests')
        .send({ userId: '001' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message');
        });
      done();
    });
    it('should return a 404 status code if ride does not exist', (done) => {
      chai
        .request(server)
        .post('/api/v1/rides/0/requests')
        .end((err, res) => {
         res.should.have.status(404);
        });
      done();
    });

    it('should return a 400 status code if no userId', (done) => {
      chai
        .request(server)
        .post('/api/v1/rides/2/requests')
        .send({})
        .end((err, res) => {
           res.should.have.status(400);
           res.body.should.have.property('error');
 		   res.body.error.should.eql('no userId');
        });
      done();
    });
  });

});
