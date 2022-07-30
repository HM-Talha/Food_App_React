import React, {useState} from "react";
import "../../auth/styles/auth.scss";
import {main_bg, onboardingBack} from "../../../assets/images";
import withFirebaseAuth from "react-with-firebase-auth";
import firebaseApp from "../../../config/firebase";
import firebase from "firebase";
import "../styles/age.scss";
import {useHistory} from "react-router-dom";
import axios from "axios";
import {baseUrl} from "../../../config/api-config";
import Loader from "../../../components/loader/Loader";
import {useDispatch, useSelector} from "react-redux";
import {setAge} from "../redux/actions";
import Picker from "react-mobile-picker-scroll";
import {vibrate} from "./FoodtypeSelector";
import {CustomButton} from "../../../components/formInput/Input";
import { Title } from "../../../components/Fonts";

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
                history.goBack()
            }}/>
        </div>
    )
}

const AgeInput = (props) => {
    const history = useHistory();
    const {user, signOut} = props;
    const {onboarding, auth: {user: {}}} = useSelector(state => state);
    const {username, age, gender, firstName, lastName} = onboarding;
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const saveUserDetails = async () => {
        console.log(onboarding)
        var bodyFormData = new FormData();
        bodyFormData.append("image", "");
        bodyFormData.append("age", age);
        bodyFormData.append("gender", gender);
        bodyFormData.append("userName", username);
        bodyFormData.append("firstName", firstName);
        bodyFormData.append("lastName", lastName);
        bodyFormData.append("name", firstName + " " + lastName);
        const res = await axios.put(`${baseUrl}/user/update/users`,
            bodyFormData);
        history.push("step-4");
    }
    return (
        <>{loading ? <Loader loading={loading} isComponent/> :
            <div className="auth-container username-wrapper">
                <OnBoardingHeader/>
                <div className="d-flex flex-column align-items-center justify-content-between pb-24px pl-24px pr-24px"
                     style={{ overflow: "hidden"}}>
                     <Title level={2}>How old are you?</Title>
                    <CustomInput onSubmit={async () => {
                        setLoading(true)
                        await saveUserDetails()

                    }} onChange={async (text) => {
                        dispatch(setAge(text))
                    }} value={age || 18}/>
                </div>
            </div>}</>
    )
};

function getAgeItems(selectedIndex) {
    const ageItems = [...Array(100).keys()].filter(a => a > 0).map((a, index) => <div key={index} id={"age-picker-" + index}>{a}</div>);
    ageItems[selectedIndex - 1] = <div id={"age-picker-" + (selectedIndex - 1)} className="sibling-selected" key={selectedIndex - 1}>{selectedIndex}</div>;
    // ageItems[selectedIndex + 1] = <div id={"age-picker-" + (selectedIndex + 1)} className="sibling   -selected" key={selectedIndex + 1}>{selectedIndex + 2}</div>;
    return ageItems;
}

const CustomInput = ({onSubmit, onChange, error = false, value = 18}) => {
    const [state, setState] = useState(() => {
        const ageItems = getAgeItems(value - 1);
        return {
            valueGroups: {
                age: ageItems[value - 1],
            },
            optionGroups: {
                age: ageItems,
            }
        }
    })
    return (
        <>
            <div className="age-picker-wrapper">
            <Picker

                height={380}
                itemHeight={70}
                optionGroups={state.optionGroups}
                valueGroups={state.valueGroups}
                onChange={(name, value) => {
                    [...Array(100).keys()].filter(a => a > 0)
                        .forEach(i => {
                            if (document.getElementById("age-picker-" + i) !== null) {
                                if (i === parseInt(value.key) - 1 || i === parseInt(value.key) + 1) {
                                    document.getElementById("age-picker-" + i).classList.add('sibling-selected');

                                } else {

                                    document.getElementById("age-picker-" + i).classList.remove('sibling-selected');

                                }
                            }
                        })
                    vibrate()
                    setState(({optionGroups, valueGroups}) => {
                        return {
                            valueGroups: {
                                ...valueGroups,
                                [name]: value
                            },
                            optionGroups
                        }
                    });
                    onChange(parseInt(value.key) + 1)
                }}
            />
            </div>
            <div style={{width: '100%'}}>
                <CustomButton className="head-line p-0" title={"Next"} onClick={onSubmit}/>
            </div>
        </>
    )
}

export default withFirebaseAuth({
    providers,
    firebaseAppAuth,
})(AgeInput);