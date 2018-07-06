import express from 'express';
import Ride from '../controllers/ride';
import authMiddleware from '../middleware';

const route = express.Router();

route.post('/rides', authMiddleware, Ride.createRide);
route.get('/rides/:rideId/requests', authMiddleware, Ride.getAllRequests);
route.put('/rides/:rideId/requests/:requestId', authMiddleware, Ride.respondToJoinRequests);
export default route;
