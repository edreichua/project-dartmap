// reducers/user-reducer.js
// This file contains the reducers for the user state

import { ActionTypes } from '../actions';

const UserReducer = (state = {}, action) => {
  let newState;
  switch (action.type) {
    case ActionTypes.GET_LOCATION:
      newState = Object.assign({}, state, {
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
      });
      return newState;
    case ActionTypes.LOCATION_FAIL:
      newState = Object.assign({}, state, {
        latitude: null,
        longitude: null,
      });
      return newState;
    case ActionTypes.RETRY_LOCATION:
      newState = Object.assign({}, state, {
        latitude: 'retry',
        longitude: 'retry',
      });
      return newState;
    default:
      return state;
  }
};

export default UserReducer;
