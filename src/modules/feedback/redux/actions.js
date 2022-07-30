import * as types from './types';

const set_review = (payload) => (dispatch) => {
    dispatch({ type: types.ADD_REVIEW, payload })
}

const set_restaurant = (payload) => (dispatch) => {
    dispatch({ type: types.ADD_RESTAURANT, payload })
}

const set_order = (payload) => (dispatch) => {
    dispatch({ type: types.ADD_ORDER, payload })
}

const set_dishes = (payload) => (dispatch) => {
    dispatch({ type: types.ADD_DISHES, payload })
}

const set_navigate = (payload) => (dispatch) => {
    dispatch({ type: types.ADD_NAVIGATE, payload })
}

export {set_review, set_restaurant, set_order, set_dishes, set_navigate};