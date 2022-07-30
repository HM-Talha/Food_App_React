import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import axios from "axios";
import {baseUrl} from "../../../config/api-config";
import Loader from "../../../components/loader/Loader";
import {onboardingBack} from "../../../assets/images";
import Button from "../../../components/buttons";
import AppHeader from "../../../components/appHeader";
import {useSelector,useDispatch} from "react-redux";
import PaymentCardFront from './PaymentCardFront'
import {setCartDetails} from '../redux/actions'
import '../styles/restaurantCheckout.scss'

export const RestaurantPayment = (props) => {
    const history = useHistory();
    const {restaurant, dishQuantity} = useSelector(state => state.restaurants)
    const [checkoutResponse, setCheckoutResponse] = useState({});
    const [loading, setLoading] = useState(false);
    const [number,setNumber]=useState('XXXXXXXXXXXXXXXX')
    const [card,setCard] = useState(null)
    const dispatch = useDispatch()
    
    const OnBoardingHeaderForNumber = () => {
        const history = useHistory();
        return (
            <div className="Card-div">
                <img src={onboardingBack} className="" onClick={() => {
                    history.goBack()
                }}/>
                <h1>Add a Card</h1>
            </div>
        )
    }
    const CardInputHandler = (e)=>{
        const cardRegex = new RegExp(`(^(?!.*\.).+$)|(^[0-9]*$)`)

        if (!(cardRegex.test(e.target.value))) {
            e.target.value = card ? card : '';
        }

        if(e.target.value.length <= 16){
            let str = number
            let str2 = 'X'
            str = e.target.value.toString() + str2.repeat(16-e.target.value.length)
            setCard(e.target.value)
            setNumber(str)
        }
    }
    return (
        // <div className="p-1">
        //     {loading && <Loader loading={loading}/>}
        //     {!loading && <>
        //         <OnBoardingHeaderForNumber />
        //         <h1 className="Card-heading">Card</h1>
        //         <div className="Card-design">
        //             <PaymentCardFront number={number} month={'MM'} year={'YY'}/>
        //             <p className="Add-card">Add your card for easy payment</p>
        //         </div>
        //         <div className="Card-Input">
        //             <input type={'number'} placeholder={'Card Number'} onChange={CardInputHandler}  value={card}></input>
        //             <Button variant="primary" style={(card?.length === 16 )?{width:'80vw',margin :'auto'}:{backgroundColor: '#E5E5E1', color: '#8A8A87',opacity: '.5'}} disabled={(card?.length === 16 )?false:true} caption="Next" onClick={()=>{
        //                 history.push(`/restaurant/${props.match.params.id}/pay-2`, {restaurant, dishQuantity})
        //                 dispatch(setCartDetails({cardDetails :  {
        //                     "cardNumber": card,
        //                     "cvv": "",
        //                     "expMonth": "",
        //                     "expYear": ""
        //                 }}))
        //             }}/>
        //         </div>
        //     </>}

        // </div>
        <>
        {loading && <Loader loading={loading}/>}
            {!loading &&
            <>
                <AppHeader isBack={true} title='Add a Card'/>
                <div className="checkout__container" style={{height: 'calc(100vh - 78px )'}}>
                    <div style={{width : '80vw' , margin : 'auto'}}>
                        <p style={{fontSize: '20px',fontWeight: '700',lineHeight: '26px',lett: '0em',letterSpacing: 'left'}}>Card</p>
                    </div>
                    <div style={{flex: 1, position: 'relative'}}>
                        <div className="wrapper-element" style={{textAlign : 'center'}}>
                            <div>
                                <PaymentCardFront number={number} month={'MM'} year={'YY'}/>
                                <p className="Add-card">Add your card for easy payment</p>
                            </div>
                        </div>
                    </div>
                    <div className="Card-Input">
                        <input placeholder={'Card Number'} onChange={CardInputHandler}  value={card}></input>
                    </div>
                    {
                            < Button variant="primary" style={(card?.length === 16 )?{width:'80vw',margin :'auto'}:{width:'80vw',margin :'auto',backgroundColor: '#E5E5E1', color: '#8A8A87',opacity: '.5'}} disabled={(card?.length === 16 )?false:true} caption={"Next"} onClick={() => {
                                history.push(`/restaurant/${props.match.params.id}/pay-2`, {restaurant, dishQuantity})
                                dispatch(setCartDetails({cardDetails :  {
                                    "cardNumber": card,
                                    "cvv": "",
                                    "expMonth": "",
                                    "expYear": ""
                                }}))
                            }}/>
                    }
                </div>
            </>
            }
        </>
    )
}
