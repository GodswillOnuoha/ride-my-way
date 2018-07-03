import db from '../database/connection';

const fetchRideOffers = () => {
  const res = db.query('SELECT * FROM rideOffer');
  return res;
};

const fetchRideOffer = (rideId) => {
  // using prepared statement
  const query = {
    text: 'SELECT * FROM rideOffer WHERE rideId = $1',
    values: [rideId],
  };

  const res = db.query(query);
  return res;
};

const addRideRequest = (rideId, requests) => {
  // using prepared statement
  const query = {
    text: 'UPDATE rideOffer SET joinrequests = $1 WHERE rideId = $2',
    values: [requests, rideId],
  };

  const res = db.query(query);
  return res;
};

// add ride
const createRide = (ride) => {
  // using prepared statement
  const query = {
    text: 'INSERT INTO rideOffer (boardingStop, finalDestination, rideTime, rideDate, possibleStops, vehicleType, joinRequests, userId) VALUES($1, $2,$3,$4,$5,$6,$7,$8)',
    values: [ride.boardingStop, ride.finalDestination, ride.rideTime,
      ride.rideDate, ride.possibleStops, ride.vehicleType,
      ride.joinRequests, ride.userId],
  };

  const res = db.query(query);
  return res;
};

export default {
  fetchRideOffers,
  fetchRideOffer,
  addRideRequest,
  createRide,
};
