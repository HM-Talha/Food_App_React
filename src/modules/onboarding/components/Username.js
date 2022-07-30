import React, {useEffect, useState} from "react";
import "../../auth/styles/auth.scss";
import {main_bg, onboardingBack} from "../../../assets/images";
import withFirebaseAuth from "react-with-firebase-auth";
import firebaseApp from "../../../config/firebase";
import firebase from "firebase";
import "../styles/username.scss";
import DoneSvg from "./assets/Done.svg";
import ErrorSvg from "./assets/Error.svg";
import {useHistory} from "react-router-dom";
import axios from "axios";
import {baseUrl} from "../../../config/api-config";
import Loader from "../../../components/loader/Loader";
import {useDispatch, useSelector} from "react-redux";
import {
    setAge,
    setFullAllergyList,
    setGender,
    setName,
    setNationalCuisineList,
    setOnboardingStatus, setRegionalCuisine,
    setUserName
} from "../redux/actions";
import { Caption, Footnote, Title } from "../../../components/Fonts";

const firebaseAppAuth = firebaseApp.auth();
const providers = {
    googleProvider: new firebase.auth.GoogleAuthProvider(),
    facebookProvider: new firebase.auth.FacebookAuthProvider(),
    appleProvider: new firebase.auth.OAuthProvider('apple.com')
};

export const OnBoardingHeader = () => {
    const history = useHistory();
    return (
        <div className="on-boarding-header">
            <img src={onboardingBack} className="onboarding-back-img" onClick={() => {
                history.push('/number');
            }}/>
        </div>
    )
}

const Username = (props) => {
    console.log(props.user)
    const [loading, setLoading] = useState(!!props.user);
    const history = useHistory();
    const {user, signOut} = props;
    const username = useSelector(state => state.onboarding.username);
    const [usernameError, setUsernameError] = useState(!!username ? "" : "");
    const dispatch = useDispatch()
    useEffect(async () => {
        
       await checkUsernameAvailability(username)
    }, [username])

    async function checkUsernameAvailability(name) {
        if(name.length > 15) {
            setUsernameError('Username must be less then 15 characters')
            return    
        }
        if(name.length < 2){
            setUsernameError('Your username must be 2-15 characters and contain only letters, numbers and underscores and no spaces.')
            return
        }
        if (/\s/g.test(name)) {
            setUsernameError("Spaces are not allowed in the unique Pikky ID");
            return;
        }
        const validUsername = /^[-_a-zA-Z0-9]+$/g.test(name);
        if (validUsername) {
            try {
                const res = await axios.get(`${baseUrl}/user/check-username?name=${name}`);
                setUsernameError("")
            } catch (e) {
                setUsernameError("Username has already been taken")
            
            }
        } else {
            setUsernameError("Your username must be 2-15 characters and contain only letters, numbers and underscores and no spaces.")
        }
    }

    async function fetchOnboardingDetails() {
        const res = await axios.get(`${baseUrl}/cuisine/main`);
        let cuisines = res.data;
        cuisines = cuisines.map(c => ({...c, name: c.name[0].name}))
        cuisines = cuisines.sort((a, b) => a.name.localeCompare(b.name))
        const nationalCuisines = cuisines.map((d, idx) => ({...d, idx}));
        dispatch(setNationalCuisineList(nationalCuisines));
        const nationalCuisineIds = nationalCuisines.map(national => national._id);
        const regionalCuisinesResp = await axios.get(`${baseUrl}/cuisine/regional/all`);
        let regionalObj = {};
        let uniqueRegionalIds = {}
        nationalCuisineIds.forEach(nationalId => {
            regionalObj[nationalId] = null;
            uniqueRegionalIds[nationalId] =[];
        });
        regionalCuisinesResp.data.result.cuisineNameData.forEach(regional => {
           regional.parent.forEach(regionalParent => {
               if (!uniqueRegionalIds[regionalParent].includes(regional._id)) {
                   regionalObj[regionalParent] = regionalObj[regionalParent] !== null ? regionalObj[regionalParent].concat(regional) : [regional]
                   uniqueRegionalIds[regionalParent].push(regional._id)
               }
           })
        });
        for (const key in regionalObj) {
            let data = regionalObj[key];
            if (data !== null) {
                data = data.map(c => ({...c, name: c.name[0].name}))
                data = data.sort((a, b) => a.name.localeCompare(b.name))
                if (data.length > 0) {
                    data = [{name: "all", _id: "all", image: []}, ...data];
                }
                regionalObj[key] = data
            }
        }
        dispatch(setRegionalCuisine(regionalObj));
        const allergyResp = await axios.get(`${baseUrl}/cuisine/get-allergies`);
        dispatch(setFullAllergyList(allergyResp.data.data))
    }

    async function getUserDetails() {
        try {
            const res = await axios.get(`${baseUrl}/user/get/one`);
            dispatch(setUserName(res?.data?.data?.userName || ""));
            dispatch(setAge(res?.data?.data?.age || ""));
            dispatch(setGender(res?.data?.data?.gender || ""));

            setUsernameError(!!res?.data?.data?.userName);

            if ("isOnBoardingCompleted" in res.data.data && res.data.data.isOnBoardingCompleted) {
                history.push("/home")
            }
        } finally {
            setLoading(false)
            await fetchOnboardingDetails();
        }
    }
    useEffect(() => {
        if (!username) {
            setLoading(true)
            getUserDetails();
        }
    }, [])

    useEffect(() => {
        dispatch(setName({firstName: user?.providerData[0]?.displayName?.split(" ")?.[0], lastName: user?.providerData[0]?.displayName?.split(" ")?.[1]}))
    }, [props.user])

    return (
        <>
        {loading ? <Loader loading={loading} isComponent/>:
        <div className="auth-container username-wrapper">
            <OnBoardingHeader/>
            <div className="d-flex justify-content-center flex-column align-items-center pl-24px pr-24px pb-16px">
                    <Title level={2} className='text-capitalize'>
                         Hey, {user?.providerData[0]?.displayName}
                    </Title>

                <CustomInput onSubmit={(val) => {
                    dispatch(setUserName(val))
                    history.push("step-2");
                }} onChange={(text) => {

                    checkUsernameAvailability(text)
                }} error={usernameError} value={username}/>
            </div>
        </div>}</>
    )
};

const CustomInput = ({onSubmit, onChange, error, value=""}) => {
    const [text, setText] = useState(value);
    return (
        <>
        <div style={{width: '100%'}} className="input-wrapper mt-20px mb-0">
            <input autoFocus className={`${text !== "" && "active-input"} body-text text-center`} placeholder="Create your unique Pikky ID "
                   value={text} onChange={(e) => {
                    if((e.target.value.match(/_/g) || []).length > 1) return null;
                       setText(e.target.value);
                       onChange(e.target.value)
                    }} />

            {text !== '' && <div style={{background: error ? "#E5E5E1" :  "#DBEF06" }} className="submit-icon-wrapper">
                    <img  src={DoneSvg} onClick={() => {
                        !error && onSubmit(text)
                    }
                }/></div>
            }
        </div>
            <div className="w-100 pt-8px pb-8px">
                <Footnote className='text-left' color='#DD2E44'>{text !== '' && error && error}</Footnote>
            </div> 
        </>
    )
}

export default withFirebaseAuth({
    providers,
    firebaseAppAuth,
})(Username);
