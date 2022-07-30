import React, {useState} from "react";
import "../../auth/styles/auth.scss";
import {main_bg} from "../../../assets/images";
import withFirebaseAuth from "react-with-firebase-auth";
import firebaseApp from "../../../config/firebase";
import firebase from "firebase";
import "../styles/username.scss";
import DoneSvg from "./assets/Done.svg";
import ErrorSvg from "./assets/Error.svg";
import {useHistory} from "react-router-dom";
import axios from "axios";
import {baseUrl} from "../../../config/api-config";
import {useDispatch, useSelector} from "react-redux";
import {setGender} from "../redux/actions";
import {OnBoardingHeader} from "./AgeInput";
import {Title} from '../components/../../../components/Fonts'

const firebaseAppAuth = firebaseApp.auth();
const providers = {
    googleProvider: new firebase.auth.GoogleAuthProvider(),
    facebookProvider: new firebase.auth.FacebookAuthProvider(),
    appleProvider: new firebase.auth.OAuthProvider('apple.com')
};

const GenderSelector = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const gender = useSelector((state) => state?.onboarding?.gender)

    const [isGender, _ ] = useState(gender)

    const handleGenderActivation = (name) => {
        dispatch(setGender(name));
        history.push("step-3");
    }

    return (
        <div className="auth-container username-wrapper">
            <OnBoardingHeader/>
            <div className="pl-24px pr-24px pb-24px">
                <Title style={{paddingBottom: '1.25rem'}} level={2} className={'text-center'}>I am</Title>
                <CustomButton mb={'1rem'} onClick={() => handleGenderActivation('male')} text={"Male"} selected={isGender === "male"}/>
                <CustomButton mb={'1rem'} onClick={() => handleGenderActivation('female')} text={"Female"} selected={isGender === "female"}/>
                <CustomButton onClick={() => handleGenderActivation('Other')} text={"Other"} selected={isGender === "Other"}/>
            </div>
        </div>
    )
};

export const CustomButton = ({onClick, text, selected, mb,  showIcon=true}) => {
    return (
        <div style={{width: '100%', height: '48px', marginBottom: mb, marginTop: 0}} className={`${!selected ?  "input-btn-wrapper body-text" : " input-btn-wrapper btn-active head-line" }`} onClick={onClick}>
            <img src={DoneSvg}/>
            <button autoFocus className={text !== "" && "active-input"}
                   value={text} onChange={(e) => {

            }}>
                {text}
            </button>
            {showIcon && <img className="next-btn" src={DoneSvg}/>}
        </div>
    )
}

export default withFirebaseAuth({
    providers,
    firebaseAppAuth,
})(GenderSelector);