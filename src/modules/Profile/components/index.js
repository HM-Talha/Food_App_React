import React, { useEffect, useState } from 'react';
import "../style/profile.scss"
import { AnalyticsIcon, BackIcon, BookMarkIcon, LogoutIcon,  RightArrowIcon } from "../../../assets/icons";
import { useHistory } from "react-router-dom";
import withFirebaseAuth from "react-with-firebase-auth";
import firebaseApp from "../../../config/firebase";
import firebase from "firebase";
import axios from "axios";
import { baseUrl } from "../../../config/api-config";
import {useDispatch, useSelector} from 'react-redux';
import { setActivePath } from '../../layout/redux/actions';
import { setMenu } from '../../../onState/actions'
import { AddressIcon, OrderIcon, RightArrowInCircle, SettingIcon, PreferencesIcon, PaymentsIcon, LibraryIcon } from '../../../assets/IconComponents';
import { Footnote, Title, Text } from '../../../components/Fonts';

const firebaseAppAuth = firebaseApp.auth();
const providers = {
    googleProvider: new firebase.auth.GoogleAuthProvider(),
    facebookProvider: new firebase.auth.FacebookAuthProvider()
};
const Profile = (props) => {
    const dispatch = useDispatch()
    const history = useHistory();
    const {userDetails} = useSelector(state => state.home)
    const { signOut, signInWithGoogle } = props;

    function goBack() {
        history.push("/home")
        dispatch(setActivePath('/home'))
    }

    const goToLibrary = () => {
        history.push("/library")
    }

    return (
        <div className="profile">
            {/* <div className="profile__hero">
                <div className="profile__hero--back" onClick={goBack}>
                    <BackIcon/>
                </div>
                <div className="profile__hero--footer">
                    <h4 className="text-capitalize">Hey {user.firstName} {user.lastName}!</h4>
                    <p>@{user.userName}</p>
                </div>
            </div> */}
            <div className="profile__nav">
                <div className='user__profile__nav'>
                    <div>
                        <Title level={2}>{userDetails.firstName || userDetails.email && userDetails.email.split('@')[0].split('.')[0]} {userDetails.lastName || userDetails.email && userDetails.email.split('@')[0].split('.')[1]}</Title>
                        <Footnote><div className='mt-8px'>@{userDetails.userName || userDetails.email}</div></Footnote>
                    </div>
                    {/* <span className='edit-user-profile'>
                        Edit profile
                        <span className='ml-8'>
                            <RightArrowInCircle />
                        </span>
                    </span> */}
                </div>
                <div style={{marginTop: 12}} className="profile__nav--item" onClick={()=>{dispatch(setMenu(false))  ; history.push('/change-location')}}>
                    <div style={{marginRight: '20px'}}><AddressIcon /></div>
                    <Text>Addresses</Text>
                </div>
                <div className="profile__nav--item" onClick={()=>{ dispatch(setMenu(false)); history.push('/orders')}}>
                    <div style={{marginRight: '18.2px'}}><OrderIcon /></div>
                    <Text>Orders</Text>
                </div>
                <div className="profile__nav--item">
                    <div style={{marginRight: '14.33px'}}><PaymentsIcon /></div>
                    <Text>Payments</Text>
                </div>
                <div className="profile__nav--item">
                    <div style={{marginRight: '11px'}}><LibraryIcon /></div>
                    <Text>Library</Text>
                </div>
                <div className="profile__nav--item" onClick={()=>{dispatch(setMenu(false))  ; history.push('/preference')}}>
                    <div style={{marginLeft: '2px', marginRight: '17.56px'}}><PreferencesIcon /></div>
                    <Text>Preferences</Text>
                </div>
                <div className="profile__nav--item" onClick={()=>{ dispatch(setMenu(false)); history.push('/settings')}}>
                    <div style={{marginRight: '11px'}}><SettingIcon /></div>
                    <Text>Settings</Text>
                </div>
                <div className="profile__nav--item" onClick={async () => {
                    let res1 = await axios.delete(`${baseUrl}/user/user-delete`);
                    signOut()
                    localStorage.clear();
                    dispatch(setMenu(false))
                    history.push("/auth")
                }}>
                    <span style={{color: "#292929"}}>Clear my data</span>
                </div>
                {/* <div className="profile__nav--item" onClick={goToLibrary}>
                    <BookMarkIcon/>
                    Library
                </div>
                <div className="profile__nav--item">
                    <PaymentIcon/>
                    Payments
                </div>
                <div className="profile__nav--item">
                    <SettingsIcon/>
                    Settings
                </div>
                <div className="profile__nav--item" onClick={async () => {
                    let res1 = await axios.delete(`${baseUrl}/user/user-delete`);
                    signOut()
                    localStorage.clear();
                    history.push("/auth")
                }}>
                    <span style={{color: "red"}}>Clear my data</span>
                </div> */}
            </div>
            {/* <div className="profile__nav--item profile__logout" onClick={() => {
                signOut()
                localStorage.clear();
                history.push("/auth")
            }}>
                <LogoutIcon/>
                Log Out
            </div> */}
        </div>
    );
};

export default withFirebaseAuth({
    providers,
    firebaseAppAuth,
})(Profile);
