import * as types from "./types";

const defaultState = {
  isLoggedIn: false,
  user: {
    firstName: "",
    lastName: ""
  },
  firstName: "",
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
    case types.SET_USER_FIRST_NAME:
      return {...state, firstName: action.payload}
    case types.LOGIN_USER:
      return { ...state, ...action.payload, isLoggedIn: true };
    case types.LOGOUT_USER:
      return defaultState;
    default:
      return state;
  }
}
