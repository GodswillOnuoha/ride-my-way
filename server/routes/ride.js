import express from 'express';
import rideController from '../controllers/ride';

const route = express.Router();

route.get('/', rideController.getAllRides);
route.get('/:rideId', rideController.getSingleRide);
route.post('/:rideId/requests', rideController.joinRide);
route.post('/', rideController.createRide);


export default route;
