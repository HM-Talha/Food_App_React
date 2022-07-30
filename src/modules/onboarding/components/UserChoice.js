import React, { useEffect, useLayoutEffect, useMemo, useState, Fragment, useRef } from "react";
import { useHistory } from "react-router-dom";

import OnboardingLayout from "../../../components/layout/OnboardingLayout";
import SimpleTag from "../../../components/tags/SimpleTag";
import "../styles/userChoice.scss";
import axios from "axios";
import { baseUrl } from "../../../config/api-config";
import { vibrate } from "./FoodtypeSelector";
import RestaurantCard from "../../restaurants/components/RestaurantCard";
import CloseImg from "./assets/LeftCircleBtn.svg";
import HeartImg from "./assets/RightCircleBtn.svg";
import LikeHeartImg from "./assets/LikeHeartImg.svg";
import LikedHeart from "./assets/likedHeart.svg";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import Loader from "../../../components/loader/Loader";
import userEvent from "@testing-library/user-event";
import {
    CircularProgressbarWithChildren,
    buildStyles
  } from "react-circular-progressbar";
  import "react-circular-progressbar/dist/styles.css";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchSwipingDishes,
    setCurrentDishIndex,
    setRecommendedDishes,
    setRestaurantsByDish
} from "../../home/redux/actions";
import restaurantDishes from "../../../input.json";
import {getCompressedImgUrl} from "../../../config/utils";
import {getRestImage} from "../../imagine/components";
import { Text, Title } from "../../../components/Fonts";
import like_heart from '../../../assets/lottie/Like_heart.json'
import Lottie from 'lottie-react';
import useLongPress from "../../../components/LongPress";

const alreadyRemoved = [];

const UserChoice = ({ user, setUser, hideExtendedInformation }) => {
    const history = useHistory();
    const dispatch = useDispatch()
    const  {recommendedDishes, restaurantsByDish, currentDishIndex} = useSelector(state => state.home)

    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false)
    const [clicked, setClicked] = useState(false)
    const splideRef = useRef();

    var resId = '';
    async function fetchRecommendation() {
        dispatch(fetchSwipingDishes())
    }
    useEffect(() => {
        if (recommendedDishes.length === 0) {
            fetchRecommendation()
        }
    }, [])

    async function fetchRestaurants(index, dis) {
        // debugger
        const dish = recommendedDishes[index];
        if (dish.dishId in restaurantsByDish) {
            setRestaurants(restaurantsByDish[dish.dishId]);
            setLoading(false);
        } else {
            // debugger
            setLoading(true);
            const res = await axios.get(`${baseUrl}/restaurant/recipe-associate-restaurant?dishId=${dish.dishId}`, { timeout: 10000 });
            setRestaurants(res.data.data)
            dispatch(setRestaurantsByDish({ [dish.dishId]: res.data.data }))
            setLoading(false);
        }
    }

    useEffect(() => {
        if (splideRef.current && currentDishIndex > 0) {
            splideRef.current.splide.go(currentDishIndex);
        }
    }, [currentDishIndex])

    const [dishIndex, setDishIndex] = useState(currentDishIndex);
    useEffect(() => {
        if (recommendedDishes.length > 0) {
            fetchRestaurants(0)
        }
    }, [recommendedDishes])


    const onSwipe = async (item) => {
        vibrate()
        // console.log('Dish', item)
        // console.log("user Like", user)
        try {
            // console.log(user)
            const status = user.likedDishes.includes(item.dishId) ? "dislike" : "like";
            // (status === "like") ? setUser({...userData , likedDishes : [...userData.likedDishes , item.dishId]}) :
            // setUser({...userData , likedDishes : userData.likedDishes.filter(x=> x!== item.dishId)}) ;
            if (status === 'like') {
                setUser({ ...user, likedDishes: [...user.likedDishes, item.dishId] })
                // setLoading(loading)
                // user.likedDishes.concat(item.dishId)
            }
            else {
                setUser({ ...user, likedDishes: user.likedDishes.filter(dishId => dishId !== item.dishId) })
            }
            const res = await axios.put(`${baseUrl}/user/update-dish-status-toggle?status=${status}`, { dishId: item.dishId }).then(x => {
                // console.log("Before",user.likedDishes)
                // console.log(typeof(user))
                //
                // console.log("After",user.likedDishes)

            })
        } catch (e) {
            console.log(e)
        }
    };

    const onLongPress = () => {
        console.log('long press')
    };
    const onClick = () => {
        goNext(resId)
    }
    const defaultOptions = {
        shouldPreventDefault: true,
        delay: 500,
    };
    const longPressEvent = useLongPress(setClicked, onLongPress, onClick, defaultOptions)

    useLayoutEffect(() => {
        const targetList = document.getElementsByClassName("swipe");
        const targetNode = targetList[targetList.length - 1];

        if (!targetNode) return;

        targetNode.addEventListener("touchmove", (ev) => {
            ev.preventDefault();
            let style = window.getComputedStyle(targetNode);
            let width = style.getPropertyValue("transform").match(/(-?[0-9\.]+)/g)[4];
            const cancel = document.getElementsByClassName("user-choice__cancel");
            const like = document.getElementsByClassName("user-choice__like");
            if (Number(width) < 0) {
                cancel[cancel.length - 1].classList.add("user-choice__cancel--active");
                like[like.length - 1].classList.remove("user-choice__like--active");
            } else if (Number(width) > 0) {
                cancel[cancel.length - 1].classList.remove(
                    "user-choice__cancel--active"
                );

                like[like.length - 1].classList.add("user-choice__like--active");
            } else {
                cancel[cancel.length - 1].classList.remove(
                    "user-choice__cancel--active"
                );
                like[like.length - 1].classList.remove("user-choice__like--active");
            }
        });
        targetNode.addEventListener("touchend", (ev) => {
            ev.preventDefault();

            const cancel = document.getElementsByClassName("user-choice__cancel");
            const like = document.getElementsByClassName("user-choice__like");

            cancel[cancel.length - 1]?.classList.remove("user-choice__cancel--active");
            like[like.length - 1]?.classList.remove("user-choice__like--active");
        });
    });

    const handleChange = (id) => {
        resId = id
    }
    useEffect(() => {
        dispatch(setCurrentDishIndex(dishIndex))
    }, [dishIndex])


    useEffect(() => {
        setLoading(true)
        fetchRestaurants(currentDishIndex)
            .then(res => {
                setLoading(false)
            }).catch((error) => {
                console.log(error.massage)
                setLoading(false) 
            })
    }, [currentDishIndex])

    function goNext(restaurantId) {
        const dish = recommendedDishes[dishIndex]
        history.push(`/restaurant-view/${restaurantId}/popular?dishId=${dish.dishId}`)
    }
    return (

        <><OnboardingLayout
            title="I like you, I like you not"
            hideNext={true}
            hideSearch={true}
            className={`home-swiper ${hideExtendedInformation && 'pb-0'}`}
            showTopNavBar={false}
        >
            {recommendedDishes.length > 0 &&
                <DishSwiper user={user} onSwipe={onSwipe} dishIndex={dishIndex} dishes={recommendedDishes} splideRef={splideRef}
                    onMoved={async (newIndex, prevIndex, destIndex, dishes) => {
                        vibrate()
                        setDishIndex((di) => {
                            if (di !== newIndex) {
                                setRestaurants([]);
                                setLoading(true);
                                let dir = "right";
                                if (newIndex > prevIndex) {
                                    dir = "left";
                                } else {
                                    dir = "right"
                                }
                                if (prevIndex === 0 && newIndex === recommendedDishes.length - 1) {
                                    dir = "right"
                                }
                                if (newIndex === 0 && prevIndex === recommendedDishes.length - 1) {
                                    dir = "left"
                                }
                                // onSwipe(dir, prevIndex, dishes[prevIndex])
                            }
                            return newIndex
                        });
                    }}
                />}
            <div className="user-choice__info">
                <Text className={'mt-20px'}>{recommendedDishes[dishIndex]?.dishName[0]?.name}</Text>
                <Title className={'mt-4px'} level={'subHeading'} color='#8A8A87'>{recommendedDishes[dishIndex]?.cuisineInfo[0]?.nativeCuisine}</Title>
            </div>
            {
                !hideExtendedInformation &&
                <div className="user-choice__type mt-12px">
                    {
                        recommendedDishes[dishIndex]?.sensoryInfo.map((s, i) => <SimpleTag className={(i == 0 || i == recommendedDishes[dishIndex]?.sensoryInfo.length) ? 'ml-0' : 'ml-8px'} key={i} name={s} />)
                    }
                </div>
            }
        </OnboardingLayout>
            {!hideExtendedInformation &&
                <>
                    {<div className={(clicked) ? "restaurants__list--wrapper__active restaurants__list--wrapper" : "restaurants__list--wrapper"} style={{ paddingBottom: "100px", paddingTop: '36px' }}>
                        {loading && <Loader loading={loading} isComponent />}
                        {
                            restaurants.map((res, index) => (
                                <div key={index} onChange={handleChange(res._id)} {...longPressEvent}><RestaurantCard
                                    key={index}
                                    img={res?.restaurantImg?.image[0] ?? getRestImage(dishIndex)}
                                    tagNames={[(res.time !== -1) ? `${res.time} drive` : 'Not Reachable', (res.distance !== -1) ? `${parseFloat(res.distance.toFixed(2))} miles away` : 'Not Reachable']}
                                    onClick={() => {
                                        goNext(res._id)
                                    }}
                                    name={res.restaurantName}
                                    dishPrice={res.restaurant_menu.price}
                                /></div>
                            ))
                        }
                    </div>}
                </>
            }
        </>
    );
};


const DishSwiper = ({ dishes, onSwipe, onMoved, dishIndex, user, splideRef }) => {
    const [stop, setStop] = useState(false)
    const ref = useRef(null)
    const lottieRef = useRef(null)
    const scrollToBottom = () => {
        window.scrollTo({
            top: 100,
            behavior: 'smooth'
        })
    }
    useEffect(() => {
        if(lottieRef.current)
            lottieRef.current.playSegments([0, 44], true)
    }, [user.likedDishes])
    return (
        <Splide
            ref={splideRef}
            options={{
                type: 'loop',
                perPage: 1,
                height: "19.75rem",
                gap: "50vw",
                pagination: false,
                arrows: true,
                perMove: 1,
                trimSpace: false,
                dragMinThreshold: 1,
                direction: 'rtl'
            }}
            onArrowsMounted={(splide, prev, next) => {
                const closeImg = document.createElement('img');
                closeImg.src = CloseImg;
                closeImg.className = "slider-arrow ml-24px";
                const heartImg = document.createElement('img');
                heartImg.src = HeartImg;
                heartImg.className = "slider-arrow mr-24px";
                const item = document.getElementsByClassName("splide__arrow--prev")[0];
                item?.childNodes[0].replaceWith(heartImg);
                const item2 = document.getElementsByClassName("splide__arrow--next")[0];

                item2?.childNodes[0].replaceWith(closeImg);

            }}

            onMoved={async (ele, newIndex, prevIndex, destIndex) => {
                await onMoved(newIndex, prevIndex, destIndex, dishes)
            }}

        >
            {dishes.map((d, currentIdx) => {
                let image = d.dishImgUrl.replaceAll(/("\[')|(']")/gm, ' ')
                image = image.replaceAll("[", "")
                image = image.replaceAll("]", "")
                image = image.replaceAll("(", "")
                image = image.replaceAll(")", "")
                image = image.replaceAll("'", "")
                image = image.trim();
                return (
                    <Fragment key={currentIdx}>
                        <SplideSlide>
                            <img className={"slide-img"} src={getCompressedImgUrl(image || getDishImage(dishIndex))} alt="dish" onClick={scrollToBottom} />
                            <span onClick={() => {onSwipe(d); }} className="position-absolute bottom-0" style={{marginBottom: "2.5rem"}}>
                                <div style={{ width: 60, height: 60, background: '#fff', borderRadius: '100%' }}>
                                    <CircularProgressbarWithChildren value={d.Probability ? d.Probability * 100 : 0}
                                        styles={buildStyles({
                                        pathColor: '#DBEF06',
                                        trailColor: 'rgba(255, 255, 255, 0.25)',
                                        strokeLinecap: "butt"
                                        })}
                                        strokeWidth={10}
                                    >
                                        { 
                                            user.likedDishes.includes(d.dishId) ?
                                            <div style={{height: '36px', width: '36px'}}><Lottie loop={false} autoplay={false} animationData={like_heart} lottieRef={lottieRef} /></div> :
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M21.62 12.1243C22.731 8.58433 21.401 4.53432 17.71 3.33432C14.8246 2.39624 12.8067 3.67066 12 4.34332C10 2.58309 7.38069 2.92323 6.32102 3.31332C2.59002 4.53432 1.26002 8.58433 2.39002 12.1243C3.03002 13.9333 4.06102 15.5743 5.40102 16.9233C6.4071 17.919 8.64725 19.9402 10.7346 21.2909C11.5272 21.8039 12.5354 21.8087 13.33 21.2988C15.4325 19.9498 17.6329 17.9281 18.611 16.9333C19.96 15.5843 20.99 13.9333 21.62 12.1243Z" fill="white"/>
                                                <path fillRule="evenodd" clipRule="evenodd" d="M6.32102 3.31332C2.59002 4.53432 1.26002 8.58433 2.39002 12.1243C3.03002 13.9333 4.06102 15.5743 5.40102 16.9233C6.4071 17.919 8.64725 19.9402 10.7346 21.2909C11.5272 21.8039 12.5354 21.8087 13.33 21.2988C15.4325 19.9498 17.6329 17.9281 18.611 16.9333C19.96 15.5843 20.99 13.9333 21.62 12.1243C22.731 8.58433 21.401 4.53432 17.71 3.33432C14.8246 2.39624 12.8067 3.67066 12 4.34332C10 2.58309 7.38069 2.92323 6.32102 3.31332ZM20.6705 11.8102C20.0889 13.473 19.1412 14.9889 17.9039 16.2262L17.9039 16.2262L17.898 16.2322C16.9465 17.1998 14.8051 19.1642 12.79 20.4572C12.3277 20.7538 11.7432 20.7525 11.2778 20.4514C9.27365 19.1544 7.09107 17.1886 6.10748 16.2156C4.87738 14.9763 3.92881 13.4686 3.338 11.8056C2.33329 8.63584 3.57218 5.26509 6.63204 4.26373L6.64937 4.25805L6.66648 4.25176C7.54197 3.92946 9.72289 3.67132 11.3393 5.09399L11.9825 5.66002L12.6404 5.11134C13.3063 4.55614 14.9703 3.49512 17.4008 4.28533C20.4148 5.26521 21.6609 8.63198 20.6705 11.8102Z" fill="#292929"/>
                                            </svg>
                                        }
                                    </CircularProgressbarWithChildren>
                                </div>
                            </span>
                        </SplideSlide>
                    </Fragment>
                )
            })}
        </Splide>
    )
}

const getDishImage = (index = 0) => {
    const images = [
        "https://pikky.s3.amazonaws.com/patterns/dish1.svg",
        "https://pikky.s3.amazonaws.com/patterns/dish2.svg",
        "https://pikky.s3.amazonaws.com/patterns/dish3.svg",
        "https://pikky.s3.amazonaws.com/patterns/dish4.svg",
        "https://pikky.s3.amazonaws.com/patterns/dish5.svg",
    ];
    return images[index % images.length]
};

export default UserChoice;
