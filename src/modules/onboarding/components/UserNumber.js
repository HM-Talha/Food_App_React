import React, {useEffect, useState} from "react";
import "../styles/usernumber.scss";
import "../../auth/styles/auth.scss";
import {backcreate} from "../../../assets/images";
import {useHistory} from "react-router-dom";
import axios from "axios";
import {baseUrl} from "../../../config/api-config";
import Loader from "../../../components/loader/Loader";
import {CustomButton} from "../../../components/formInput/Input";
import {setAge, setGender, setMobileNumber, setOnboardingStatus, setUserName} from "../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useLocation } from 'react-router-dom'
import withFirebaseAuth from "react-with-firebase-auth";
import firebaseApp from "../../../config/firebase";
import {Footnote, Title} from "../../../components/Fonts";
import Button from "../../../components/buttons";

const firebaseAppAuth = firebaseApp.auth();

export const OnBoardingHeaderForNumber = (props) => {
    const history = useHistory();
    return (
        <div className="pt-24px pb-24px pl-24px pr-24px">
            <img src={backcreate} className="" onClick={ async () => {
                if (props.isUserNumberScreen) {
                    props.signOut()
                    localStorage.clear();
                    history.push("/auth")
                } else {
                    history.goBack()
                }
            }}/>
        </div>
    )
}

const UserNumber = (props) => {
    const [loading, setLoading] = useState(!!props.user);
    const history = useHistory();
    const dispatch = useDispatch();
    const [mobile, setMobile] = useState("")
    const [message, setMessage] = useState('');
    async function getUserDetails() {
        try {
            const res = await axios.get(`${baseUrl}/user/get/one`);
            dispatch(setUserName(res?.data?.data?.userName || ""));
            dispatch(setAge(res?.data?.data?.age || ""));
            dispatch(setGender(res?.data?.data?.gender || ""));
            dispatch(setOnboardingStatus(res?.data?.data?.isOnBoardingCompleted || false));
            if ("otpVerified" in res.data.data && res.data.data.otpVerified && "isOnBoardingCompleted" in res.data.data && res.data.data.isOnBoardingCompleted) {
                history.push("/home")
            }
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        setLoading(true)
        getUserDetails();
    }, [])
    const sendOtp = async () => {
        try {
            setLoading(true)
            if (mobile === null) {
                setMessage("Invalid Number")
            } else {
                const data = await axios.post(`${baseUrl}/user/send/otp`, {number: '+' + mobile})
                console.log("data", data.data)
                if (data.data.code === 500) {
                    setMessage(data.data.message)
                }
                if (data.data.code === 200) {
                    dispatch(setMobileNumber(mobile));
                    // setMessage(data.data.message)
                    history.push("/otp");
                }

            }
        } catch (error) {
            console.log("Error", error)
        } finally {
            setLoading(false)
        }
    }
    const handler = (e) => {
        if (mobile === null) {
            setMobile(e.target.value)
            setMessage('')
        } else {
            setMobile(e.target.value)
        }

    }
    return (
        <>
            {loading ? <Loader loading={loading} isComponent/> :
                <div className="auth-container usernumber-wrapper">
                    <OnBoardingHeaderForNumber signOut={props.signOut} isUserNumberScreen={true} />
                    <div className="number-input-container pl-24px pr-24px">
                        <div>
                            <Title level={2}>
                            Enter your contact number
                            </Title>
                        </div>

                        <div className="mt-20px">
                            <PhoneInput
                                containerClass="phone-input-international"
                                value={mobile}
                                onChange={(phone)=>{
                                    setMobile(phone);
                                    setMessage('')
                                }}
                                disableDropdown
                                placeholder={"+1 (999) 999-9999"}
                            />
                        </div>
                    </div>
                    <div className="pl-32px pr-32px pb-24px" style={{color: '#8A8A87', textAlign: 'center'}}>
                        <Footnote>By signing-up you agree to the <a href="/settings/terms" style={{color: '#8A8A87'}}>terms of service</a> and <a a href="/settings/privacy" style={{color: '#8A8A87'}}>privacy policy</a> offered by Pikky.</Footnote>
                    </div>
                    <div className="pb-24px pl-24px pr-24px">
                     <p className="message-wrapper fade" style={{fontSize: "15px",margin : 'auto', fontWeight: "400", color: 'red'}}>{message}</p>
                        <CustomButton title={"Send OTP"} onClick={sendOtp} disabled={mobile?.length===0} className="p-0"/>
                    </div>
                </div>}</>
    )
};

export default withFirebaseAuth({
    firebaseAppAuth,
})(UserNumber);