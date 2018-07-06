import jwt from 'jsonwebtoken';
import env from 'dotenv';

env.config();

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(400).json({
      status: 'fail',
      message: 'missing authorization heaader',
    });
  }
  const token = req.headers.authorization;
  jwt.verify(token, process.env.JWT_SECRET_TOKEN, (error, decoded) => {
    if (error) {
      res.status(401).json({
        status: 'fail',
        message: 'invalid token',
      });
    } else {
      req.profile = decoded;
      next();
    }
  });
};
