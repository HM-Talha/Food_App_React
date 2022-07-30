import * as types from "./types";

const setActivePath = (payload) => (dispatch) => {
  dispatch({ type: types.SET_ACTIVE_PATH, payload });
};


export { setActivePath };
