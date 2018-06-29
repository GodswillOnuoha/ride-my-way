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

export default {
  getAllRides,
  getSingleRide,
};
