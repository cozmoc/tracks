const mongoose = require('mongoose');
const Track = require('../models/Track');
const oldTracks = require('./tracks.json');

require('dotenv').config({
  path: '../.env.example'
});

const user = {
  avatar: '//www.gravatar.com/avatar/1909ad4c9a631040c4699ab648e1eda0?s=200&r=pg&d=mm',
  name: 'Ahmad Alhasan',
  _id: '5dbdceac8aa7cf2515a62275',
};

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
  })
  .then(async () => {
    console.log('Database is connected');
    await Promise.all(oldTracks.tracks.map(track => {
      return new Track({
        id: track.id,
        name: track.title,
        types: {
          [track.artist.split('.').join('_')]: true
        },
        created_by: user,
        updated_by: user,
        date: new Date(),
      }).save()
    }));
    console.log('Done!');
    return process.exit();
  }, err => {
    console.log('Can not connect to the database' + err);
  });
