import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../config/api-config";
import Loader from "../../../components/loader/Loader";
import Button from "../../../components/buttons";
import AppHeader from "../../../components/appHeader";
import LocationCard from "../../../components/LocationCard";
import Input from "../../../components/formInput/Input"

import '../styles/restaurantCheckout.scss'
import { PromoCode } from "../../../assets/icons";
import { useDispatch, useSelector } from "react-redux";
import { setIsLocationEdit } from '../../location/redux/actions'
import { Popup } from "../../../components/Popup";
import { setCartItems } from "../redux/actions";
import { Title } from "../../../components/Fonts";


const OrderItems = ({ checkoutResponse, dishQuantity, onInCrement, textLoading }) => {
    return (
        <>
            {
                checkoutResponse?.orderCart?.lineItems?.elements.map(
                    (item, index) => (
                        <div className="d-flex justify-content-between mb-2 mt-2">
                            <div className="d-flex flex-column">
                                <span className="item-name">{item?.name}</span>
                                <span className="item-amount">$ {item?.price / 100}</span>
                            </div>

                            <div>
                                <div className="item-counter" style={{ position: 'relative' }}>
                                    <span
                                        onClick={() => onInCrement(Object.keys(dishQuantity)[index], 'decrement')}>-</span>
                                    <span>{item?.unitQty / 1000}</span>
                                    <span
                                        onClick={() => onInCrement(Object.keys(dishQuantity)[index], 'increment')}>+</span>
                                </div>
                            </div>

                        </div>
                    )
                )
            }
        </>
    )
}

export const RestaurantCheckout = (props) => {
    const history = useHistory();
    const isLocationEdit = useSelector(state => console.log(state))
    const { restaurant, dishQuantity } = useSelector(state => state.restaurants)
    const dispatch = useDispatch()
    const [checkoutResponse, setCheckoutResponse] = useState({});
    const [editQuantity, setEditQuantity] = useState({});

    const [loading, setLoading] = useState(true);
    const [textLoading, setTextLoading] = useState(false);
    const [isPopup, setIsPopup] = useState(false);
    const [isPopupName, setIsPopupName] = useState('');
    const [isError, setIsError] = useState(false)
    const [saveCookingInstruction, setSaveCookingInstruction] = useState('');
    const [cookingInstruction, setCookingInstruction] = useState('');
    const [show, setShow] = useState(false);


    useEffect(() => {
        let filteredDishQuantity = dishQuantity;
        for (var i = 0; i < Object.values(filteredDishQuantity).length; i++) {
            if (Object.values(filteredDishQuantity)[i] === 0) {
                delete filteredDishQuantity[Object.keys(filteredDishQuantity)[i]];
            }
        }
        setEditQuantity(filteredDishQuantity);
    }, [])

    useEffect(() => {
        if (Object.keys(editQuantity).length > 0) {
            (async function () {
                setTextLoading(true)
                console.log("workinig")
                const items = await itemsObjectHandel(editQuantity);
                const checkoutResp = await axios.post(`${baseUrl}/restaurant/${props.match.params.id}/checkout`, {
                    items: items,
                    posConfig: restaurant?.posConfig,
                    cookingInstruction: saveCookingInstruction
                }).catch(() => {
                    setTextLoading(false)
                    alert("Restaurant POS is not configured");
                    history.goBack();
                });
                setCheckoutResponse(checkoutResp.data.result.result);
                setLoading(false)
                setTextLoading(false)
                dispatch(setCartItems({ dishQuantity: editQuantity }))
            })()
        }
    }, [editQuantity]);


    const itemsObjectHandel = async (dishQuantity) => {
        const items = await restaurant?.restaurant_menu.filter(menu => Object.keys(dishQuantity).includes(menu._id)).map(menu => ({
            ...menu,
            quantity: dishQuantity[menu._id]
        }));
        return items
    }


    const quantityUpdate = async (id, name) => {
        if (name === 'increment') {
            setEditQuantity({ ...editQuantity, [id]: editQuantity[id] + 1 })
        }
        if (name === 'decrement') {
            if (editQuantity[id] <= 1) return null
            setEditQuantity({ ...editQuantity, [id]: editQuantity[id] - 1 })
        }
    }

    const onHandleEditLocation = () => {
        dispatch(setIsLocationEdit({
            isLocationEdit: true,
            prvPath: history.location.pathname,
            restaurant,
            dishQuantity
        }))
        history.push('/change-location')
    }

    const SubmitCookingInstruction = async () => {
        if(!cookingInstruction) return setIsError(true)
        setSaveCookingInstruction(cookingInstruction)
        setIsPopup(false)
    }

    return (
        <>
            <Popup show={isPopup} onHide height={isPopupName == 'cookingInstructions' && '35vh' }>
                <div className="popup-wrapper">

                    <div onClick={() => {
                        setIsPopup(false)
                        setIsError(false)
                        setIsPopupName('')
                    }} className="tab-popup-btn"></div>

                    {isPopupName === 'promoCode' && <div>
                        <h4>Promos & Discounts</h4>
                        <span className="sub-title">Cactus Jack Burger and few more words</span>
                        <span className="promo-card-text">PROMO CODES</span>
                        <div className="code__wrapper">

                            <div className="code">
                                <h6>TASTY60</h6>
                                <p>Cactus Jack Burger and few more words Lorem ipsum dolor sit amet, consectetur
                                    dol.</p>
                            </div>
                        </div>
                    </div>}

                    {isPopupName === 'cookingInstructions' && <div>
                    <h4>Cooking Instructions</h4>
                    <div className="mt-3" >
                    <Input
                        value={cookingInstruction}
                        onChange={(e) => {
                            if(!cookingInstruction) {
                                setIsError(false)
                            }
                            setCookingInstruction(e.target.value)
                        }} 
                        name='cookingInstruction'
                        height={'48px'}
                        placeholder='eg : add cooking instructions'
                        isError={isError}
                        errorMessage='Please fill the field!' 
                        />
                        </div>
                    </div>
                    }

                    <div className="apply-code">
                        <Button variant="primary" onClick={SubmitCookingInstruction} caption={isPopupName == 'cookingInstructions' ? 'Submit Instructions'  : 'Apply TASTY60'} />
                    </div>

                </div>
            </Popup>
            {loading && <Loader loading={loading} />}
            {!loading &&
                <>
                    <AppHeader isBack={true} title='Cart' path={`/restaurant-view/${props.match.params.id}/popular`} />
                    <div className="cart-checkout-container" style={{ height: 'calc(100vh - 78px )' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <div className="wrapper-element">
                                <div style={{ height: '100%' }}>
                                    <span className="title-text-order">Your Order</span>
                                    <OrderItems textLoading={textLoading} onInCrement={quantityUpdate}
                                        dishQuantity={dishQuantity} checkoutResponse={checkoutResponse} />
                                </div>
                                <div>
                                    <div className="promo_code">
                                        <span className="pro-text d-flex flex-column">
                                            <div>
                                                <PromoCode />
                                                <span style={{ marginLeft: '10px', lineHeight: 0 }}>Promo Code</span>
                                            </div>
                                            <span><u>Remove</u></span>
                                        </span>
                                        <span onClick={() => {
                                            setIsPopup(true)
                                            setIsPopupName('promoCode')
                                        }} className="enter-code">
                                            Enter Code
                                        </span>
                                    </div>
                                    {/* <hr />
                                    <div className="d-flex justify-content-between">
                                        <b>Sub Total</b>
                                        <span>$ {checkoutResponse.subtotal / 100}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <b>Total Tax Amount</b>
                                        <span>$ {checkoutResponse.totalTaxAmount / 100}</span>
                                    </div> */}
                                    <div className="d-flex justify-content-between total-amount__wrapper">
                                        <span className="check-out-text">Total</span>
                                        <span className="check-out-text"
                                            style={{ fontWeight: 'bold' }}>$ {checkoutResponse.total / 100}</span>
                                    </div>
                                    {!show &&
                                        <div onClick={() => {
                                            setShow(!show)
                                        }} style={{ fontSize: '.75rem', paddingBottom: '24px', textDecoration: 'underline' }}>
                                            <Title level={'subHeading'}>Add Cooking Instructions</Title>
                                        </div>
                                    }
                                    {show && 
                                        <>
                                            <div style={{width: '100%'}} className='mt-4px'>
                                                <Title level={'subHeading'}><textarea className="checkout-instructions" placeholder="Enter Cooking Instructions..." rows={4} cols={43} onChange={(e) => setCookingInstruction(e.target.value)} /></Title>
                                            </div>
                                            <div className="remove-instructions mt-12px mb-24px" onClick={() => setShow(false)}>
                                                <Title level={'subHeading'}>Remove Cooking Instructions</Title>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                        {
                            textLoading ? <Loader loading={textLoading} isComponent /> :
                                < Button variant="primary" caption="Schedule pick-up" onClick={() => {
                                    history.push({pathname: `/restaurant/${props.match.params.id}/pickup-details`, state: { checkoutResponse: checkoutResponse } })
                                }} />
                        }
                    </div>
                </>
            }
        </>
    )
}