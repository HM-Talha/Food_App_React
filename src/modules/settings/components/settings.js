import { useState } from 'react';
import { useHistory } from 'react-router-dom'
import '../Styles/settings.scss';
import BackArrowFrame from "../../../assets/icons/backArrowFrame.svg";
import FrontArrowFrame from "../../../assets/icons/frontArrowFrame.svg";
import LogoutFrame from "../../../assets/icons/logoutFrame.svg";
import withFirebaseAuth from "react-with-firebase-auth";
import firebaseApp from "../../../config/firebase";

function Settings(props) {
    const history = useHistory();

    return (
        <div className="mainSettingsContainer">
            <div className="settingsHeader">
                <img className="iconContainer" src={BackArrowFrame} onClick={() => history.push("/home")} />
                <p className="level-2">Settings</p>
            </div>
            <p className="settingsHeading body-text">Privacy and Legal</p>
            <div className="pageLinkContainer" onClick={() => history.push("/settings/privacy")}>
                <p className="sub-heading">Privacy Policy</p>
                <img className="frontArrowContainer" src={FrontArrowFrame} />
            </div>
            <div className="pageLinkContainer" onClick={() => history.push("/settings/terms")}>
                <p className="sub-heading">Terms of Service</p>
                <img className="frontArrowContainer" src={FrontArrowFrame} />
            </div>
            <p className="settingsHeading body-text">Account</p>
            <div className="largePageLinkContainer" onClick={() => history.push("/settings/account-details") }>
                <div className="d-flex flex-column">
                    <p className="sub-heading">Edit Account Details</p>
                    <p className="sub-heading">Phone number, basic profile details</p>
                </div>
                <img className="frontArrowContainer" src={FrontArrowFrame} />
            </div>
            <div className="pageLinkContainer"  onClick={() => {props.signOut()
                localStorage.clear();
                history.push("/auth")} }>
                <div className="d-flex flex-row align-items-center">
                    <img className="iconContainer" src={LogoutFrame} />
                    <p className="sub-heading logoutText">Logout</p>
                </div>
            </div>
        </div>
    )
}
const firebaseAppAuth = firebaseApp.auth();
export default withFirebaseAuth({
    firebaseAppAuth,
})(Settings);