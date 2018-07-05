import jwt from 'jsonwebtoken';
import log from 'fancy-log';
import bcrypt from 'bcrypt';
import env from 'dotenv';
import userModel from '../models/user';

env.config();

class userAuth {
  static signup(req, res) {
    const user = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };

    if (!user.username || !user.email || !user.password) {
      res.status(400).json({
        error: 'missing fields',
      });
    } else {
      userModel.findUserByEmail(user.email)
        .then((result) => {
          if (result.rowCount >= 1) {
            res.status(400).json({
              error: 'Email is already registered',
            });
          } else {
            userModel.findUserByUsername(user.username)
              .then((usernameResp) => {
                if (usernameResp.rowCount >= 1) {
                  res.status(400).json({
                    error: 'username already taken',
                  });
                } else {
                  const hashedPassword = bcrypt.hashSync(user.password, 8);

                  const newUser = {
                    firstName: user.firstname,
                    lastName: user.lastname,
                    username: user.username,
                    email: user.email,
                    password: hashedPassword,
                    dateCreated: new Date().toISOString(),
                  };

                  userModel.create(newUser)
                    .then(() => {
                      res.status(201).json({
                        message: 'account creation successful, login',
                      });
                    })
                    .catch(() => {
                      res.status(500).json({
                        error: 'account creation failed. server error',
                      });
                    });
                }
              });
          }
        })
        .catch(() => {
          res.status(500).json({
            error: 'server error',
          });
        });
    }
  }

  // logs user in
  static login(req, res) {
    const user = {
      email: req.body.email,
      password: req.body.password,
    };

    if (!user.email || !user.password) {
      res.status(400).json({
        error: 'supply email and password!',
      });
    } else {
      // query user model
      userModel.findUserByEmail(user.email)
        .then((result) => {
          if (result.rowCount < 1) {
            res.status(404).json({
              error: 'Auth Failed! wrong email or password',
            });
          } else {
            // validate credential
            const comparePassword = bcrypt.compareSync(user.password, result.rows[0].password);
            if (!comparePassword) {
              // invalid credential
              res.status(401).json({
                error: 'Auth Failed! wrong email or password',
              });
            } else {
              // valid credentials
              const profile = {
                userId: result.rows[0].userid,
                username: result.rows[0].username,
                authenticated: true,
              };
              jwt.sign({ profile }, process.env.JWT_SECRET_TOKEN, { expiresIn: '24h' },
                (error, token) => {
                  if (error) {
                    res.status(522).json({
                      status: 'Error',
                      message: 'Server Authentication Failed!',
                    });
                  } else {
                    res.status(200).json({
                      status: 'success',
                      data: {
                        username: profile.username,
                        auth: true,
                        token,
                      },
                    });
                  }
                });
            }
          }
        })
        .catch((error) => {
          log(error);
          res.status(500).json({
            error: 'server Error ',
          });
        });
    }
  }
}

export default userAuth;
