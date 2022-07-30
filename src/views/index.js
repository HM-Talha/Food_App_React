import React, { useEffect, useState } from "react";
import { Redirect, Route, Router, Switch, useHistory } from "react-router-dom";
import { createBrowserHistory } from "history";
import { useDispatch, useSelector } from "react-redux";
import Authentication from "./auth/authentication";
import FoodTypeSelector from "./onboarding/step-1";
import Step2 from "./onboarding/step-2";
import Step3 from "./onboarding/step-3";
import Step4 from "./onboarding/step-4";
import Step5 from "./onboarding/step-5";
import Step6 from "./onboarding/step-6";
import Home from "./home";
import Comfort from "./comfort";
import Restaurants from "./restaurants";
import RestaurantView from "./restaurants/restaurantView";
import MakePattern from "../modules/pattern/components/MakePattern";
import Pattern from "../modules/pattern/components";
import Profile from "../modules/Profile/components";
import { loginUser } from "../modules/auth/redux/actions";
import ViewRecipe from "../modules/comfort/components/ViewRecipe";
import Library from "../modules/comfort/components/Library";
import { CreateDishWrapper } from "../modules/create-recipe/components/CreateDishWrapper";
import Username from "../modules/onboarding/components/Username";
import GenderSelector from "../modules/onboarding/components/GenderSelector";
import AgeInput from "../modules/onboarding/components/AgeInput";
import { HomeSplashScreen, SplashScreen } from "../modules/onboarding/components/SplashScreen";
import { DishSensoryView } from "../modules/restaurants/components/DishSensoryView";
import Location from "../modules/location";
import ChangeLocation from "../modules/location/changeLocation";
import AddressDetails from "../modules/location/addressDetails";
import { RestaurantCheckout } from "../modules/restaurants/components/RestaurantCheckout";
import { PickupDetails } from "../modules/restaurants/components/PickupDetails";
import { RestaurantPayment } from "../modules/restaurants/components/RestaurantPayment";
import { RestaurantPayment2} from "../modules/restaurants/components/RestaurantPayment2";
import {RestaurantPayment3} from "../modules/restaurants/components/RestaurantPayment3";
import {PaymentStatus } from "../modules/restaurants/components/PaymentStatus";
import UserNumber from "../modules/onboarding/components/UserNumber"
import Otp from '../modules/onboarding/components/otp'
import Preference from '../modules/preference'
import { NavBg } from "../assets/images";
import { setMenu } from '../onState/actions'
import AppMenuBar from "../modules/layout/components/AppMenuBar";
import Feedback from "../modules/feedback/components/index";
import FeedbackDone from "../modules/feedbackDone/components";
import FeedbackFood from '../modules/feedback/components/food'
import Imagine from "./imagine";
import Orders from "../modules/order/orders";
import OrderDetails from "../modules/order/orderDetails";
import OrderPlaced from "../modules/orderPlaced/components";
import Pricing from "../modules/feedback/components/pricing";
import Privacy from "../modules/SettingsView/Components/privacy";
import Terms from "../modules/SettingsView/Components/terms";
import { RestaurantGallery } from "../modules/restaurants/components/RestaurantGallery";
import Settings from "../modules/SettingsView/Components/settings";
import { AccountDetails } from "../modules/SettingsView/Components/accountDetails";
import AppWrapper from "../components/Wrapper/AppWrapper";


export const history = createBrowserHistory();

const AppRoutes = () => {
    const dispatch = useDispatch();
    const { isMenu } = useSelector((state) => state.onState)
    const navigateLottie = ['ambience', 'attitude', 'service', 'experience', 'feeling']
    const navigate = ['dine', 'pickup', 'reception', 'pricing', 'portion']


    useEffect(() => {
        const tokenId = localStorage.getItem("__auth");

        if (tokenId) {
            const userData = JSON.parse(localStorage.getItem("user"));
            if (userData) {
                dispatch(loginUser(userData))
            }
        }

    }, []);


    return (
        <Router history={history}>
            <div style={{ height: '100%' }} className={isMenu ? "outer_wrapper" : 'position-relative'}>
                {
                    isMenu && <div className="side_nav_wrapper">
                        <Profile />
                    </div>
                }
                <div className={isMenu ? "main_app_wrapper " : 'slide-right'} style={{ background: '#fff', zIndex: 1, position: "relative", height: '100%' }}>
                    {isMenu && <span 
                        onClick={() => { window.history.back() }} 
                        style={{ height: '100vh', width: '100%', position: 'absolute', zIndex: 100, display: 'flex' }}>
                    </span>}
                    <div id={"backdrop"}/>
                    <Switch>
                        <Route exact path="/auth" component={Authentication} />
                        <Route exact path="/number" component={UserNumber} />
                        <Route exact path="/otp" component={Otp} />
                        <Route exact path="/step-1" component={Username} />
                        <Route exact path="/step-2" component={GenderSelector} />
                        <Route exact path="/step-3" component={AgeInput} />
                        <Route exact path="/step-4"
                            component={() => <SplashScreen title={["What do", "you eat?"]} subTitle={"Your food preferences"}
                                nextRoute={"/step-5"} />} />
                        <Route exact path="/step-5" component={FoodTypeSelector} />
                        <Route exact path="/step-6" component={Step4} />
                        <Route exact path="/step-7" component={() => <SplashScreen nextRoute={"/step-8"} />} />
                        <Route exact path="/step-8" component={Step2} />
                        <Route exact path="/step-9"
                            component={() => <SplashScreen title={["Any other", "favourites?"]} subTitle={"Food you love"}
                                nextRoute={"/step-10"} />} />
                        <Route exact path="/step-10" component={Step3} />
                        <Route exact path="/step-11" component={HomeSplashScreen} />
                        <Route exact path="/step-51" component={Step5} />
                        <Route exact path="/step-61" component={Step6} />
                        <Route exact path="/home" component={() => <AppWrapper><Home /></AppWrapper>} />
                        <Route exact path="/preference" component={Preference} />
                        <Route path="/comfort" component={() => <AppWrapper><Comfort type={"comfort"} /></AppWrapper>} />
                        {/* <Route path="/profile" component={Profile}/> */}
                        <Route path="/explore" component={() => <AppWrapper><Comfort type={"explore"} /></AppWrapper>} />
                        <Route path="/library" component={() => <Library type={"explore"} />} />
                        <Route path="/make-pattern" component={MakePattern} />
                        <Route path="/pattern" component={Pattern} />
                        <Route exact path="/restaurants/:id/:type" component={Restaurants} />
                        <Route exact path="/sensory-profile/:id/:recipeId" component={DishSensoryView} />
                        <Route exact path="/sensory-profile/:id" component={DishSensoryView} />
                        <Route exact path="/restaurant-view/:id/gallery" component={RestaurantGallery} />
                        <Route exact path="/restaurant-view/:id/:type" component={RestaurantView} />
                        <Route exact path="/restaurant/:id/checkout" component={RestaurantCheckout} />
                        <Route exact path="/restaurant/:id/pickup-details" component={PickupDetails} />
                        <Route exact path="/restaurant/:id/pay-1" component={RestaurantPayment} />
                <Route exact path="/restaurant/:id/pay-2" component={RestaurantPayment2}/>
                <Route exact path="/restaurant/:id/pay-3" component={RestaurantPayment3}/>
                        <Route exact path="/restaurant/:id/status/:order_id/:ref_number/:status" component={PaymentStatus} />
                        <Route exact path="/view-recipe/:id" component={ViewRecipe} />
                        <Route exact path="/create/recipe/:step" component={CreateDishWrapper} />
                        <Route exact path="/location" component={Location} />
                        <Route exact path="/change-location" component={ChangeLocation} />
                        <Route exact path="/address-details" component={AddressDetails} />
                        {navigateLottie.map((nav) => <Route exact path={`/feedback/${nav}/:id`} component={Feedback} />)}
                        {navigate.map((nav) => <Route exact path={`/feedback/${nav}/:id`} component={Pricing} />)}
                        <Route exact path="/feedback/done/:id" component={FeedbackDone} />
                        <Route exact path="/feedback/food/:id" component={FeedbackFood} />
                        <Route exact path="/imagine" component={Imagine} />
                        <Route exact path="/orders" component={Orders} />
                        <Route exact path="/order-details/:id" component={OrderDetails} />
                        <Route exact path="/order-placed" component={OrderPlaced} />
                        <Route exact path="/settings" component={Settings} />
                        <Route exact path="/settings/privacy" component={Privacy} />
                        <Route exact path="/settings/terms" component={Terms} />
                        <Route exact path="/settings/account-details" component={AccountDetails} />
                        {/*<Route exact path="/i_grew_up_eating" component={IGrewUpEating} />*/}
                        {/*<Route exact path="/i_like_eating" component={ILikeEating} />*/}
                        {/*<Route exact path="/allergies" component={AllergiesSelector} />*/}
                        <Redirect from="/" to="/auth" />
                        <Redirect to="/404" />
                    </Switch>
                </div>
            </div>
        </Router>
    );
};

export default AppRoutes;
