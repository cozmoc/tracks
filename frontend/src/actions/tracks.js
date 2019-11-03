import axios from 'axios';
import {
  SET_TRACKS,
  GET_ERRORS
} from './types';

export const getTracks = () => dispatch => {
  axios.get('/api/tracks')
    .then(res => {
      dispatch({
        type: SET_TRACKS,
        payload: res.data
      });
    })
    .catch(err => {});
}

export const addTrack = (track) => dispatch => {
  axios.post('/api/tracks', track)
    .then(res => {
      getTracks()(dispatch);
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err
      });
    });
}

export const updateTrack = (track) => dispatch => {
  axios.put('/api/tracks/' + track.id, track)
    .then(res => {
      getTracks()(dispatch);
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err
      });
    });
}

export const deleteTrack = (id) => dispatch => {
  axios.delete('/api/tracks/' + id)
    .then(res => {
      getTracks()(dispatch);
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err
      });
    });
}
