import database from '../models/ride';

const db = database;

// returns all rides offers
const getAllRides = (req, res) => {
  const rides = db.getAllRides();
  res.status(200).json({
    message: 'success',
    Rides: rides,
  });
};

export default {
  getAllRides,
};
