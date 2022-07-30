import * as types from "./types";

const defaultState = {
  location: null,
  primaryLocation: {},
  isLocationEdit: {
    isLocationEdit: false,
    prvPath: ""
} 
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
    case types.SET_LOCATION:
      return {...state, location: action.payload}
    case types.SET_PRIMARY_LOCATION:
      return {...state, primaryLocation: action.payload}
    case types.SET_LOCATION_EDIT:
      return {...state, isLocationEdit: action.payload}
    default:
      return state;
  }
}
