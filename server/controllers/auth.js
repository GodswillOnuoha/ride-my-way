import jwt from 'jsonwebtoken';
import log from 'fancy-log';
import bcrypt from 'bcrypt';
import env from 'dotenv';
import userModel from '../models/user';

env.config();

class userAuth {
  static signup(req, res) {
    const {
      firstname, lastname, username, email, password,
    } = req.body;

    userModel.findUserByEmail(email)
      .then((result) => {
        if (result.rowCount >= 1) {
          res.status(400).json({
            error: 'Email is already registered',
          });
        } else {
          userModel.findUserByUsername(username)
            .then((usernameResp) => {
              if (usernameResp.rowCount >= 1) {
                res.status(400).json({
                  error: 'username already taken',
                });
              } else {
                const hashedPassword = bcrypt.hashSync(password, 8);

                const newUser = {
                  firstName: firstname,
                  lastName: lastname,
                  username,
                  email,
                  password: hashedPassword,
                  dateCreated: new Date().toISOString(),
                };

                userModel.create(newUser)
                  .then(() => {
                    res.status(201).json({
                      message: 'account creation successful, login',
                    });
                  })
                  .catch((dbError) => {
                    log.error(dbError);
                    res.status(500).json({
                      error: 'account creation failed.',
                    });
                  });
              }
            });
        }
      })
      .catch((emailError) => {
        log.error(emailError);
        res.status(500).json({
          error: 'error',
        });
      });
  }

  // logs user in
  static login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        error: 'supply email and password!',
      });
    } else {
      // query user model
      userModel.findUserByEmail(email)
        .then((result) => {
          if (result.rowCount < 1) {
            res.status(404).json({
              error: 'Auth Failed! wrong email or password',
            });
          } else {
            // validate credential
            const comparePassword = bcrypt.compareSync(password, result.rows[0].password);
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
              log(profile);
              jwt.sign({ profile }, process.env.JWT_SECRET_TOKEN, { expiresIn: '1h' },
                (error, token) => {
                  if (error) {
                    res.status(522).json({
                      error: 'Authentication Failed!',
                    });
                  } else {
                    res.status(200).json({
                      message: 'login successful',
                      profile,
                      token,
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
