import React, {useEffect, useState} from "react";
import withFirebaseAuth from "react-with-firebase-auth";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseApp from "../../../config/firebase";
import {useHistory} from "react-router-dom";

import {main_bg, pikkyLogo, PikkyLogoTypeOnly} from "../../../assets/images";
import {AppleIcon, GoogleIcon} from "../../../assets/icons";

import Button from "../../../components/buttons";

import "../styles/auth.scss";
import axios from "axios";
import {useDispatch} from "react-redux";
import {loginUser} from "../redux/actions";
import {baseUrl, initAxios} from "../../../config/api-config";
import Loader from "../../../components/loader/Loader";
import {vibrate} from "../../onboarding/components/FoodtypeSelector";
import {setRecommendedDishes} from "../../home/redux/actions";
import { Text, Title } from "../../../components/Fonts";

const firebaseAppAuth = firebaseApp.auth();
const providers = {
    googleProvider: new firebase.auth.GoogleAuthProvider(),
    facebookProvider: new firebase.auth.FacebookAuthProvider(),
    appleProvider: new firebase.auth.OAuthProvider('apple.com')
};
const VERSION = "4";
const Authentication = (props) => {
    const history = useHistory();

    const [loading, setLoading] = useState(!!props.user);
    const dispatch = useDispatch()
    console.log(props)
    const {user, signOut} = props;
    const signInWithGoogle = () => firebaseAppAuth.signInWithRedirect(providers.googleProvider)

    async function signInWithApple() {
        const result = await firebaseAppAuth.signInWithRedirect(providers.appleProvider);
        console.log(result.user); // logged-in Apple user
    }

    // const { user, signOut} = props;

    async function fetchToken(idToken) {
        try {
            const currentVersion = localStorage.getItem("VERSION");
            if (currentVersion !== null && currentVersion !== VERSION) {
                localStorage.clear();
                sessionStorage.clear();
                signOut()
                localStorage.clear();
                setTimeout(() => {
                    window.location.href = "/auth"
                }, 3000)
                localStorage.setItem("VERSION", VERSION)
                setLoading(false)
                return
            }
            localStorage.setItem("VERSION", VERSION)
            const res = await axios.post(`${baseUrl}/auth/verify-token`, {idToken})
            dispatch(loginUser(res.data))
            initAxios();
            setLoading(false)
            history.push('/number');
        } catch (e) {
            setLoading(false)
            console.log(e)
        }

    }

    // function signInWithGoogle() {
    //     history.push("step-1");
    // }

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            if (user) {
                setTimeout(() => {
                    user
                        ?.getIdToken(/* forceRefresh */ true)
                        .then(function (idToken) {
                            setLoading(true)
                            fetchToken(idToken)

                        })
                        .catch(function (error) {
                            // Handle error
                        });
                }, 1)
                setLoading(true)
            } else {
                if(!localStorage.getItem('sign'))
                    setLoading(false)
            }
        }, 1)

        vibrate()
    }, [user]);


    return (
        <div className="auth-container">
            {loading && <Loader loading={loading} isComponent/>}
            {
                !loading && <>
                    <img src={main_bg} alt="" className="auth-container__bg"/>
                    <div className="sign-in-wrapper pb-40px pr-24px pl-24px">
                        <div className="pikky-logo-type-only-css">
                        <div className="d-flex flex-column justify-content-center w-full align-items-center">
                            <img width={'80px'} height={'31px'} src={PikkyLogoTypeOnly} />
                            <div className="mt-8px">
                               <Text>Let's get started</Text>
                            </div>
                        </div>
                        </div>
                        <div className="auth-options">
                            <Button
                                icon={<GoogleIcon/>}
                                variant="secondary"
                                caption="Sign in with Google"
                                onClick={() => {
                                    localStorage.setItem("sign", true)
                                    setLoading(true)
                                    signInWithGoogle()

                                }}
                            />
                            <Button
                                icon={<AppleIcon/>}
                                variant="secondary"
                                caption="Sign in with Apple"
                                onClick={() => {
                                    localStorage.setItem("sign", true)
                                    setLoading(true)
                                    signInWithApple()
                                }}
                            />
                            {/*<Button*/}
                            {/*    icon={<AppleIcon/>}*/}
                            {/*    variant="secondary"*/}
                            {/*    caption="Continue with Apple"*/}
                            {/*/>*/}
                            {/*<Button*/}
                            {/*    icon={<GoogleIcon/>}*/}
                            {/*    variant="secondary"*/}
                            {/*    caption="Continue with Google"*/}
                            {/*/>*/}
                            {/*<Button*/}
                            {/*    icon={<FacebookIcon/>}*/}
                            {/*    variant="secondary"*/}
                            {/*    caption="Continue with Facebook"*/}
                            {/*/>*/}
                        </div>
                    </div>
                </>
            }

        </div>
    );
};

const SplashScreen = () => {
    return (
        <div className="splash-screen h-100 d-flex justify-content-center align-items-center flex-column">
            <Title level={1}>Hi I'm</Title>
            <div className="d-flex justify-content-center align-items-center">
                <img className="mt-20px" src={pikkyLogo}/>
            </div>
        </div>
    )
}


const AuthenticationWrapper = (props) => {
    const [screenIndex, setScreenIndex] = useState(0);
    useEffect(() => {
        setTimeout(() => {
            setScreenIndex(screenIndex + 1)
        }, 3000)
    }, []);
    return (
        <div className="auth-wrapper">
            {
                screenIndex === 0 && <SplashScreen {...props}/>
            }
            {
                screenIndex === 1 && <Authentication {...props}/>
            }
        </div>
    )
}

export default withFirebaseAuth({
    providers,
    firebaseAppAuth,
})(AuthenticationWrapper);
