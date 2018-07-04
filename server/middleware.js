import jwt from 'jsonwebtoken';
import env from 'dotenv';

env.config();

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(200).json({
      error: 'missing authorization heaader',
    });
  }
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET_TOKEN, (error, decoded) => {
    if (error) {
      res.status(401).json({
        error: 'invalid token',
      });
    } else {
      req.authData = decoded;
      next();
    }
  });
};
