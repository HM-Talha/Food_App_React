import * as types from "./types";
import axios from "axios";
import {baseUrl} from "../../../config/api-config";
import restaurantDishes from "../../../input.json";

const setUserDetails = (payload) => (dispatch) => {
    dispatch({type: types.SET_USER_DETAILS, payload: payload});
};

const setRecommendedDishes = (payload) => (dispatch) => {
    dispatch({type: types.SET_RECOMMENDED_DISHES, payload: payload});
};
const setRestaurantsByDish = (payload) => (dispatch) => {
    dispatch({type: types.SET_RESTAURANT_BY_DISH, payload: payload});
};
const setComfortDishes = (payload) => (dispatch) => {
    dispatch({type: types.SET_COMFORT_DISHES, payload: payload});
};
const setExploreDishes = (payload) => (dispatch) => {
    dispatch({type: types.SET_EXPLORE_DISHES, payload: payload});
};

const setCurrentDishIndex = (payload) => (dispatch) => {
    dispatch({type: types.SET_CURRENT_DISH_INDEX, payload});
};

const setComfortRestaurants = (payload) => (dispatch) => {
    dispatch({type: types.SET_COMFORT_RESTAURANTS, payload: payload});
};

const setExploreRestaurants = (payload) => (dispatch) => {
    dispatch({type: types.SET_EXPLORE_RESTAURANTS, payload: payload});
};

const resetRestaurantsByDish = (payload) => (dispatch) => {
    dispatch({type: types.RESET_RESTAURANT_BY_DISH, payload: payload});
};

export const fetchSwipingDishes = () => async (dispatch) => {
    const limitSize = 50;
    const res = await axios.get(`${baseUrl}/dsl/home/swipe/dishes?page_no=0&page_size=${limitSize}`)
    let dishesByRecipeID = {}
    let data = res.data.result.dishes.map(d => {
        let tags = d.tags;
        tags = tags.replaceAll("[", "")
        tags = tags.replaceAll("]", "")
        tags = tags.replaceAll("(", "")
        tags = tags.replaceAll(")", "")
        tags = tags.replaceAll("'", "")
        tags = tags.split(",")
        if (d.recipeId in dishesByRecipeID) {
            dishesByRecipeID[d.recipeId].push(d)
        } else {
            dishesByRecipeID[d.recipeId] = [d]
        }
        return {
            Probability: d.Probability,
            dishId: d.dishId,
            dishName: [{
                name: d.restaurantDishName,
            }],
            dishImgUrl: d.image,
            cuisineInfo: [{
                _id: d.parentCuisine,
                nativeCuisine: d.nativeCuisine
            }],
            sensoryInfo: tags.map(a => a.trim()).filter((a, index) => index % 2 === 0).filter(a => a !== "" && a !== undefined)
        }
    })
    const restaurantDishIds = restaurantDishes.map(restaurant => {
        return restaurant.restaurant_menu.map(menu => {
            return menu._id.$oid
        })
    }).flat(10)
    const matchingDishes = data.filter(d => restaurantDishIds.includes(d.dishId))
    const unMatchingDishes = data.filter(d => !restaurantDishIds.includes(d.dishId))
    const mergedDishes = matchingDishes.concat(unMatchingDishes)
    dispatch(setRecommendedDishes(mergedDishes.slice(0, limitSize)))
};

export {
    setCurrentDishIndex,
    setUserDetails,
    setRecommendedDishes,
    setRestaurantsByDish,
    setComfortDishes,
    setExploreDishes,
    setComfortRestaurants,
    setExploreRestaurants,
    resetRestaurantsByDish
};
