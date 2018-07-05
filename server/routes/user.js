import express from 'express';
import rideController from '../controllers/ride';
import authMiddleware from '../middleware';

const route = express.Router();

route.post('/rides', authMiddleware, rideController.createRide);
route.get('/rides/:rideId/requests', authMiddleware, rideController.getAllRequests);
route.put('/rides/:rideId/requests/:requestId', authMiddleware, rideController.respondToJoinRequests);
export default route;
