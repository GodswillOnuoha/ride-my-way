import express from 'express';
import rideController from '../controllers/ride';

const route = express.Router();

route.get('/', rideController.getAllRides);
route.get('/:rideId', rideController.getSingleRide);

export default route;
