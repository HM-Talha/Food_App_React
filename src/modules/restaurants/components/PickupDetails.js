import { useEffect, useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import '../styles/PickupDetails.scss';
import { AdvancedPopup } from "../../../components/AdvancedPopup";
import AlarmIcon from '../../../assets/icons/alarmIcon.svg';
import axios from 'axios';
import { baseUrl } from "../../../config/api-config";
import Button from "../../../components/buttons";
import { PageBackIcon } from '../../../assets/IconComponents';
import DeliveryMap from '../../../assets/images/deliveryMap.png';
import DirectionIcon from "../../../assets/icons/direction-icon.svg";
import Loader from '../../../components/loader/Loader';
import PhoneCallImg from "../../../assets/images/phone-call.svg";
import { useSelector } from "react-redux";

const PickupDetails = (props) => {
    const [restaurant, setRestaurant] = useState('');
    const [order, setOrder] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [loader, setLoader] = useState(true);
    const [showPolicy, setShowPolicy] = useState(false);

    const location = useLocation();
    const history = useHistory();

    const checkoutResponse = useState(location.state.checkoutResponse ? location.state.checkoutResponse : '');

    function getRestaurantAddress() {
        return restaurant?.contact_details?.map(c => [c.addressLine1, c.addressLine2, c.city, c.state].filter(a => a !== "").join(", ")).flat().join(", ");
    }

    useEffect(() => {
        fetchRestaurant();
    }, [])

    async function fetchRestaurant() {
        const restaurant = await axios.get(`${baseUrl}/restaurant/get-restaurant-id?id=${props.match.params.id}`);
        setRestaurant(restaurant?.data?.data);
        setLoader(false);
    }

    return (
        <>
            <AdvancedPopup
                show={showPopup}
                onHide={() => { setShowPopup(false); }}
                height={"275px"}
                title={"This is a pickup order"}
                subTitle={"You will be picking up this order from restaurant"}
                showTopBar={true}
                customContainerClass="pickupPopupContainer"
                customTitleContainerStyles="pickupPopupTitleContainer"
                customTitleStyles="pickupPopupTitle level-2"
                subTitleStyles="pickupPopupSubTitle sub-heading"
                customChildrenStyles="popupBodyStyles">
                <div className="greyDivider" />
                <div className="buttons-container">
                    <Button
                        variant="primary"
                        caption="Okay"
                        onClick={() => { history.push(`/restaurant/${props.match.params.id}/pay-1`) }} />
                    <Button
                        variant="secondary"
                        caption="Edit order"
                        onClick={() => { setShowPopup(false) }} />
                </div>
            </AdvancedPopup>
            {
                loader
                    ? <Loader loading={loader} isComponent />
                    : <div className="mainPickupContainer">
                        <div className="appHeader">
                            <svg onClick={() => { history.push(`/restaurant/${props.match.params.id}/checkout`) }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 18L9 12L15 6" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <p className="level-2 pickup-details-heading">Pickup details</p>
                        </div>
                        <img src={DeliveryMap} className="pickup-location-image w-100" />
                        <p className="mb-2 restaurantName level-2">{restaurant.restaurantName}</p>
                        <p className="cuisineType sub-heading">{restaurant.cuisine_details[0].name[0].name}</p>
                        <p className="restaurantLocation sub-heading">{getRestaurantAddress()}</p>
                        <div className="d-flex mt-4">
                            <div className="d-flex align-content-center">
                                <img className="mr-1" src={PhoneCallImg} />
                                <a className="text-black phoneLink sub-heading" href={"tel:" + restaurant?.contact_details?.[0].contactNo}>Call
                                    restaurant</a>
                            </div>
                            <div className="d-flex align-content-center">
                                <img src={DirectionIcon} className="mr-1 ml-3 directionIconContainer" />
                                <a className="text-black directionLink sub-heading"
                                    href={"http://maps.google.com/?q=" + restaurant.restaurantName + " " + getRestaurantAddress()}>Get
                                    directions</a>
                            </div>
                        </div>
                        <p className="mb-3 pickupHeading head-line">Pick-up time</p>
                        <div className="d-flex align-content-center">
                            <img src={AlarmIcon} />
                            <div className="ml-1 d-flex flex-column">
                                <p className="pickupTime sub-heading">12:30 - 1:00 PM</p>
                                <p className="pickupTimeDescription sub-heading">Scheduled pick up time</p>
                            </div>
                        </div>
                        <p className="orderHeading head-line">Order Details</p>
                        {
                            checkoutResponse[0]?.orderCart?.lineItems?.elements.map(
                                (item, index) => (
                                    <div className='orderItem sub-heading' key={index}>
                                        <div className='d-flex flex-row justify-content-between w-100'>
                                            <p>{item.name} x {item.unitQty / 1000}</p>
                                            <p>${parseFloat((item.price / 100 * (item.unitQty / 1000)).toFixed(2))}</p>
                                        </div>
                                        {
                                            /*
                                                <p className='orderAddition'>Addition #1</p>
                                                <p className='orderAddition'>Addition #2</p>
                                            */
                                            // The above commented out code is to be used for any order additions, such as extra cheese, extra mayo, etc.
                                            // At present (23 June, 2022) the end point does not return any order addition details. 
                                            // But when it does, all the styling work has been done to support it.
                                        }
                                    </div>
                                )
                            )
                        }
                        <div className={!showPolicy ? "cancellation-policy-container" : "cancellation-policy-container-expanded"} onClick={() => setShowPolicy(!showPolicy)}>
                            <div className="cancellation-policy-content">
                                <p className="head-line">Cancellation policy</p>
                                {
                                    !showPolicy
                                        ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.00065 2.66992C8.36884 2.66992 8.66732 2.9684 8.66732 3.33659V12.6699C8.66732 13.0381 8.36884 13.3366 8.00065 13.3366C7.63246 13.3366 7.33398 13.0381 7.33398 12.6699V3.33659C7.33398 2.9684 7.63246 2.66992 8.00065 2.66992Z" fill="#292929" />
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.66699 8.00065C2.66699 7.63246 2.96547 7.33398 3.33366 7.33398H12.667C13.0352 7.33398 13.3337 7.63246 13.3337 8.00065C13.3337 8.36884 13.0352 8.66732 12.667 8.66732H3.33366C2.96547 8.66732 2.66699 8.36884 2.66699 8.00065Z" fill="#292929" />
                                        </svg>
                                        : <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.66699 8.00065C2.66699 7.63246 2.96547 7.33398 3.33366 7.33398H12.667C13.0352 7.33398 13.3337 7.63246 13.3337 8.00065C13.3337 8.36884 13.0352 8.66732 12.667 8.66732H3.33366C2.96547 8.66732 2.66699 8.36884 2.66699 8.00065Z" fill="#292929" />
                                        </svg>
                                }
                            </div>
                            <div className={!showPolicy ? "policies-container" : "policies-container-shown" }>
                            <div className="policyLine">
                                <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11.5" cy="11.5" r="3.5" fill="#DBEF06" />
                                </svg>

                                <p className='sub-heading'>If you choose to cancel, you can do it within 60 seconds after placing the order.</p>
                            </div>
                            <div className="policyLine">
                                <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11.5" cy="11.5" r="3.5" fill="#DBEF06" />
                                </svg>
                                <p className='sub-heading'>Post 60 seconds, you will be charged a 100% cancellation fee.</p>
                            </div>
                            <div className="policyLine">
                                <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11.5" cy="11.5" r="3.5" fill="#DBEF06" />
                                </svg>
                                <p className='sub-heading'>However, in the event of an unusual delay of your order, you will not be charged a cancellation fee.</p>
                            </div>
                            <div className="policyLine">
                                <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11.5" cy="11.5" r="3.5" fill="#DBEF06" />
                                </svg>
                                <p className='sub-heading'>This policy helps us avoid food wastage and compensate restaurants for their efforts.</p>
                            </div>
                            </div>
                        </div>
                        <div className="fixed-payment-container">
                            <div className="grey-payment-line" />
                            <Button variant="primary" caption={`Pay $${checkoutResponse[0]?.total / 100}`} onClick={() => { setShowPopup(true); }} />
                        </div>
                    </div>
            }
        </>
    )
}

export { PickupDetails };