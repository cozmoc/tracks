import {
  combineReducers
} from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import tracksReducer from './tracksReducer';

export default combineReducers({
  errors: errorReducer,
  auth: authReducer,
  tracks: tracksReducer,
});
