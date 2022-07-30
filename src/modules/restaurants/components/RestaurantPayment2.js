import React, { StrictMode, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../config/api-config";
import Loader from "../../../components/loader/Loader";
import Button from "../../../components/buttons";
import { onboardingBack } from "../../../assets/images";
import '../styles/restaurantCheckout.scss';
import AppHeader from "../../../components/appHeader";
import Payment from '../assets/images/PaymentCart.svg';
import PaymentCardFront from './PaymentCardFront.js'
import '../styles/RestaurantPayment.scss'
import { useSelector, useDispatch } from 'react-redux'
import { setCartDetails } from "../redux/actions";
// import {setCartDetails} from '../redux/actions'


export const RestaurantPayment2 = (props) => {
    const history = useHistory();
    const { restaurant, dishQuantity } = history.location.state;
    const [checkoutResponse, setCheckoutResponse] = useState({});
    const [loading, setLoading] = useState(false);
    const [month, setMonth] = useState(null)
    const dispatch = useDispatch()
    const [card, setCard] = useState(useSelector(state => state.restaurants.cardDetails))
    const [year, setYear] = useState(null)
    const [cardM, setCardM] = useState(null)
    const [cardY, setCardY] = useState(null)
    const [isMonthValid, setIsMonthValid] = useState(false);
    const [isYearValid, setIsYearValid] = useState(false);
    // const pop = useSelector(state => console.log("State " , state))
    const cardRegex = new RegExp(`(^(?!.*\.).+$)|(^[0-9]*$)`);

    const OnBoardingHeaderForNumber = () => {
        const history = useHistory();
        return (
            <div className="Card-div">
                <img src={onboardingBack} className="" onClick={() => {
                    history.goBack()
                }} />
                <h1>Add a Card</h1>
            </div>
        )
    }

    function updateNextButtonStatus(e, field) {
        if (field === 'month') {
            if (e.target.value.length === 2
                && e.target.value >= 1
                && e.target.value <= 12) {
                setIsMonthValid(true);
            }
            else {
                setIsMonthValid(false);
            }
        }

        if (field === 'year') {
            if (e.target.value.length === 2
                && e.target.value >= 22
            ) {
                setIsYearValid(true);
            } else {
                setIsYearValid(false);
            }
        }
    }

    const CardMonthHandler = (e) => {

        if (!(cardRegex.test(e.target.value))) {
            e.target.value = card?.expMonth ? card.expMonth : '';
        }

        if (e.target.value.length <= 2) {
            let str = month
            let str2 = 'M'
            str = e.target.value.toString() + str2.repeat(2 - e.target.value.length)
            setCard({ ...card, expMonth: e.target.value })
            setMonth(str)
        }
    }
    const CardYearHandler = (e) => {
        if (!(cardRegex.test(e.target.value))) {
            e.target.value = card?.expYear ? card.expYear : '';
        }

        if (e.target.value.length <= 2) {
            let str = year
            let str2 = 'Y'
            str = e.target.value.toString() + str2.repeat(2 - e.target.value.length)
            setCard({ ...card, expYear: e.target.value })
            setYear(str)
        }
    }
    return (
        // <div className="p-1">
        <>
            {loading && <Loader loading={loading} />}
            {!loading &&
                <>
                    <AppHeader isBack={true} title='Add a Card' />
                    <div className="checkout__container" style={{ height: 'calc(100vh - 78px )' }}>
                        <div style={{ width: '80vw', margin: 'auto' }}>
                            <p style={{ fontSize: '20px', fontWeight: '700', lineHeight: '26px', lett: '0em', letterSpacing: 'left' }}>Card</p>
                        </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <div className="wrapper-element" style={{ textAlign: 'center' }}>
                                <div>
                                    <PaymentCardFront number={card.cardNumber} month={card.expMonth || 'MM'} year={card.expYear || 'YY'} />
                                    <p className="Add-card">What is your expiry date?</p>
                                </div>
                            </div>
                        </div>
                        <div className="Card-Input">
                            <div className="Month-year">
                                <input style={{ width: '40vw' }} placeholder={'MM'} onChange={(e) => { CardMonthHandler(e); updateNextButtonStatus(e, 'month'); }} value={card.expMonth}></input>
                                <p>|</p>
                                <input style={{ width: '40vw' }} placeholder={'YY'} onChange={(e) => { CardYearHandler(e); updateNextButtonStatus(e, 'year'); }} value={card.expYear}></input>
                            </div>
                        </div>
                        {
                            < Button variant="primary" style={isMonthValid && isYearValid ? { width: '80vw', margin: 'auto' } : { width: '80vw', margin: 'auto', backgroundColor: '#E5E5E1', color: '#8A8A87', opacity: '.5' }} disabled={!isMonthValid && !isYearValid} caption={"Next"} onClick={() => {
                                if (card.expYear === new Date().getFullYear().toString().substr(2, 2)) {
                                    if (card.expMonth <= new Date().getMonth() + 1) {
                                        alert("Card has expired")
                                    }
                                } else {
                                    history.push(`/restaurant/${props.match.params.id}/pay-3`, { restaurant, dishQuantity })
                                    dispatch(setCartDetails({ cardDetails: card }))
                                }
                            }} />
                        }
                    </div>
                </>
            }
        </>
        /* {loading && <Loader loading={loading}/>}
        {!loading && <>
            <OnBoardingHeaderForNumber />
            <h1 className="Card-heading">Card</h1>
            <div className="Card-design">
                <PaymentCardFront number={card.cardNumber} month={month || 'MM'} year={year || 'YY'} />
                <p1 style={{width : '50vw'}} className="Add-card">What is your expiry date?</p1>
            </div>
            <div className="Card-Input">
                <div className="Month-year">
                    <input type={'number'} style={{width  : '80vw'}}  placeholder={'MM'} onChange={CardMonthHandler} value={card.expMonth}></input>
                    <p>|</p>
                    <input type={'number'} style={{width  : '80vw'}} placeholder={'YY'} onChange={CardYearHandler} value={card.expYear}></input>
                </div>
                <Button variant="primary" style={(card.expMonth?.length === 2 && card.expYear?.length === 2)?{width:'80vw',margin :'auto'}:{backgroundColor: '#E5E5E1', color: '#8A8A87',opacity: '.5'}} caption="Next" onClick={()=>{
                    history.push(`/restaurant/${props.match.params.id}/pay-3`, {restaurant, dishQuantity})
                    // setCard({...card, expMonth :month , expYear:year })
                    // console.log("CARD : ",card)
                    dispatch(setCartDetails({cardDetails : card}))
                }}/>
            </div>
        </>} */
    )
}
