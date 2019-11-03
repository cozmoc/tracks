const express = require('express');
const router = express.Router();
const passport = require('passport');
const validateTrackInput = require('../validation/track');
const _ = require('lodash');

const Track = require('../models/Track');
const User = require('../models/User');

/**
 * @swagger
 * 
 * /tracks:
 *    post:
 *      tags:
 *      - "tracks"
 *      summary: "Add a new track"
 *      description: "add track"
 *      operationId: "addTrack"
 *      produces:
 *      - "application/json"
 *      parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "full name of the track and type"
 *        required: true
 *        schema:
 *          type: "object"
 *          example: {
 *            name: "track1",
 *            types: {
 *              lindsey-stirling: false,
 *              eminem: true
 *            }
 *          }
 *      responses:
 *        200:
 *          description: "success"
 *        400:
 *          description: "Invalid Track"
 */
router.post('/', passport.authenticate('jwt', {
  session: false
}), function (req, res) {

  const {
    errors,
    isValid
  } = validateTrackInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  const newTrack = new Track({
    name: req.body.name,
    types: req.body.types,
    created_by: req.user._id,
    updated_by: req.user._id,
  });

  newTrack
    .save()
    .then(track => {
      res.json(_.pick(track, ['name', 'types', 'date', 'id']));
    });
});

/**
 * @swagger
 *
 * /tracks:
 *    get:
 *      tags:
 *      - "tracks"
 *      summary: "Returns a list of tracks in descending order"
 *      description: "Returns a list of tracks"
 *      operationId: "getTracks"
 *      produces:
 *      - "application/json"
 *      parameters: []
 *      responses:
 *        200:
 *          description: "success"
 *          schema:
 *            type: "array"
 *            example: {
 *            created_by: {
 *              avatar: "//www.gravatar.com/avatar/d9d6413146c1dba0cdb4619d0bd75267?s=200&r=pg&d=mm",
 *              name: "Ahmad Al-Hasan",
 *              _id: "5ce9330073666e33cd9ff648"
 *            },
 *            date: "2019-05-25T23:37:29.294Z",
 *            id: "5ce9d1b94daa3a57c25b8f95",
 *            name: "track1",
 *            types: {
 *              lindsey-stirling: false,
 *              eminem: true
 *            }
 *          }
 *        400:
 *          description: "Bad DB response"
 */
router.get('/', (req, res) => {
  Track
    .find({})
    .sort([
      ['date', -1]
    ])
    .then(async tracks => {
      const users = await Promise.all(tracks.map(track => {
        return User.findById(track.created_by);
      }));
      return res.json(
        tracks
        .map((track, i) => ({
          ..._.pick(track, ['name', 'types', 'date', 'id']),
          created_by: _.pick(users[i], ['avatar', 'name', '_id'])
        }))
      );
    })
    .catch(errors => res.status(400).json(errors));
});

/**
 * @swagger
 *
 * /tracks/{id}:
 *    get:
 *      tags:
 *      - "tracks"
 *      summary: "Returns track by id"
 *      description: "Returns track by id"
 *      operationId: "getTrack"
 *      produces:
 *      - "application/json"
 *      parameters:
 *       - name: "id"
 *         description: "ID of the track that needs to be retreived"
 *         required: true
 *         type: "integer"
 *         minimum: 1.0
 *         format: "int64"
 *      responses:
 *        200:
 *          description: "success"
 *          schema:
 *            type: "object"
 *            example: {
 *            created_by: {
 *              avatar: "//www.gravatar.com/avatar/d9d6413146c1dba0cdb4619d0bd75267?s=200&r=pg&d=mm",
 *              name: "Ahmad Al-Hasan",
 *              _id: "5ce9330073666e33cd9ff648"
 *            },
 *            date: "2019-05-25T23:37:29.294Z",
 *            id: "5ce9d1b94daa3a57c25b8f95",
 *            name: "track1",
 *            types: {
 *              lindsey-stirling: false,
 *              eminem: true
 *            }
 *          }
 *        400:
 *          description: "Bad DB response"
 */
router.get('/:id', (req, res) => {
  Track
    .findById(req.params.id)
    .then(track => {
      return res.json(_.pick(track, ['name', 'types', 'date', 'id']));
    })
    .catch(errors => res.status(400).json(errors));
});

/**
 * @swagger
 *
 * /tracks/artist/{name}:
 *    get:
 *      tags:
 *      - "tracks"
 *      summary: "Returns track by Artist"
 *      description: "Returns track by Artist"
 *      operationId: "getTrackByArtist"
 *      produces:
 *      - "application/json"
 *      parameters:
 *       - name: "Artist"
 *         description: "Artist of the track that needs to be retreived"
 *         required: true
 *         type: "string"
 *         minimum: 1.0
 *         format: "string"
 *      responses:
 *        200:
 *          description: "success"
 *          schema:
 *            type: "object"
 *            example: [{
 *            created_by: {
 *              avatar: "//www.gravatar.com/avatar/d9d6413146c1dba0cdb4619d0bd75267?s=200&r=pg&d=mm",
 *              name: "Ahmad Al-Hasan",
 *              _id: "5ce9330073666e33cd9ff648"
 *            },
 *            date: "2019-05-25T23:37:29.294Z",
 *            id: "5ce9d1b94daa3a57c25b8f95",
 *            name: "track1",
 *            types: {
 *              lindsey-stirling: false,
 *              eminem: true
 *            }
 *          }, {
 *            created_by: {
 *              avatar: "//www.gravatar.com/avatar/d9d6413146c1dba0cdb4619d0bd75267?s=200&r=pg&d=mm",
 *              name: "Ahmad Al-Hasan",
 *              _id: "5ce9330073666e33cd9ff648"
 *            },
 *            date: "2019-05-25T23:37:29.294Z",
 *            id: "5ce9d1b94daa3a57c25b8f95",
 *            name: "track1",
 *            types: {
 *              lindsey-stirling: false,
 *              eminem: true
 *            }
 *          }]
 *        400:
 *          description: "Bad DB response"
 */
router.get('/artist/:name', (req, res) => {
  Track
    .find({
      types: {
        [req.params.name]: true
      }
    })
    .then(tracks => {
      return res.json(tracks.map(track => _.pick(track, ['name', 'types', 'date', 'id'])));
    })
    .catch(errors => res.status(400).json(errors));
});

/**
 * @swagger
 * /tracks{id}:
 *    put:
 *      tags:
 *      - "tracks"
 *      summary: "updates track by ID"
 *      description: "update a track by id"
 *      operationId: "updateTrack"
 *      produces:
 *      - "application/json"
 *      parameters:
 *      - name: "id"
 *        in: "path"
 *        description: "ID of the track that needs to be updated"
 *        required: true
 *        type: "integer"
 *        minimum: 1.0
 *        format: "int64"
 *      - in: "body"
 *        name: "body"
 *        description: "full name of the track and type"
 *        required: true
 *        schema:
 *          type: "object"
 *          example: {
 *          name: "track1",
 *          types: {
 *            lindsey-stirling: false,
 *            eminem: true
 *          }
 *        }
 *      responses:
 *        200:
 *          description: "success"
 *        400:
 *          description: "Bad DB response"
 */
router.put('/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  const {
    errors,
    isValid
  } = validateTrackInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  Track
    .findById(req.params.id)
    .then(track => {
      track.name = req.body.name;
      track.types = req.body.types;
      track.updated_by = req.user._id;
      return track.save();
    })
    .then(track => {
      res.json(_.pick(track, ['name', 'types', 'date', 'id']));
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

/**
 * @swagger
 * /tracks{id}:
 *    delete:
 *      tags:
 *      - "tracks"
 *      summary: "Delete track by ID"
 *      description: "deletes a track by id"
 *      operationId: "deleteTrack"
 *      produces:
 *      - "application/json"
 *      parameters:
 *      - name: "id"
 *        in: "path"
 *        description: "ID of the track that needs to be deleted"
 *        required: true
 *        type: "integer"
 *        minimum: 1.0
 *        format: "int64"
 *      responses:
 *        200:
 *          description: "success"
 *        400:
 *          description: "Bad DB response"
 */
router.delete('/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Track
    .findById(req.params.id)
    .then(track => {
      track.delete();
    })
    .then(track => {
      res.status(200).end();
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

module.exports = router;
