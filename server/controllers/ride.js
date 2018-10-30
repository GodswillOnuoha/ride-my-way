import Ride from '../models/ride';

class rideControllers {
  // returns all rides offers
  static getAllRides(req, res) {
    Ride.fetchRideOffers()
      .then(data => res.status(200).json({
        status: 'success',
        message: 'data retrieved',
        rides: data.rows,
      }))
      .catch(() => {
        res.status(500).json({
          status: 'error',
          message: 'database server error',
        });
      });
  }

  // Get a single ride
  static getSingleRide(req, res) {
    if (!req.params.rideId || Number.isNaN(req.params.rideId)) {
      res.status(200).json({
        status: 'fail',
        message: 'missing or invalid ride id',
      });
    } else {
      const rideId = parseInt(req.params.rideId, 10);

      Ride.fetchRideOffer(rideId)
        .then((data) => {
          const ride = data.rows[0];

          if (ride === undefined) {
            res.status(404).json({
              status: 'fail',
              message: 'ride offer not found',
            });
          } else {
            res.status(200).json({
              status: 'sucess!',
              ride,
            });
          }
        })
        .catch(() => {
          res.status(500).json({
            status: 'error',
            message: 'database server error',
          });
        });
    }
  }


  // process request to join ride
  static joinRide(req, res) {
    const rideId = parseInt(req.params.rideId, 10);

    Ride.fetchRideOffer(rideId)
      .then((rideRes) => {
        // check ride exists
        if (!rideRes.rows[0]) {
          res.status(404).json({
            status: 'fail',
            message: 'ride not found',
          });
        } else if (parseInt(rideRes.rows[0].userid, 10) === parseInt(req.profile.profile.userId, 10)) {
          res.status(401).json({
            status: 'fail',
            message: 'forbidden from joining your own ride',
          });
        } else {
          // existing requests
          const joinReqObj = JSON.parse(rideRes.rows[0].joinrequests);
          const profile = { username: req.profile.profile.username };
          if (joinReqObj.requests.includes(profile.username)
            || joinReqObj.accepted.includes(profile.username)
            || joinReqObj.rejected.includes(profile.username)
          ) {
            res.status(400).json({
              status: 'fail',
              message: 'cant join this ride again',
            });
          } else { joinReqObj.requests.push(profile.username); }


          const addRequest = Ride.addRideRequest(rideId, JSON.stringify(joinReqObj));
          addRequest.then(() => {
            res.status(202).json({
              status: 'success',
              message: 'join ride requested successfully',
            });
          })
            .catch(() => {
              res.status(500).json({
                status: 'error',
                message: 'unable to write request to db ',
              });
            });
        }
      })
      .catch(() => {
        res.status(500).json({
          status: 'error',
          message: 'internal database error ',
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
      newRide.possibleStops = [];
    } else {
      newRide.possibleStops = JSON.stringify(newRide.possibleStops.split(','))
    }
    console.log(newRide)

    // return error if a field is missing
    let missingFieldErrorMsg = '';
    if (!newRide.boardingStop) {
      missingFieldErrorMsg = 'boarding bus-stop missing';
    } else if (!newRide.finalDestination) {
      missingFieldErrorMsg = 'Destination missing';
    } else if (!newRide.rideTime) {
      missingFieldErrorMsg = 'departure time missing';
    } else if (!newRide.rideDate) {
      missingFieldErrorMsg = 'departure date missing';
    }
    if (missingFieldErrorMsg) {
      res.status(400).json({
        status: 'fail',
        message: missingFieldErrorMsg,
      });
    } else {
      Ride.createRide(newRide)
        .then((result) => {
          if (result.rowCount) {
            res.status(201).json({
              status: 'success',
              ride: newRide,
            });
          }
          res.status(500).json({
            status: 'error',
            message: 'internal server error!',
          });
        })
        .catch(() => {
          res.status(500).json({
            status: 'error',
            message: 'internal database error ',
          });
        });
    }
  }

  static getAllRequests(req, res) {
    if (Number.isNaN(req.params.rideId)) {
      res.status(200).json({
        status: 'fail',
        message: 'non integer ride-id supplied',
      });
    } else {
      const rideId = parseInt(req.params.rideId, 10);
      Ride.fetchRideOffer(rideId)
        .then((rideRes) => {
          if (!rideRes.rows[0]) {
            res.status(404).json({
              status: 'fail',
              message: 'ride not found',
            });
          } else if (parseInt(rideRes.rows[0].userid, 10)
            === parseInt(req.profile.profile.userId, 10)) {
            const requests = JSON.parse(rideRes.rows[0].joinrequests);
            res.status(200).json({
              message: 'success',
              requests,
            });
          } else {
            res.status(400).json({
              status: 'fail',
              message: 'forbidden from accessing this riderequests!!',
            });
          }
        });
    }
  }


  static respondToJoinRequests(req, res) {
    let responsMessage;
    if (Number.isNaN(req.params.rideId)) {
      res.status(400).json({
        status: 'fail',
        message: 'non integer ride id parameter',
      });
    } else {
      const rideId = parseInt(req.params.rideId, 10);
      const joinRequestId = parseInt(req.params.requestId, 10);
      if (req.body.accept === undefined) {
        res.status(400).json({
          status: 'fail',
          message: 'missing accept parameter',
        });
      } else if (Number.isNaN(req.body.accept)) {
        res.status(400).json({
          status: 'fail',
          message: 'non integer accept value',
        });
      } else {
        const accepted = parseInt(req.body.accept, 10); // 1 or 0

        if (!rideId) {
          res.status(400).json({
            status: 'fail',
            message: 'missing ride id field',
          });
        } else if (!joinRequestId) {
          res.status(400).json({
            status: 'fail',
            message: 'missing request id field',
          });
        } else {
          Ride.fetchRideOffer(rideId)
            .then((rideRes) => {
              if (!rideRes.rows[0]) {
                res.status(404).json({
                  status: 'fail',
                  message: 'ride not found',
                });
              } else if (parseInt(rideRes.rows[0].userid, 10)
                === parseInt(req.profile.profile.userId, 10)) {
                const joinrequests = JSON.parse(rideRes.rows[0].joinrequests);

                if (parseInt(joinrequests.requests.length, 10) === 0) {
                  res.status(400).json({
                    status: 'fail',
                    message: 'you dont have join requests',
                  });
                } else if (joinRequestId > joinrequests.requests.length || joinRequestId < 1) {
                  res.status(400).json({
                    status: 'fail',
                    message: 'valid ride offer id required',
                  });
                } else {
                  const index = joinRequestId - 1;

                  if (accepted) {
                    joinrequests.accepted.push(joinrequests.requests[index]);
                    responsMessage = 'request accepted successfully';
                  } else {
                    joinrequests.rejected.push(joinrequests.requests[index]);
                    responsMessage = 'request rejected successfully';
                  }

                  joinrequests.requests.splice(index, 1);

                  Ride.addRideRequest(rideId, joinrequests)
                    .then(() => {
                      res.status(200).json({
                        status: 'success',
                        message: responsMessage,
                      });
                    })
                    .catch(() => {
                      res.status(500).json({
                        status: 'error',
                        message: 'database error',
                      });
                    });
                }
              } else {
                res.status(403).json({
                  status: 'fail',
                  message: 'forbidden from accessing this ride!!',
                });
              }
            })
            .catch(() => {

            });
        }
      }
    }
  }
}

export default rideControllers;
