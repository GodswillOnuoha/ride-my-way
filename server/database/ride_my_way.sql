-- DROP DATABASE IF EXISTS [dbName];
-- CREATE DATABASE [dbName];


-- CREATE TABLE rideOffer (
--   rideId integer NOT NULL DEFAULT nextval('rideoffers_rideid_seq'::regclass),
--   boardingStop VARCHAR,
--   finalDestination VARCHAR,
--   rideTime VARCHAR,
--   rideDate VARCHAR,
--   possibleStops VARCHAR,
--   vehicleType VARCHAR,
--   joinRequests VARCHAR,
--   userId INTEGER

-- );

-- CREATE TABLE Users (
--   userId integer NOT NULL DEFAULT nextval('rideoffers_rideid_seq'::regclass),
--   firstName VARCHAR,
--   lastName VARCHAR,
--   username VARCHAR,
--   email VARCHAR,
--   password VARCHAR NOT NULL
-- );

-- INSERT INTO rideOffer (rideId, boardingStop, finalDestinantion, rideTime, rideDate, possibleStops, vehicleType, joinRequests, userId)
--   VALUES (1, 'CMS', 'Ikorodu', '4:35pm', '2/07/2018', '[ojota, ketu]', 'toyota', '[]', 1);

-- INSERT INTO rideOffer (rideId, boardingStop, finalDestinantion, rideTime, rideDate, possibleStops, vehicleType, joinRequests, userId)
--   VALUES (2, 'Ketu', 'CMS', '6:30am', '29/06/2018', '[]', 'toyota', '[]', 1);

-- INSERT INTO rideOffer (rideId, boardingStop, finalDestinantion, rideTime, rideDate, possibleStops, vehicleType, joinRequests, userId)
--   VALUES (3, 'Lekki', 'Eko Hotels', '9:30am', '2/08/2018', '[]', 'toyota', '[]', 2);

-- INSERT INTO rideOffer (rideId, boardingStop, finalDestinantion, rideTime, rideDate, possibleStops, vehicleType, joinRequests, userId)
--   VALUES (4, 'Badagry', 'Ketu', '6:30am', '29/07/2018', '[]', 'toyota', '[]', 1);
