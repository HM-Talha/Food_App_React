import React, {useEffect, useState} from "react";
import "../styles/otp.scss";
import "../../auth/styles/auth.scss";
// import "../styles/username.scss";
import {useHistory} from "react-router-dom";
import axios from "axios";
import {baseUrl} from "../../../config/api-config";
import Loader from "../../../components/loader/Loader";
import useCountDown from 'react-countdown-hook';
import {OnBoardingHeaderForNumber} from "./UserNumber";
import {CustomButton} from "../../../components/formInput/Input";
import {useSelector} from "react-redux";
import { Footnote, Title } from "../../../components/Fonts";

var initialTime = 60 * 1000;  
const interval = 1000;
const Timer = ({value = ''}) => {
    const [timeLeft, {start, pause, resume, reset}] = useCountDown(initialTime, interval);
    // start the timer during the first render
    const otp = async () => {
        try {
            const data = await axios.post(`${baseUrl}/user/send/otp`, {number: value})
            console.log("data", data.data)

        } catch (error) {
            console.log("Error", error)
        }
    }
    useEffect(async () => {
        start();
    }, []);

    return (
        <button disabled={(timeLeft) ? true : false} className="resend_button" onClick={() => {
            otp();
            start()
        }}>
            <Title level={'subHeading'} color={(timeLeft) ? '#8A8A87' : '#748000'}> Resend OTP {(timeLeft) ? `in ${timeLeft / 1000}s` : ''} </Title>
        </button>
    );
}


const Otp = (props) => {
    console.log("props.user")
    const [loading, setLoading] = useState(!!props.user);
    const history = useHistory();
    const [otp, setotp] = useState(null)
    const [message, setMessage] = useState('')
    const {mobileNumber, onBoardingStatus} = useSelector((state) => state?.onboarding)
    const state = useSelector((state)=> console.log("State " ,state))
    const handler = (e) => {
        if (otp === null) {
            setotp(e.target.value)
        } else if (e.target.value.length <= 4) {
            setotp(e.target.value)
        }
        setMessage('')
    }
    useEffect(()=>{
        console.log("data => ",props.user)
    })
    const verifyOTP = async () => {
        setLoading(true)
        try {
            const data = await axios.post(`${baseUrl}/user/verify/otp`, {value: otp})
            console.log("data", data.data)
            if (data.data.code === 500) {
                setMessage(data.data.message)
            }
            if (data.data.code === 200) {
                if (onBoardingStatus) {
                    history.push("/home");
                } else {
                    history.push("/step-1");
                }
            }

        } catch (error) {
            console.log("Error", error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
                <div className="auth-container usernumber-wrapper">
                    <OnBoardingHeaderForNumber isUserNumberScreen={false}/>
                    <div className="otp-input-container pl-24px pr-24px">
                        <div>
                            <div>
                               <Title level={2}> Verify your mobile number</Title>
                            </div>
                            <div className="mt-8px">
                            <Title level={'subHeading'} color='#8A8A87'>
                                    Enter the OTP sent to your mobile number
                            </Title>
                            </div>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <input className="level-1 mt-20px" placeholder="9999" onChange={handler} type="number" value={otp}/>
                            <Footnote className='mt-12px' color='#DD2E44'>{message}</Footnote>
                        </div>
                        <div className="d-flex justify-content-between mt-48px">
                            <Title level={'subHeading'}>
                                Did not recieve OTP?
                            </Title>
                            <Timer value={mobileNumber}/>
                        </div>
                    </div>
                    <div className="pl-32px pr-32px pb-24px" style={{color: '#8A8A87', textAlign: 'center'}}>
                        <Footnote>By signing-up you agree to the <a href="/settings/terms" style={{color: '#8A8A87'}}>terms of service</a> and <a a href="/settings/privacy" style={{color: '#8A8A87'}}>privacy policy</a> offered by Pikky.</Footnote>
                    </div>
                    <div className="pb-24px pl-24px pr-24px">
                        {/* <span className="text-capitalize">Hey, {user?.providerData[0]?.displayName}</span> */}
                        <CustomButton onClick={verifyOTP} title={"Verify"} disabled={otp === null || otp.length !== 4} className='p-0'/>
                    </div>
                </div>
                </>
    )
};

export default Otp;