import {
  SET_TRACKS
} from '../actions/types';

const initialState = [

];

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_TRACKS:
      return [
        ...action.payload
      ]
    default:
      return state;
  }
}
