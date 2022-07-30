import { combineReducers } from 'redux';
import auth from "../modules/auth/redux/reducer"
import location from "../modules/location/redux/reducer"
import onState from "../onState/reducer"
import onboarding from "../modules/onboarding/redux/reducer"
import activePath from "../modules/layout/redux/reducer"
import card from '../modules/restaurants/redux/reducer'
import restaurants from "../modules/restaurants/redux/reducer"
import home from "../modules/home/redux/reducer"
import feedback from '../modules/feedback/redux/reducer'

export const reducers = combineReducers({
    onState,
    activePath,
    location,
    auth,
    onboarding,
    card,
    restaurants,
    home,
    feedback
});
