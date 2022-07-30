import * as types from "./types";

const defaultState = {
  pathName: '/home'
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
    case types.SET_ACTIVE_PATH:
      return {...state, pathName: action.payload}
    default:
      return state;
  }
}
