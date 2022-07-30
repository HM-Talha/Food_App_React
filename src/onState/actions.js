import * as types from "./types";

const setMenu = (payload) => (dispatch) => {
  dispatch({ type: types.SET_MENU, payload });
};

const setPreferenceIsEdit = (payload) => (dispatch) => {
  dispatch({ type: types.SET_PREFERENCE_EDIT, payload });
};

export { setMenu, setPreferenceIsEdit };
