const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

const User = require('../models/User');

/**
 * @swagger
 * 
 * /users/register:
 *    post:
 *      tags:
 *      - "users"
 *      summary: "registers a new user"
 *      description: "add user"
 *      operationId: "addUser"
 *      produces:
 *      - "application/json"
 *      parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "full user body"
 *        required: true
 *        schema:
 *          type: "object"
 *          example: {
 *            name: "Ahmad",
 *            email: "ahmadalhasancv@gmail.com",
 *            password: "123",
 *          }
 *      responses:
 *        200:
 *          description: "success"
 *          schema:
 *            type: "array"
 *            example: {
 *              avatar: "//www.gravatar.com/avatar/d9d6413146c1dba0cdb4619d0bd75267?s=200&r=pg&d=mm",
 *              name: "Ahmad",
 *              email: "ahmadalhasancv@gmail.com",
 *              _id: "5ce9330073666e33cd9ff648",
 *              token: "access token"
 *            }
 *        400:
 *          description: "validation error or invalid DB response"
 */
router.post('/register', function (req, res) {

  const {
    errors,
    isValid
  } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      return res.status(400).json({
        email: 'Email already exists'
      });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar
      });

      bcrypt.genSalt(10, (err, salt) => {
        if (err) console.error('There was an error', err);
        else {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.error('There was an error', err);
            else {
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  res.json(user)
                });
            }
          });
        }
      });
    }
  });
});

/**
 * @swagger
 * 
 * /users/login:
 *    post:
 *      tags:
 *      - "users"
 *      summary: "logins with user credentials"
 *      description: "login user"
 *      operationId: "login"
 *      produces:
 *      - "application/json"
 *      parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "email and password"
 *        required: true
 *        schema:
 *          type: "object"
 *          example: {
 *            email: "ahmadalhasancv@gmail.com",
 *            password: "123",
 *          }
 *      responses:
 *        200:
 *          description: "success"
 *          schema:
 *            type: "array"
 *            example: {
 *              avatar: "//www.gravatar.com/avatar/d9d6413146c1dba0cdb4619d0bd75267?s=200&r=pg&d=mm",
 *              name: "Ahmad",
 *              email: "ahmadalhasancv@gmail.com",
 *              _id: "5ce9330073666e33cd9ff648",
 *              token: "access token"
 *            }
 *        400:
 *          description: "validation error or invalid DB response"
 */
router.post('/login', (req, res) => {

  const {
    errors,
    isValid
  } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
      email
    })
    .then(user => {
      if (!user) {
        errors.email = 'User not found'
        return res.status(404).json(errors);
      }
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            }
            jwt.sign(payload, 'secret', {
              expiresIn: 3600
            }, (err, token) => {
              if (err) console.error('There is some error in token', err);
              else {
                res.json({
                  success: true,
                  token: `Bearer ${token}`
                });
              }
            });
          } else {
            errors.password = 'Incorrect Password';
            return res.status(400).json(errors);
          }
        });
    });
});

/**
 * @swagger
 * 
 * /users/me:
 *    get:
 *      tags:
 *      - "users"
 *      summary: "get user profile"
 *      description: "get user profile"
 *      operationId: "getme"
 *      produces:
 *      - "application/json"
 *      parameters:
 *      - in: "headers"
 *        name: "Authorization"
 *        description: "Access Token"
 *        required: true
 *        schema:
 *          type: "string"
 *          example: "Bearer access_token"
 *      responses:
 *        200:
 *          description: "success"
 *          schema:
 *            type: "array"
 *            example: {
 *              avatar: "//www.gravatar.com/avatar/d9d6413146c1dba0cdb4619d0bd75267?s=200&r=pg&d=mm",
 *              name: "Ahmad",
 *              email: "ahmadalhasancv@gmail.com",
 *              _id: "5ce9330073666e33cd9ff648",
 *              token: "access token"
 *            }
 *        400:
 *          description: "wrong access_token"
 */
router.get('/me', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  return res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;
