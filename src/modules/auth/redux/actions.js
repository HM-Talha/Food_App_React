import * as types from "./types";

const loginUser = (payload) => (dispatch) => {
  localStorage.setItem("user", JSON.stringify(payload));
  localStorage.setItem("__auth", JSON.stringify(payload.token));
  dispatch({ type: types.LOGIN_USER, payload });
};

const setFirstName = (payload) => (dispatch) => {
  dispatch({ type: types.SET_USER_FIRST_NAME, payload });
}
const logoutUser = () => (dispatch) => {
  dispatch({ type: types.LOGOUT_USER });
};

export { loginUser, logoutUser, setFirstName };
