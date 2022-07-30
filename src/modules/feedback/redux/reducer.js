import * as types from './types';

const defaultState = {
    navigate: "",
    restaurant_id: "",
    order_id: "",
    review: [],
    dishes: []
}

export default function reducer(state = defaultState, action = {}) {
    switch(action.type) {
        case types.ADD_REVIEW:
            return {...state, review: [...state.review, action.payload]}
        case types.ADD_ORDER:
            return {...state, order_id: action.payload}
        case types.ADD_RESTAURANT:
            return {...state, restaurant_id: action.payload}
        case types.ADD_DISHES:
            return {...state, dishes: action.payload}
        case types.ADD_NAVIGATE:
            return {...state, navigate: action.payload}
        default:
            return state
    }
}