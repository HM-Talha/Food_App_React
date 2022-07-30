import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import axios from "axios";
import {baseUrl} from "../../../config/api-config";
import Loader from "../../../components/loader/Loader";
import Button from "../../../components/buttons";
import {onboardingBack} from "../../../assets/images";
import '../styles/restaurantCheckout.scss';
import PaymentCardBack from './PaymentCardBack.js'
import '../styles/RestaurantPayment.scss'
import {useSelector,useDispatch} from 'react-redux'
import { setCartDetails } from "../redux/actions";
import AppHeader from "../../../components/appHeader";

export const RestaurantPayment3 = (props) => {
    const history = useHistory();
    const {restaurant, dishQuantity} = useSelector(state => state.restaurants )
    console.log("Restaurant Detail : ",restaurant)
    console.log("dishQuantity Detail : ",dishQuantity)
    const [checkoutResponse, setCheckoutResponse] = useState({});
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true);
    const [card,setCard] =  useState(useSelector(state => state.restaurants.cardDetails))
    const [cvv ,setCVV] = useState('XXX')
    
    const [cardCvv ,setcardCvv] = useState(null)
    async function checkoutOrder(type = "checkout") {
        setLoading(true)
        const items = restaurant?.restaurant_menu.filter(menu => Object.keys(dishQuantity).includes(menu._id)).map(menu => ({
            ...menu,
            quantity: dishQuantity[menu._id]
        }));
        const checkoutResp = await axios.post(`${baseUrl}/restaurant/${props.match.params.id}/${type}`, {
            items,
            posConfig: restaurant?.posConfig,
            details : [restaurant?.restaurantName , restaurant?._id , restaurant?.contact_details]
        });
        setCheckoutResponse(checkoutResp.data.result.result);
        console.log(restaurant?.posConfig,);
        setLoading(false);
        return checkoutResp;
    }
    useEffect(() => {
        (async function () {
            await checkoutOrder()
        })()
    }, []);
    async function onMakePayment() {
        const orderResp = await checkoutOrder("order");
        setLoading(true)
        console.log("Restaurent : ",restaurant)
        const payResp = await axios.post(`${baseUrl}/restaurant/${props.match.params.id}/pay`, {
            posConfig: restaurant?.posConfig,
            cardDetails: card,
            "orderId": orderResp.data.result.result.id
        });
        // const {id, ref_num, status} = payResp.data.result.result.paymentResponse;
        // history.push(`/restaurant/${props.match.params.id}/status/${id}/${ref_num}/${status}`)
        history.push({pathname: '/order-placed', state: { restaurant: restaurant }})
        // console.log({number,month,year,cardCvv})
    }

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
        const cardRegex = new RegExp(`(^(?!.*\.).+$)|(^[0-9]*$)`);

        if (!(cardRegex.test(e.target.value))) {
            e.target.value = card?.cvv ? card.cvv : '';
        }

        if(e.target.value.length <= 3){
            let str = cvv
            let str2 = 'X'
            str = e.target.value.toString() + str2.repeat(3-e.target.value.length)
            setCard({...card, cvv :e.target.value })
            setCVV(str)
        }
    }
    return (
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
                                    <PaymentCardBack cvv={cvv}/>
                                    <p className="Add-card">What is your CVV?</p>
                                </div>
                            </div>
                        </div>
                        <div className="Card-Input">
                            <input placeholder={'CVV'} onChange={CardInputHandler} value={card.cvv}></input>
                        </div>
                        {
                            < Button variant="primary" style={(card.expMonth?.length === 2 && card.expYear?.length === 2)?{width:'80vw',margin :'auto'}:{width:'80vw',margin :'auto',backgroundColor: '#E5E5E1', color: '#8A8A87',opacity: '.5'}} disabled={(card.expMonth?.length === 2 && card.expYear?.length === 2)?false:true} caption={"Next"} onClick={() => {
                                // history.push(`/restaurant/${props.match.params.id}/pay-3`, {restaurant, dishQuantity})
                                dispatch(setCartDetails({cardDetails : card}))
                                onMakePayment()
                            }}/>
                        }
                        </div>
                </>
            }
        </>
        // <div className="p-1">
        //     {loading && <Loader loading={loading}/>}
        //     {!loading && <>
        //         <OnBoardingHeaderForNumber />
        //         <h1 className="Card-heading">Card</h1>
        //         <div className="Card-design">
        //             <PaymentCardBack cvv={cvv}/>
        //             <p1 className="Add-card">What is your CVV?</p1>
        //         </div>
        //         <div className="Card-Input">
        //             <input type={'number'} placeholder={'CVV'} onChange={CardInputHandler} value={card.cvv}></input>
        //             <Button variant="primary" style={(card.cvv?.length === 3)?{width:'80vw',margin :'auto'}:{backgroundColor: '#E5E5E1', color: '#8A8A87',opacity: '.5'}} caption="Next" onClick={()=>{
        //                 // history.push(`/restaurant/${props.match.params.id}/pay`, {restaurant, dishQuantity})
        //                 dispatch(setCartDetails({cardDetails : card}))
        //                 onMakePayment()
        //             }}/>
        //         </div>
        //     </>}

        // </div>
    )
}
