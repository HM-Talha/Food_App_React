import React, { useEffect, useState } from "react";
import AppMenuBar from "../../layout/components/AppMenuBar";
import { useHistory } from "react-router-dom";
import "../styles/home.scss";
import { bg1 } from "../../../assets/images";
import axios from "axios";
import { baseUrl } from "../../../config/api-config";
import Loader from "../../../components/loader/Loader";
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/swiper.scss';
import "swiper/swiper.min.css";
import "swiper/components/effect-coverflow/effect-coverflow.min.css"
import "swiper/components/pagination/pagination.min.css"
import SwiperCore, { EffectCoverflow, Pagination } from 'swiper/core';
import UserChoice from "../../onboarding/components/UserChoice";
import { HeaderHomeIcon, RightArrowIcon, PickUpFill, PickUpOutline, DeliveryFill, DeliveryOutline } from '../../../assets/icons'
import BtnTabs from "../../../components/BtnTabs";
import AppHeader from "../../../components/appHeader";
import {useDispatch, useSelector} from "react-redux";
import { setPrimaryLocation } from "../../location/redux/actions";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import '../styles/toast.scss'

import _ from  'lodash'
import {setUserDetails} from "../redux/actions";
import { Title, Text } from "../../../components/Fonts";


// install Swiper modules
SwiperCore.use([EffectCoverflow, Pagination]);

const Msg = () => {
    return(
        <>
            <div className="toast-msg">
                <div className="toast-bold">
                    Your Order from Salvadore's
                </div>
                <div className="toast-light">
                    Your Order is Ready To Pick Up
                </div>
            </div>
        </>
    );
}

const Review = () => {
    const history = useHistory()
    return(
        <>
            <div className="toast-msg" onClick={() => {history.push('/orders')}}>
                <div className="toast-bold">
                    Review your experience at Salvadore's
                </div>
                <div className="toast-light">
                    Give feedback for better recommendations
                </div>
            </div>
        </>
    );
}

const Toast = (props) => {
    const img = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M3.81836 16.1966H20.182C20.182 11.042 16.5189 6.86328 12.0002 6.86328C7.48148 6.86328 3.81836 11.042 3.81836 16.1966Z" fill="#DBEF06"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M20.1416 15.2633C19.7311 10.5468 16.2427 6.86328 12.0002 6.86328C7.75762 6.86328 4.26926 10.5468 3.85876 15.2633C3.83204 15.5703 3.81836 15.8816 3.81836 16.1966H20.182C20.182 15.8816 20.1683 15.5703 20.1416 15.2633ZM4.77136 15.2633H19.229C18.8237 10.9892 15.6667 7.79661 12.0002 7.79661C8.33365 7.79661 5.17664 10.9892 4.77136 15.2633Z" fill="#292929"/>
                    <path d="M2 17.1323C2 16.1014 2.81403 15.2656 3.81818 15.2656H20.1818C21.186 15.2656 22 16.1014 22 17.1323C22 18.1632 21.186 18.999 20.1818 18.999H3.81818C2.81403 18.999 2 18.1632 2 17.1323Z" fill="#DBEF06"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M20.1818 16.199H3.81818C3.3161 16.199 2.90909 16.6168 2.90909 17.1323C2.90909 17.6478 3.3161 18.0656 3.81818 18.0656H20.1818C20.6839 18.0656 21.0909 17.6478 21.0909 17.1323C21.0909 16.6168 20.6839 16.199 20.1818 16.199ZM3.81818 15.2656C2.81403 15.2656 2 16.1014 2 17.1323C2 18.1632 2.81403 18.999 3.81818 18.999H20.1818C21.186 18.999 22 18.1632 22 17.1323C22 16.1014 21.186 15.2656 20.1818 15.2656H3.81818Z" fill="#292929"/>
                    <path d="M11.0918 5.93333C11.0918 5.41787 11.4988 5 12.0009 5C12.503 5 12.91 5.41787 12.91 5.93333V6.86667C12.91 7.38213 12.503 7.8 12.0009 7.8C11.4988 7.8 11.0918 7.38213 11.0918 6.86667V5.93333Z" fill="#292929"/>
                </svg>
    useEffect(() => {
        if(props.order){
            toast(<Msg />, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                icon: img,
            })
        }
        if(props.review) {
            toast(<Review />, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                icon: img,
            })
        }
    }, [])

    return(
        <>
            <ToastContainer style={{bottom:72, width: "95%", margin: 10}} />
        </>
    )
}

const Home = (props) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [loading, setLoading] = useState(true);
    const {userDetails} = useSelector(state => state.home)
    async function getUserDetails() {
        try {
            if (Object.keys(userDetails).length === 0) {
                const res = await axios.get(`${baseUrl}/user/get/one`)
                dispatch(setUserDetails(res.data.data))
                if (!res.data.data.otpVerified) {
                    history.push('/number')
                }
                if (res.data.data.primaryLocation) {
                    const primaryLocation = _.find(res.data.data.locations, ['_id', res.data.data.primaryLocation])
                    dispatch(setPrimaryLocation(primaryLocation))
                } else {
                    history.push('/change-location')
                }
            } else {

            }
        } finally {
            // setLoading(false)
        }
    }
    
    useEffect(() => {
        setLoading(true)
        getUserDetails().then(()=>{
            setLoading(false)
        })
    }, [])

    return (
        <>
        {loading && <Loader loading={loading} isComponent />}
        {!loading && <div className="home">
            {/* <img src={bg1} className="home__bg"/> */}
            <AppHeader />
            <div className="home__main">
                {loading && <Loader loading={loading} isComponent />}
                {
                    !loading && <>
                        <div className="home__welcome text-center">
                            <Title level={1}>Hi {userDetails.firstName}</Title>
                            <Text className={'mt-4px'}>Try this, you’ll love it!</Text>
                        </div>
                        {/* <BtnTabs /> */}
                        <UserChoice user={userDetails} setUser={(user) => {dispatch(setUserDetails(user))}} />
                    </>
                }
                <Toast order={props?.history?.location?.state?.order} review={props?.history?.location?.state?.review} />
            </div>
            <AppMenuBar />
        </div>}
        </>
    );
};

export default Home;
