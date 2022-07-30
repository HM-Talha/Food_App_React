import React, {useEffect, useState} from "react";
import HomeSplashImg from "./assets/homeSplash.svg"
import FoodSplashImg from "./assets/foodSplash.svg"
import HomeCuisineSplashImg from "./assets/homeCuisineSplash.svg"
import FavCuisineSplashImg from "./assets/favouriteSplash.svg"
import {Redirect, useHistory} from "react-router-dom";

import "../styles/splash.scss"
import axios from "axios";
import {baseUrl} from "../../../config/api-config";
import {useDispatch, useSelector} from "react-redux";
import Lottie from "lottie-react";
import {fetchSwipingDishes, setRecommendedDishes} from "../../home/redux/actions";
import { Title } from "../../../components/Fonts";

let EatLottie = require('../../../assets/lottie/EAT.json');
let HomeLottie = require('../../../assets/lottie/Home.json');
let HeartLottie = require('../../../assets/lottie/Heart.json');
let StartedLottie = require('../../../assets/lottie/Started.json');

export const SplashScreen = ({title = ["What feels", "like home?"], subTitle = "Food you grew up eating", nextRoute = "/step-5"}, Img = FoodSplashImg) => {
    const history = useHistory();
    const [next, setNext] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setNext(true)
            // history.push(nextRoute, history.location.state)
        }, 4000);
    }, []);

    function getImageBasedOnNextRoute() {
        switch (nextRoute) {
            case "/step-5":
                return EatLottie;
            case "/step-8":
                return HomeLottie
            case "/step-10":
                return HeartLottie
            default:
                return EatLottie
        }

    }

    return (
        <div className="splash-wrapper">
            {/*<img className="splash-bg" src={Splash}/>*/}
            <div className="splash-text-wrapper">
                <span className="xl-large-text FoundersGrotesk-Medium">{title.map(t => <div>{t}</div>)}</span>
                <Title level={2} className='mt-12px'>{subTitle}</Title>
                <Lottie animationData={getImageBasedOnNextRoute()} autoPlay={true}
                        className="splash-display-img" />
            </div>
            {next && <Redirect to={nextRoute}/>}
        </div>
    )
}

export const HomeSplashScreen = ({title = ["Let's Get", "Started!"], subTitle = "Food you grew up eating", nextRoute = "/home"}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [next, setNext] = useState(false);
    const onboarding = useSelector(state => state.onboarding)

    useEffect(() => {
        dispatch(fetchSwipingDishes())
    }, [])
    
    useEffect(() => {
        setTimeout(() => {
            setTimeout(async () => {
                console.log(onboarding)

                try {
                    const {foodType, subFoodType, pastFoodTypes, favouritesFoodTypes, allergies} = onboarding;

                    const res = await axios.put(`${baseUrl}/user/onboarding-response`, {
                        type: foodType, //"non-veg",
                        subtype: subFoodType, //"kosher",
                        native: Object.keys(pastFoodTypes),
                        regional: Object.values(pastFoodTypes).flat(10),
                        allergy: allergies.filter(all => all !== "None"),
                        liked: favouritesFoodTypes,
                        isOnBoardingCompleted: true
                    })


                    setNext(true)
                    // if (res.data.returnObj.data.length > 0) {
                    // } else {
                    //     history.push("/step-6", res.data);
                    // }
                } catch (e) {
                    setNext(true)
                }
            }, 10)

            // history.push(nextRoute)
        }, 3000);
    }, []);
    return (
        <div className="splash-wrapper">
            <div className="home-splash-text-wrapper">
                <Lottie animationData={StartedLottie} autoPlay={true}
                        className="splash-display-img" />
                <span className="title">{title.map(t => <div>{t}</div>)}</span>
            </div>
            {next && <Redirect to={nextRoute}/>}
        </div>
    )
}