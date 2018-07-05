import log from 'fancy-log';
import rideModel from '../models/ride';

class rideControllers {
// returns all rides offers
  static getAllRides(req, res) {
    const result = rideModel.fetchRideOffers();
    result.then(data => res.status(200).json({
      message: 'succs',
      ride: data.rows,
    }));
  }

  // Get a single ride
  static getSingleRide(req, res) {
    const rideId = parseInt(req.params.rideId, 10);
    const result = rideModel.fetchRideOffer(rideId);
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
  }


  // process request to join ride
  static joinRide(req, res) {
    const rideId = parseInt(req.params.rideId, 10);

    rideModel.fetchRideOffer(rideId)
      .then((rideRes) => {
        // check ride exists
        if (!rideRes.rows[0]) {
          res.status(400).json({
            error: 'invalid ride or user id',
          });
        }

        // existing requests
        const joinReqObj = JSON.parse(rideRes.rows[0].joinrequests);
        const profile = { username: req.profile.profile.username };
        if (joinReqObj.requests.includes(profile.username)
        || joinReqObj.accepted.includes(profile.username)
        || joinReqObj.rejected.includes(profile.username)
        ) {
          res.status(400).json({
            error: 'cant join this ride again',
          });
        } else { joinReqObj.requests.push(profile.username); }
        // // make set entries unique
        // const joinReqSet = new Set(joinReq);


        const addRequest = rideModel.addRideRequest(rideId, JSON.stringify(joinReqObj));
        addRequest.then(() => {
          res.status(200).json({
            message: 'success',
          });
        })
          .catch((error) => {
            log(error);
            res.status(500).json({
              error: 'unable to write request to db ',
            });
          });
      })
      .catch((error) => {
        log(error);
        res.status(400).json({
          error: 'invalid user ',
        });
      });
  }

  // process request to join ride
  static createRide(req, res) {
    const newRide = {
      boardingStop: req.body.boardingStop,
      finalDestination: req.body.finalDestination,
      rideTime: req.body.time,
      rideDate: req.body.date,
      vehicleType: req.body.vehicleType,
      possibleStops: req.body.possibleStops,
      userId: req.profile.profile.userId,
      joinRequests: {
        requests: [],
        accepted: [],
        rejected: [],
      },
    };

    if (!newRide.possibleStops) {
      log('setting stopps ');
      newRide.possibleStops = [];
    }

    // return error if a field is missing
    // ME: Learn and use express validator next !!!!!!
    if (!newRide.boardingStop || !newRide.finalDestination || !newRide.rideTime
     || !newRide.rideDate) {
      res.status(400).json({
        error: 'missing fields',
      });
    }

    rideModel.createRide(newRide)
      .then((result) => {
        if (result.rowCount) {
          res.status(200).json({
            message: 'Sucess!',
          });
        }
        res.status(500).json({
          error: 'database error!',
        });
      })
      .catch((error) => {
        log(error);
        res.status(500).json({
          error: 'server error ',
        });
      });
  }

  static getAllRequests(req, res) {
    const rideId = parseInt(req.params.rideId, 10);
    if (!rideId) {
      res.status(400).json({
        error: 'missing id field',
      });
    } else {
      rideModel.fetchRideOffer(rideId)
        .then((rideRes) => {
        // check ride exists
          if (!rideRes.rows[0]) {
            res.status(404).json({
              error: 'invalid ride',
            });
          } else {
            res.status(200).json({
              message: 'success',
              requests: JSON.parse(rideRes.rows[0].joinrequests),
            });
          }
        });
    }
  }
}

export default rideControllers;
