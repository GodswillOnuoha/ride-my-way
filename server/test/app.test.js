
// import chai, { expect } from 'chai';
// import chaiHttp from 'chai-http';
// import ngFaker from 'ng-faker';

// chai.use(chaiHttp);

// const url = 'https://carpoolapp1.herokuapp.com';

// describe('Test for auth endpoints for Ride-my-way ride API', () => {
//   const firstName = ngFaker.name.firstName();
//   const lastName = ngFaker.name.lastName();
//   const email = `${firstName}.${lastName}@gmail.com`.toLowerCase();
//   const user = {

//     name: `${firstName} ${lastName}`,
//     email: `${email}`,
//     password: `${firstName.toLowerCase()}Password`,

//   };


//   describe('POST create new user', () => {
//     it('should return an object with success with an object of created resources', (done) => {
//       chai
//         .request(url)
//         .post('/api/v1/auth/register')
//         .set('Accept', 'application/json')
//         .set('Content-Type', 'application/x-www-form-urlencoded')
//         .send(user)
//         .end((err, res) => {
//           expect(err).to.equal(null);
//           expect(res.status).to.equal(201);
//           expect(res.body.status).to.equal('success');
//           expect(res.body.user).to.be.an('object');
//           done();
//         });
//     });
//   });
// });

//   describe('POST create new user with empty data', () => {
//     it('should return error', (done) => {
//       chai

//         .request('https://ride-my-way-andela.herokuapp.com')

//         .post('/api/v1/auth/register')

//         .set('Accept', 'application/json')

//         .set('Content-Type', 'application/x-www-form-urlencoded')

//         .send({

//           name: '   ',

//           email: 'iamuchejude@gmail.com',

//           password: 'testPassword',

//         })

//         .end((err, res) => {
//           expect(err).to.equal(null);

//           expect(res.status).to.equal(409);

//           expect(res.body.status).to.equal('error');

//           done();
//         });
//     });
//   });


//   describe('POST log user in', () => {
//     it('should return an object with success with an object containing auth token if auth is successfull', (done) => {
//       chai

//         .request('https://ride-my-way-andela.herokuapp.com')

//         .post('/api/v1/auth/login')

//         .set('Accept', 'application/json')

//         .set('Content-Type', 'application/x-www-form-urlencoded')

//         .send({

//           email: 'nuchejuded@gmail.com',

//           password: 'changeMyPassword',

//         })

//         .end((err, res) => {
//           expect(err).to.equal(null);

//           expect(res.status).to.equal(200);

//           expect(res.body.status).to.equal('success');

//           expect(res.body.data).to.be.an('object');

//           expect(res.body.data.isAuth).to.equal(true);

//           done();
//         });
//     });
//   });


//   describe('POST log user in with empty data', () => {
//     it('should return error', (done) => {
//       chai

//         .request('https://ride-my-way-andela.herokuapp.com')

//         .post('/api/v1/auth/login')

//         .set('Accept', 'application/json')

//         .set('Content-Type', 'application/x-www-form-urlencoded')

//         .send({

//           email: '  ',

//           password: 'changeMyPassword',

//         })

//         .end((err, res) => {
//           expect(err).to.equal(null);

//           expect(res.status).to.equal(409);

//           expect(res.body.status).to.equal('error');

//           done();
//         });
//     });
//   });
// });

// describe('API endpoints test', () => {
//   describe('default route test /api/v1/', () => {
//     it('should return Welcome!', (done) => {
//       chai
//         .request(server)
//         .get('/api/v1/')
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.have.property('message');
//  		      res.body.message.should.eql('Welcome!');
//         });
//       done();
//     });
//   });

//   describe('CREATE ride offer', () => {
//     it('should create a new ride offer', (done) => {
//       const ride = {
// 		    id: 0,
// 		    boadingStop: 'Ikorodu',
//         finalDestination: 'CMS',
//         time: '6:30am',
//         date: '29/06/2018',
//         vehicleType: 'toyota',
//         possibleStops: [],
//         requests: [],
// 		  };
//       chai
//         .request(server)
//         .post('/api/v1/rides')
//         .send(ride)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.should.have.property('message');
//         });
//       done();
//     });

//     it('should return a status code 400 if a required field is missing when creating ride', (done) => {
//       const ride = {
// 		    id: 0,
//         boarding_stop: 'Ikorodu',
//         final_dest: 'CMS',
//         ride_time: '6:30am',
//       };
//       chai
//         .request(server)
//         .post('/api/v1/rides')
//         .send(ride)
//         .end((err, res) => {
//           res.should.have.status(400);
//           res.body.should.have.property('error');
//         });
//       done();
//     });
//   });

//   describe('GET all rides api/v1/rides', () => {
//     it('should return all ride offers', (done) => {
//       chai
//         .request(server)
//         .get('/api/v1/rides')
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.have.property('message');
//           res.should.be.json;
//       	  res.body.rides.should.be.a('array');
//         });
//       done();
//     });
//   });

//   describe('GET single ride offer', () => {
//     it('should ride offer with given id', (done) => {
//       chai
//         .request(server)
//         .get('/api/v1/rides/1')
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.should.have.property('message');
//         });
//       done();
//     });

//     it('should return 404 errorif ride not found', (done) => {
//       chai
//         .request(server)
//         .get('/api/v1/rides/-1')
//         .end((err, res) => {
//           res.should.have.status(404);
//           res.should.be.json;
//           res.body.should.have.property('error');
//         });
//       done();
//     });
//   });

//   describe('POST request to join a ride', () => {
//     it('should return a request received ok status 200', (done) => {
//       chai
//         .request(server)
//         .post('/api/v1/rides/2/requests')
//         .send({ userId: '001' })
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.have.property('message');
//         });
//       done();
//     });
//     it('should return a 404 status code if ride does not exist', (done) => {
//       chai
//         .request(server)
//         .post('/api/v1/rides/-1/requests')
//         .send({ userId: '001' })
//         .end((err, res) => {
//           res.should.have.status(404);
//           res.body.should.have.property('error');
//         });
//       done();
//     });

//     it('should return a 400 status code if no userId', (done) => {
//       chai
//         .request(server)
//         .post('/api/v1/rides/2/requests')
//         .send({})
//         .end((err, res) => {
//           res.should.have.status(400);
//           res.body.should.have.property('error');
//         });
//       done();
//     });
//   });
// });
