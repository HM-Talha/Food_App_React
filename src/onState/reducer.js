import * as types from "./types";

const defaultState = {
  isMenu: false,
 preferenceIsEdit: false
 
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
    case types.SET_MENU:
      return {...state, isMenu: action.payload}
    case types.SET_PREFERENCE_EDIT:
      return {...state, preferenceIsEdit: action.payload}
    default:
      return state;
  }
}
