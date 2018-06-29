import express from 'express';
import rideController from '../controllers/ride';

const route = express.Router();

route.get('/', rideController.getAllRides);

export default route;
