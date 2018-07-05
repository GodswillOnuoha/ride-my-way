import db from '../models/ride';

// returns all rides offers
const getAllRides = (req, res) => {
  const result = db.fetchRideOffers();
  result.then(data => res.status(200).json({
    message: 'succs',
    ride: data.rows,
  }));
};

// Get a single ride
const getSingleRide = (req, res) => {
  const rideId = parseInt(req.params.rideId, 10);
  const result = db.fetchRideOffer(rideId);
  result.then((data) => {
    const ride = data.rows[0];

    if (ride === undefined) {
      return res.status(404).json({
        error: 'no ride with id found',
      });
    }

    return res.status(200).json({
      message: 'Sucess!',
      ride,
    });
  });
};


// process request to join ride
const joinRide = (req, res) => {
  const rideId = parseInt(req.params.rideId, 10);
  const ride = db.fetchRideOffer(rideId);

  const requester = {
    userid: req.body.userId,
  };
  const userIds = [1, 2, 3, 4, 5, 6];

  ride.then((rideRes) => {
    const userid = parseInt(requester.userid, 10);

    // check ride exists
    if (!rideRes.rows[0]) {
      return res.status(400).json({
        error: 'no ride with id found',
      });
    }

    // validate user
    if (!userIds.includes(userid)) {
      return res.status(400).json({
        error: 'request user not valid',
      });
    }

    const joinReq = JSON.parse(rideRes.rows[0].joinrequests);
    joinReq.push(userid);

    // make set entries unique
    const joinReqSet = new Set(joinReq);


    const addRequest = db.addRideRequest(rideId, JSON.stringify(joinReqSet));
    addRequest.then((writeRes) => {
      if (writeRes.rowCount) {
        return res.status(200).json({
          message: 'success',
        });
      }
      return res.status(500).json({
        error: 'server error',
      });
    });
    return res.status(500).json({
      reeor: 'server error',
    });
  });
};


// process request to join ride
const createRide = (req, res) => {
  const newRide = {
    boadingStop: req.body.boadingStop,
    finalDestination: req.body.finalDestination,
    time: req.body.time,
    date: req.body.date,
    vehicleType: req.body.vehicleType,
    possibleStops: req.body.possibleStops,
  };

  if (!newRide.pStops) {
    newRide.pStops = [];
  }

  // return error if a field is missing
  // ME: Learn and use express validator next !!!!!!
  if (!newRide.boadingStop || !newRide.finalDestination || !newRide.time
     || !newRide.date) {
    return res.status(400).json({
      error: 'missing fields',
    });
  }

  const addRideRes = db.createRide(newRide);
  addRideRes.then((result) => {
    if (result.rowCount) {
      return res.status(200).json({
        message: 'Sucess!',
      });
    }
    return res.status(500).json({
      error: 'database error!',
    });
  });
  return res.status(500).json({
    error: 'server error!',
  });
};

export default {
  getAllRides,
  getSingleRide,
  joinRide,
  createRide,
};
