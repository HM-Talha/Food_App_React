import * as types from "./types";

const defaultState = {
    currentDishIndex: 0,
    userDetails: {},
    recommendedDishes: [],
    restaurantsByDish: {},
    comfortDishes: [],
    exploreDishes: [],
    comfortRestaurants: [],
    exploreRestaurants: []
};

export default function reducer(state = defaultState, action = {}) {
    switch (action.type) {
        case types.SET_USER_DETAILS:
            return {...state, userDetails: action.payload};
        case types.SET_RECOMMENDED_DISHES:
            return {...state, recommendedDishes: action.payload};
        case types.SET_RESTAURANT_BY_DISH:
            return {...state, restaurantsByDish: {...state.restaurantsByDish, ...action.payload}};
        case types.SET_COMFORT_DISHES:
            return {...state, comfortDishes: action.payload};
        case types.SET_EXPLORE_DISHES:
            return {...state, exploreDishes: action.payload};
        case types.SET_COMFORT_RESTAURANTS:
            return {...state, comfortRestaurants: action.payload};
        case types.SET_EXPLORE_RESTAURANTS:
            return {...state, exploreRestaurants: action.payload};
            case types.SET_CURRENT_DISH_INDEX:
                return {...state, currentDishIndex: action.payload};
        case types.RESET_RESTAURANT_BY_DISH:
            return { ...state, restaurantsByDish: {}, currentDishIndex: 0}

        default:
            return state;
    }
}
