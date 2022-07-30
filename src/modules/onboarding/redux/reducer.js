import * as types from "./types";

const defaultState = {
  username: "",
  age: "",
  gender: "",
  foodType: "",
  pastFoodTypes: {},
  favouritesFoodTypes: [],
  allergies: [],
  lastName: "",
  firstName: "",
  mobileNumber: "",
  onBoardingStatus: false,
  allergyList: [],
  nationalCuisineList: [],
  regionalCuisineList: {},
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
    case types.SET_NAME:
      return { ...state, firstName: action.payload.firstName, lastName: action.payload.lastName };
    case types.SET_USER_NAME:
      return { ...state, username: action.payload};
    case types.SET_AGE:
      return { ...state, age: action.payload};
    case types.SET_GENDER:
      return { ...state, gender: action.payload};
    case types.SET_FOOD_TYPE:
      return { ...state, foodType: action.payload.foodType, subFoodType: action.payload.subFoodType, allergies: []};
    case types.SET_PAST_FOOD:
      return { ...state, pastFoodTypes: action.payload};
    case types.SET_FAVOURITE_FOOD:
      return { ...state, favouritesFoodTypes: action.payload};
    case types.SET_ALLERGIES:
      return { ...state, allergies: action.payload};
    case types.SET_MOBILE_NUMBER:
      return {...state, mobileNumber: action.payload};
    case types.SET_ON_BOARDING_STATUS:
      return {...state, onBoardingStatus: action.payload};
    case types.ADD_REMOVE_ALLERGIES:

      let newAllergies = [...state.allergies];
      if (newAllergies.includes(action.payload)) {
        newAllergies = newAllergies.filter((c) => c !== action.payload);
      } else {
        if (action.payload === "None") {
          newAllergies = ["None"];
        } else {
          newAllergies.push(action.payload);
        }
      }
      return {...state, allergies: newAllergies};
    case types.REMOVE_ALLERGIES:
      return {...state, allergies: state.allergies.filter(id => id !== action.payload)};
    case types.SET_FULL_ALLERGY_LIST:
      return {...state, allergyList: action.payload};
    case types.SET_NATIONAL_CUISINE_LIST:
      return {...state, nationalCuisineList: action.payload};
    case types.SET_REGIONAL_CUISINE:
      return {...state, regionalCuisineList: {...state.regionalCuisineList, ...action.payload}};
    default:
      return state;
  }
}
