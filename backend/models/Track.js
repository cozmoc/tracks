const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TrackSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  types: {
    type: Object,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: Object,
    required: true
  },
  updated_by: {
    type: Object,
    required: true
  },
});

const Track = mongoose.model('tracks', TrackSchema);

module.exports = Track;
