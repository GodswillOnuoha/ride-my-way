import database from '../models/ride';

const db = database;

// returns all rides offers
const getAllRides = (req, res) => {
  const rides = db.getAllRides();
  res.status(200).json({
    message: 'success',
    rides,
  });
};

// Get a single ride
const getSingleRide = (req, res) => {
  const id = parseInt(req.params.rideId, 10);
  const ride = db.getRide(id);
  if (ride === undefined) {
    return res.status(404).json({
      error: `no ride with id - ${id} found`,
    });
  }
  return res.status(200).json({
    message: 'Sucess!',
    ride,
  });
};


// process request to join ride
const joinRide = (req, res) => {
  const id = parseInt(req.params.rideId, 10);
  const ride = db.getRide(id);

  if (ride === undefined) {
    return res.status(404).json({
      error: `no ride with id - ${id} found`,
    });
  }
  const userIds = [1, 2, 3, 4, 5];
  const requester = {
    userid: req.body.userId,
  };

  if (!userIds.includes(parseInt(requester.userid, 10))) {
    return res.status(400).json({
      error: 'request user not valid',
    });
  }
  return res.status(200).send({
    message: 'Ride has been requested',
    ride: db.updateJoinRequest(id, requester),
  });
};

// process request to join ride
const createRide = (req, res) => {
  const newRide = {
    bStop: req.body.boadingStop,
    fDestinantion: req.body.finalDestination,
    time: req.body.time,
    date: req.body.date,
    vType: req.body.vehicleType,
    pStops: req.body.possibleStops,
  };

  if (!newRide.pStops) {
    newRide.pStops = [];
  }

  // return error if a field is missing
  // ME: Learn and use express validator next !!!!!!
  if (!newRide.bStop || !newRide.fDestinantion || !newRide.time
     || !newRide.date) {
    return res.status(400).json({
      error: 'missing fields',
    });
  }

  db.addRide(newRide.bStop, newRide.fDestinantion,
    newRide.time, newRide.date, newRide.vType, newRide.pStops);

  return res.status(200).json({
    message: 'Sucess!',
    rideId: db.ids,
  });
};

export default {
  getAllRides,
  getSingleRide,
  joinRide,
  createRide,
};
