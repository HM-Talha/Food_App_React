import React, { useState, useRef, useEffect, useCallback } from 'react';
import "../styles/foodItem.scss"
import QuantityPickerSlider from 'react-mobile-picker-scroll'
import { AddToCardIcon } from '../../../assets/IconComponents';
import { useDispatch, useSelector } from "react-redux";
import {setQtySlider} from '../redux/actions'
import _ from 'lodash'
import {getCompressedImgUrl, lockBodyScroll, unlockBodyScroll} from "../../../config/utils";
import { Title , Text, Footnote} from '../../../components/Fonts';
import CircularChart from '../../../components/Chart/CircularChart';

const FoodItem = ({ title, price, img, expand, setExpand, quantity, setQuantity, tags, item, selectedDish }) => {
    const dispatch = useDispatch()
    const startAnimation = (entries, observer) => {
        entries.forEach(entry => {
            setTimeout(() => {
                entry.target.classList.toggle("item-animation", entry.isIntersecting);
            }, 1000)
        });
    };
    const observer = new IntersectionObserver(startAnimation);
    const options = { root: null, rootMargin: '0px', threshold: 1 }; 
  
    const elements = document.querySelectorAll('.non-active');
    elements.forEach(el => {
        observer.observe(el, options);
    });
    return (
        <>
            {
                expand ? <FoodItemExpand
                    selectedDish={selectedDish}
                    item={item}
                    tags={tags}
                    img={img}
                    tagName=""
                    onClick={() => {
                    }}
                    name={_.capitalize(title)}
                    dishPrice={price}
                    setQuantity={setQuantity}
                    quantity={quantity} />
                    :
                    <div onTouchMove={() => {
                        dispatch(setQtySlider(false))
                        unlockBodyScroll()
                    }} className="food-item mt-4" style={{ marginBottom: 28 }} onClick={() => {
                        setExpand(true)
                        dispatch(setQtySlider(false))
                                            }}>
                        <div style={{ width: 64, height: 72 }} className="food-item__img">
                            <img src={getCompressedImgUrl(img)} />
                        </div>
                        <div style={{ flex: 1, width: '100%' }} className="food-item__info d-flex flex-column justify-content-between">
                            <div style={{ color: '#292929', maxWidth: '205px' }} className="text-capitalize item-text">
                                <Text>
                                {
                                    title.length > 26 ?
                                    <div className='non-active'>
                                        {title.toLowerCase()}
                                    </div>
                                    :
                                    title.toLowerCase()
                                }
                                </Text>
                            </div>
                            <Title level={'subHeading'}><div style={{color: '#8A8A87' }}>{price}</div></Title>
                        </div>
                        <div className='d-flex flex-1 align-items-end'>
                            {tags && <span className={Object?.keys(tags)[0] == 'attention' ? 'tag-attention' : 'top-pick-tag'}>
                                {Object?.keys(tags)[0] && Object?.keys(tags)[0]}
                            </span>
                            }
                        </div>
                    </div>
            }
        </>

    );
};

export default FoodItem;


const scrollToRef = (ref) => {
    window.scrollTo(0,  ref.current.offsetTop + screen.height / 2.3 + ref.current.clientHeight - 100)
}

const FoodItemExpand = ({ name, img, tagName, onClick, dishPrice, quantity, setQuantity, tags, item, selectedDish, closeSlider }) => {
    const myRef = useRef(selectedDish)
    const dispatch = useDispatch();
    useEffect(() => {
        if(selectedDish === item._id){
            const executeScroll = () => scrollToRef(myRef)
            executeScroll()
        }
    }, [selectedDish])

    return (
        <div ref={myRef} id={item._id} style={{ width: '100%', height: 'auto' }} className='position-relative' onClick={() => {dispatch(setQtySlider(false)); unlockBodyScroll();}}>
            <div style={{ right: 0, top: 146 }} className='position-absolute'>
                <QuantityPicker closeSlider={closeSlider} quantity={quantity} setQuantity={setQuantity} />
            </div>
            <div id='sliderTouchMove' className="restaurant-card mt-4" onClick={onClick}>
                <div className='card_food-item_wrapper position-relative'>
                    <div className='card_header_wrapper position-relative'>

                        <div style={{ width: 32, height: 32, position: 'absolute', top: 16, left: 16 }}>
                            <CircularChart value={44}/>
                        </div>
                        <img src={getCompressedImgUrl(img)} />
                    </div>
                    <div className='card_body_wrapper'>
                        <Title level={'headLine'}><div style={{width: '85%'}} className='mb-0 mb-1'>{name}</div></Title>
                        <Text><div className='m-0'>{dishPrice}</div></Text>
                        <Footnote><div className='description-food mb-0'>
                           {item?.description?.charAt(0).toUpperCase() + item?.description?.slice(1).toLowerCase()}
                        </div></Footnote>
                    </div>
                    {tags && <div className='card_footer_wrapper'>
                        <Footnote>
                            <div className='description-food-in-footer mb-0 mt-0'>
                                {Object?.keys(tags)[0] && tags?.[Object?.keys(tags)[0]]}
                            </div>
                        </Footnote>
                    </div>}
                </div>
            </div>
        </div>
    );
};

const QuantityPicker = ({ quantity, setQuantity }) => {
    const {isQtySlider} = useSelector(state => state.restaurants)
    const dispatch = useDispatch()
    const [expand, setExpand] = useState(false);
    const bodyRef = useRef('body')

    const disableBodyScroller = useCallback(() => {
        unlockBodyScroll()
        dispatch(setQtySlider(false))
    }, [])


    useEffect(() => {
        document.querySelector('#sliderTouchMove').addEventListener('touchmove', disableBodyScroller)
        return () => {
            unlockBodyScroll()
        }
    }, [bodyRef])



    return (
        <div style={{ boxShadow: isQtySlider ? '0px 1.37681px 11.0145px rgba(0, 0, 0, 0.1)' : '0' }} className="quantity-picker-wrapper">
            {
                isQtySlider ? <>
                    <div className='position-absolute' style={{ height: 41, width: 41, background: '#DBEF06', borderRadius: 35, top: 0, }}></div>
                    <QuantityPickerSlider
                        height={91}
                        itemHeight={32}
                        valueGroups={{ quantity }}
                        optionGroups={{
                            quantity: [...Array(21).keys()]
                        }
                        }
                        onChange={(e, value) => setQuantity(value)}
                    />
                </> :
                    <button className="quantity-picker overf"
                        onClick={(e) => {
                            e.stopPropagation();
                            lockBodyScroll()
                            dispatch(setQtySlider(true))
                        }}
                    >
                        {quantity > 0 ? quantity : <AddToCardIcon />}
                    </button>
            }
        </div>
    )
}
