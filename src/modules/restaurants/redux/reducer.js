import * as types from "./types";

const defaultState = {
  isQtySlider: false,
  restaurant: {},
  dishQuantity: [],
  cardDetails  : {}
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
    case types.SET_CART_DETAILS:
      return { ...state, ...action.payload};
    case types.SET_CART_ITEMS:
      return {...state, ...action.payload};
    case types.SET_QTY_SLIDER:
      return {...state, isQtySlider: action.payload};
    default:
      return state;
  }
}
