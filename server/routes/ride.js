import express from 'express';
import Ride from '../controllers/ride';
import authMiddleware from '../middleware';

const route = express.Router();

route.get('/', authMiddleware, Ride.getAllRides);
route.get('/:rideId', authMiddleware, Ride.getSingleRide);
route.post('/:rideId/requests', authMiddleware, Ride.joinRide);
export default route;
