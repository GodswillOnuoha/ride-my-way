
class Ride {
  // constructor
  constructor(rideId) {
    this.id = rideId;
  }
}

class Db {
  constructor() {
    this.rides = []; // available rides
    this.ids = 0;
    this.makeTestTdata();
  }

  // generates id
  genId() {
    this.ids += 1;
    return this.ids;
  }

  // add a ride
  addRide(bStop, fDestinantion, time, date, vType, pStops) {
    const ride = new Ride(this.genId());
    ride.boarding_stop = bStop;
    ride.final_dest = fDestinantion;
    ride.ride_time = time;
    ride.ride_date = date;
    ride.vehicle_type = vType;
    ride.possible_stops = pStops;
    ride.requests = [];

    this.rides.push(ride);

    return ride.id;
  }

  // returns all availale rides
  getAllRides() {
    return this.rides;
  }

  // returns specific ride with given ride_id
  getRide(rideId) {
    let i;
    for (i = 0; i < this.rides.length; i += 1) {
      if (this.rides[i].id === rideId) {
        return this.rides[i];
      }
    }
    return undefined;
  }

  makeTestTdata() {
    // add some initial data
    this.rides[0] = {
      id: 0,
      boarding_stop: 'Ikorodu',
      final_dest: 'CMS',
      ride_time: '6:30am',
      ride_date: '29/06/2018',
      vehicle_type: 'toyota',
      possible_stops: [],
      requests: [],
    };

    this.rides.push({
      id: 1,
      boarding_stop: 'Ketu',
      final_dest: 'Yaba',
      ride_time: '7:30pm',
      ride_date: '29/06/2018',
      vehicle_type: 'toyota',
      possible_stops: [],
      requests: [],
    });

    this.rides.push({
      id: 2,
      boarding_stop: 'TBS',
      final_dest: 'Ikorodu',
      ride_time: '5:00pm',
      ride_date: '2/7/2018',
      vehicle_type: 'toyota',
      possible_stops: [],
      requests: [],
    });
  }
}
const db = new Db();

export default db;
