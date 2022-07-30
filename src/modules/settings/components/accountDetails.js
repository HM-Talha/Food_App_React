import { useState, useRef, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import "../Styles/accountDetails.scss";
import axios from "axios";
import { baseUrl } from "../../../config/api-config";
import { AdvancedPopup } from "../../../components/AdvancedPopup";
import BackArrowFrame from "../../../assets/icons/backArrowFrame.svg";
import Button from "../../../components/buttons";
import Loader from "../../../components/loader/Loader";
import { Splide, SplideSlide } from '@splidejs/react-splide';

function AccountDetails() {
    const [disableButton, setDisableButton] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [userDetails, setUserDetails] = useState('');
    const [loader, setLoader] = useState(true);
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('')
    const [number, setNumber] = useState('');
    const [OTP, setOTP] = useState('');
    const [OTPerror, setOTPError] = useState('');
    const [spliderAge, setSpliderAge] = useState('');

    const splideRef = useRef();
    const history = useHistory();
    const ageItems = Array.from({ length: 99 }, (_, i) => i + 1)

    useEffect(() => {
        if (splideRef.current) {
            splideRef.current.splide.go(spliderAge);
        }
    }, [spliderAge])

    useEffect(() => {
        getUserDetails();
    }, []);

    async function getUserDetails() {
        const res = await axios.get(`${baseUrl}/user/get/one`);
        setUserDetails(res.data.data);
        setAge(res.data?.data?.age);
        setName(`${res.data?.data?.firstName} ${res.data?.data?.lastName !== null ? res.data?.data?.lastName : ''}`);
        setUserName(res.data?.data?.userName);
        setGender(res.data?.data?.gender);
        setNumber(res.data?.data?.mobileNo);
        setLoader(false);
    }

    const verifyOTP = async () => {
        const data = await axios.post(`${baseUrl}/user/verify/otp`, { value: OTP })
        if (data.data.code === 500) {
            setOTPError(data.data.message);
        }
        else if (data.data.code === 200) {
            setOTPError(data.data.message);
            setOTP('');
        }
    }

    async function updateUserDetails() {
        var bodyFormData = new FormData();
        bodyFormData.append("age", age);
        bodyFormData.append("gender", gender);
        bodyFormData.append("userName", userName);
        bodyFormData.append("name", name);
        const res = await axios.put(`${baseUrl}/user/update/users`,
            bodyFormData);
    }

    function saveChangesHandler() {
        updateUserDetails();

        if (userDetails.mobileNo !== number) {
            axios.post(`${baseUrl}/user/send/otp`, { number: number });
            setShowPopup(true);
        };
    }

    return (
        <>
            <AdvancedPopup
                show={showPopup}
                onHide={() => { setShowPopup(false); }}
                height={"95vh"}
                title={"Verify your mobile number"}
                subTitle={`Enter the OTP sent to ${number}`}
                showTopBar={true}
                customContainerClass="accountDetailsPopupContainer"
                customTitleContainerStyles="accountDetailsTitleContainer"
                customTitleStyles="level-2 accountDetailsPopupTitle"
                subTitleStyles="sub-heading accountDetailsPopupSubtitle"
                customChildrenStyles="accountDetailsBodyStyles">
                <div className="accountOTPInputContainer">
                    <input type="number" className="level-1 accountOTPInput" value={OTP} onChange={e => setOTP(e.target.value)} />
                    <p className="foot-note accountOTPWarning">{OTPerror}</p>
                </div>
                <div className="d-flex flex-row justify-content-between otpResendContainer">
                    <p className="sub-heading">Did not recieve OTP?</p>
                    <p className="sub-heading" onClick={() => { axios.post(`${baseUrl}/user/send/otp`, { number: number }); setOTPError('') }}>Resend OTP</p>
                </div>
                <div className="mt-auto buttonContainer" >
                    <Button
                        variant="primary"
                        caption="Verify"
                        onClick={() => { verifyOTP(); }} />
                </div>
            </AdvancedPopup>
            {
                loader ? <Loader loading={loader} isComponent /> :
                    <div className="mainAccountDetailsContainer">
                        <div className="settingsHeader">
                            <img className="iconContainer" src={BackArrowFrame} onClick={() => history.push("/settings")} />
                            <p className="level-2">Edit Account Details</p>
                        </div>
                        <input className="accountInputField sub-heading" value={name} onChange={e => setName(e.target.value)} />
                        <input className="accountInputField sub-heading" value={userName} onChange={e => setUserName(e.target.value)} />
                        <p className="genderDetailHeading body-text">Gender</p>
                        <div className="genderSelectorContainer">
                            <div className={gender === 'male' ? "selectedGender" : "unselectedGender"}><p className="sub-heading" onClick={() => setGender('male')}>Male</p></div>
                            <div className={gender === 'female' ? "selectedGender" : "unselectedGender"}><p className="sub-heading" onClick={() => setGender('female')}>Female</p></div>
                            <div className={gender === 'other' ? "selectedGender" : "unselectedGender"}><p className="sub-heading" onClick={() => setGender('other')}>Other</p></div>
                        </div>
                        <p className="ageDetailHeading body-text">Age</p>
                        <Splide ref={splideRef} options={{
                            type: 'slide',
                            perPage: 7,
                            height: "120px",
                            width: "100%",
                            gap: "60px",
                            pagination: false,
                            arrows: false,
                            perMove: 1,
                            focus: 'center',
                            updateOnMove: true,
                            flickPower: 100,
                            trimSpace: false,
                            dragMinThreshold: 1,
                            start: age - 1,
                            keyboard: "global"
                        }}
                            onMoved={(ele, newIndex, prevIndex, destIndex) => {
                                setAge(ageItems[newIndex]);
                                setSpliderAge(newIndex);
                            }}>
                            {
                                ageItems.map((ageValue, index) => (
                                    <SplideSlide key={index}>
                                        <div className="ageBlock" onClick={() => { setSpliderAge(index) }}><p className="xl-large-text ">{ageValue}</p></div>
                                    </SplideSlide>
                                ))
                            }
                        </Splide>
                        <p className="contactDetailHeading body-text">Contact Details</p>
                        <input className="accountInputField sub-heading" value={number} onChange={e => setNumber(e.target.value)} />
                        <button className="saveChangesButton head-line mt-auto" disabled={disableButton} onClick={() => { saveChangesHandler() }}>Save changes</button>
                    </div>
            }
        </>
    )
}

export { AccountDetails };