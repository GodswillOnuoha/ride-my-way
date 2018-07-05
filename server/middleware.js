import jwt from 'jsonwebtoken';
import env from 'dotenv';
import log from 'fancy-log';

env.config();

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(400).json({
      error: 'missing authorization heaader',
    });
  }
  const token = req.headers.authorization;
  jwt.verify(token, process.env.JWT_SECRET_TOKEN, (error, decoded) => {
    if (error) {
      res.status(401).json({
        error: 'invalid token',
      });
    } else {
      req.profile = decoded;
      next();
    }
  });
};
