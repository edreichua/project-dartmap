// actions/index.js
// This file initializes all the possible actions

import * as dartmapApi from '../helpers/dartmap-api';
import { getLocationFromZipcode } from '../helpers/google-maps';
import * as fbApi from '../helpers/facebook-helpers';

const RADIUS = 10000;

// keys for ActionTypes
export const ActionTypes = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  GET_LOCATION: 'GET_LOCATION',
  RETRY_LOCATION: 'RETRY_LOCATION',
  LOCATION_FAIL: 'LOCATION_FAIL',
  FETCH_EVENTS: 'FETCH_EVENTS',
  EVENT_FAIL: 'EVENT_FAIL',
  FETCH_EVENT: 'FETCH_EVENT',
  UNFETCH_EVENT: 'UNFETCH_EVENT',
  FETCH_RSVP_EVENTS: 'FETCH_RSVP_EVENTS',
  FETCH_USER_EVENTS: 'FETCH_USER_EVENTS',
  RSVP_CREATED: 'RSVP_CREATED',
  RSVP_REMOVED: 'RSVP_REMOVED',
  CREATE_EVENT: 'CREATE_EVENT',
  UPDATE_EVENT: 'UPDATE_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
  FILTER_EVENTS: 'FILTER_EVENTS',
  RETRY_EVENT: 'RETRY_EVENT',
  FETCH_CATEGORIES: 'FETCH_CATEGORIES',
  CATEGORY_FAIL: 'CATEGORY_FAIL',
  SET_DATE_DATA: 'SET_DATE_DATA',
  GET_FB_LOGIN_STATUS: 'GET_FB_LOGIN_STATUS',
  SET_STICKY_BALLOON_ID: 'SET_STICKY_BALLOON_ID',
  SET_BALLOON_ID: 'SET_BALLOON_ID',
  CLEAR_BALLOONS: 'CLEAR_BALLOONS',
  SET_MAP_CENTER: 'SET_MAP_CENTER',
  CREATE_COMMENT: 'CREATE_COMMENT',
  UPDATE_COMMENT: 'UPDATE_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export function getLoginStatusFromFb(jwt) {
  return (dispatch) => {
    fbApi.getFbLoginStatus(dispatch, ActionTypes.GET_FB_LOGIN_STATUS, jwt);
  };
}

export function login() {
  return (dispatch) => {
    fbApi.fbLogin(dispatch, ActionTypes.LOGIN);
  };
}

export function logout() {
  return (dispatch) => {
    fbApi.fbLogout(dispatch, ActionTypes.LOGOUT);
  };
}

export function fetchEvents(latitude, longitude) {
  return (dispatch) => {
    if (!latitude || !longitude) {
      dispatch({ type: ActionTypes.RETRY_EVENT, payload: null });
    } else {
      dartmapApi.getAllEvents(dispatch, ActionTypes.FETCH_EVENTS,
        ActionTypes.EVENT_FAIL, latitude, longitude, RADIUS);
    }
  };
}

export function createRSVP(data, jwt) {
  return (dispatch) => {
    dartmapApi.postRSVP(dispatch, ActionTypes.RSVP_CREATED,
      ActionTypes.EVENT_FAIL, data, jwt);
  };
}

export function removeRSVP(data, jwt) {
  return (dispatch) => {
    dartmapApi.deleteRSVP(dispatch, ActionTypes.RSVP_REMOVED,
      ActionTypes.EVENT_FAIL, data, jwt);
  };
}

export function fetchUserEventsById(ids) {
  return (dispatch) => {
    dartmapApi.getAllEventsById(dispatch, ActionTypes.FETCH_USER_EVENTS,
      ActionTypes.EVENT_FAIL, ids);
  };
}

export function fetchRSVPdEventsById(ids) {
  return (dispatch) => {
    dartmapApi.getAllEventsById(dispatch, ActionTypes.FETCH_RSVP_EVENTS,
      ActionTypes.EVENT_FAIL, ids);
  };
}

export function fetchEvent(eventId) {
  return (dispatch) => {
    dartmapApi.getEvent(dispatch, ActionTypes.FETCH_EVENT,
      ActionTypes.EVENT_FAIL, eventId);
  };
}

export function unfetchEvent() {
  return {
    type: ActionTypes.UNFETCH_EVENT,
    payload: {},
  };
}

export function createEvent(event, jwt) {
  return (dispatch) => {
    dartmapApi.postNewEvent(dispatch, ActionTypes.CREATE_EVENT,
      ActionTypes.EVENT_FAIL, event, jwt);
  };
}

export function filterEvents(filters) {
  return {
    type: ActionTypes.FILTER_EVENTS,
    payload: {
      filters: Object.assign({}, filters),
    },
  };
}

export function setDateBarData() {
  return {
    type: ActionTypes.SET_DATE_DATA,
    payload: null,
  };
}

export function getLocation() {
  return (dispatch) => {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        dispatch({
          type: ActionTypes.GET_LOCATION,
          payload: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      }, (error) => {
        dispatch({
          type: ActionTypes.LOCATION_FAIL,
          payload: { error },
        });
      });
    } else {
      dispatch({ type: ActionTypes.RETRY_LOCATION, payload: null });
    }
  };
}

export function getZipcodeLocation(zipcode) {
  return (dispatch) => {
    getLocationFromZipcode(zipcode, dispatch, ActionTypes.GET_LOCATION,
      ActionTypes.LOCATION_FAIL);
  };
}

export function fetchCategories() {
  return (dispatch) => {
    dartmapApi.getAllCategories(dispatch, ActionTypes.FETCH_CATEGORIES,
      ActionTypes.CATEGORY_FAIL);
  };
}

export function setStickyBalloonId(locationId) {
  return {
    type: ActionTypes.SET_STICKY_BALLOON_ID,
    payload: { locationId },
  };
}

export function setBalloonId(locationId) {
  return {
    type: ActionTypes.SET_BALLOON_ID,
    payload: { locationId },
  };
}

export function clearBalloons() {
  return {
    type: ActionTypes.CLEAR_BALLOONS,
    payload: null,
  };
}

export function setMapCenter(center) {
  return {
    type: ActionTypes.SET_MAP_CENTER,
    payload: { center },
  };
}

export function createComment(url, comment, jwt) {
  return (dispatch) => {
    dartmapApi.postComment(dispatch, ActionTypes.CREATE_COMMENT,
      ActionTypes.CREATE_COMMENT, url, comment, jwt);
  };
}

export function updateComment(id, comment) {
  return (dispatch) => {
    dartmapApi.putComment(dispatch, ActionTypes.UPDATE_COMMENT,
      ActionTypes.UPDATE_COMMENT, id, comment);
  };
}

export function deleteComment(id) {
  return (dispatch) => {
    dartmapApi.deleteComment(dispatch, ActionTypes.DELETE_COMMENT,
      ActionTypes.DELETE_COMMENT, id);
  };
}
