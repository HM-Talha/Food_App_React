import * as types from "./types";

const setCartDetails = (payload) => (dispatch) => {
    dispatch({type: types.SET_CART_DETAILS, payload: payload});
};

const setCartItems = (payload) => (dispatch) => {
    dispatch({type: types.SET_CART_ITEMS, payload: payload});
};

const setQtySlider = (payload) => (dispatch) => {
    dispatch({type: types.SET_QTY_SLIDER, payload: payload});
};

export {setCartDetails, setCartItems, setQtySlider};
