import * as types from "./types";

const setLocation = (payload) => (dispatch) => {
  dispatch({ type: types.SET_LOCATION, payload });
};

const setPrimaryLocation = (payload) => (dispatch) => {
  dispatch({ type: types.SET_PRIMARY_LOCATION, payload });
};

const setIsLocationEdit = (payload) => (dispatch) => {
  dispatch({ type: types.SET_LOCATION_EDIT, payload });
};

export { setLocation, setPrimaryLocation, setIsLocationEdit };
