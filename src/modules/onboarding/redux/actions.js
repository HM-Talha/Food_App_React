import * as types from "./types";

const setName = (payload) => (dispatch) => {
    dispatch({type: types.SET_NAME, payload: payload});
};
const setUserName = (username) => (dispatch) => {
    dispatch({type: types.SET_USER_NAME, payload: username});
};

const setGender = (gender) => (dispatch) => {
    dispatch({type: types.SET_GENDER, payload: gender});
};

const setOnboardingStatus = (status) => (dispatch) => {
    dispatch({type: types.SET_ON_BOARDING_STATUS, payload: status});
};

const setMobileNumber = (mobileNumber) => (dispatch) => {
    dispatch({type: types.SET_MOBILE_NUMBER, payload: mobileNumber});
};

const setAge = (age) => (dispatch) => {
    dispatch({type: types.SET_AGE, payload: age});
};

const setFoodTypes = (payload) => (dispatch) => {
    dispatch({type: types.SET_FOOD_TYPE, payload});
};

const setPastFoodTypes = (payload) => (dispatch) => {
    dispatch({type: types.SET_PAST_FOOD, payload});
};

const setFavouriteFoodTypes = (payload) => (dispatch) => {
    dispatch({type: types.SET_FAVOURITE_FOOD, payload});
};

const setAllergies = (payload) => (dispatch) => {
    dispatch({type: types.SET_ALLERGIES, payload});
};

const addOrRemoveAllergy = (payload) => (dispatch) => {
    dispatch({type: types.ADD_REMOVE_ALLERGIES, payload});
};
const removeAllergy = (payload) => (dispatch) => {
    dispatch({type: types.REMOVE_ALLERGIES, payload});
};

const setFullAllergyList = (payload) => (dispatch) => {
    dispatch({type: types.SET_FULL_ALLERGY_LIST, payload});
};

const setNationalCuisineList = (payload) => (dispatch) => {
    dispatch({type: types.SET_NATIONAL_CUISINE_LIST, payload});
};

const setRegionalCuisine = (payload) => (dispatch) => {
    dispatch({type: types.SET_REGIONAL_CUISINE, payload});
};

export {
    setUserName,
    setGender,
    setAge,
    setFoodTypes,
    setPastFoodTypes,
    setOnboardingStatus,
    setFavouriteFoodTypes,
    setAllergies,
    setName,
    setMobileNumber,
    addOrRemoveAllergy,
    removeAllergy,
    setFullAllergyList,
    setNationalCuisineList,
    setRegionalCuisine
};
