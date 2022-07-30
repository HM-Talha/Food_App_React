import React, { createRef, useCallback, useEffect, useRef, useState } from "react";
import { BackIcon, HeartIcon, ShareIcon, SmallBackIcon, LeftArrowIcon } from "../../../assets/icons";
import { Redirect, useHistory, useRouteMatch } from "react-router-dom";

import "../styles/restaurantView.scss";
import FoodItem from "./FoodItem";
import axios from "axios";
import { baseUrl } from "../../../config/api-config";
import { getSelectedText } from "../../onboarding/components/UserFoodAllergic";
import { CoursesCategory } from "./CoursesCategory";
import DropDownArrowImg from "../../../assets/images/drop-down-arrow.svg";
import { DirectionIcon } from "../../../assets/icons";
import CheeseImg from "../../../assets/images/Cheesy.jpg";
import PhoneCallImg from "../../../assets/images/phone-call.svg";
import { getImage } from "../../onboarding/components/PastFoodHabbit";
import Loader from "../../../components/loader/Loader";
import { SensoryTag } from "../../../components/SensoryTag";
import { RestaurantsIcon } from "./RestaurantsIcon";
import Button from "../../../components/buttons";
import {getCompressedImgUrl, scrollIntoViewWithOffset} from "../../../config/utils";
import { useDispatch } from "react-redux";
import { setCartDetails } from "../redux/actions";
import _ from 'lodash'
import RestaurantFeedbackView from "./RestaurantFeedbackView";
import {getRestImage} from "../../imagine/components";
import { Footnote, Title } from "../../../components/Fonts";

let timeout = null;

const RestaurantView = (props) => {
    const defaultData = { dishes: [], courses: { mealName: [], subCourse: [] } };
    const match = useRouteMatch();
    const history = useHistory()
    const [pos, setPos] = useState(false);
    const [data, setData] = useState(defaultData);
    const [categories, setCate] = useState([]);
    const [category, setCategory] = useState("");
    const [subcategory, setSubCategory] = useState("");
    const [meals, setMeals] = useState([]);
    const [categoryDropDown, showCategoryDropDown] = useState(false);
    const [loading, setLoading] = useState(true);
    const { type } = props.match.params;
    const [restaurant, setRestaurant] = useState({});
    // console.log("Dish Id" + new URLSearchParams(props.location.search).get("dishId"));
    const [selectedDish, setSelectedDish] = useState(new URLSearchParams(props.location.search).get("dishId") ?? -1);
    const [dishQuantity, setDishQuantity] = useState({});
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState("all")
    const [showStart, setShowStar] = useState(true);
    const [mealCourses, setMealCourses] = useState([]);
    const [selectedMealCourse, updateSelectedMealCourse] = useState("");
    const [flavours, setFlavours] = useState(["Crispy", "Earthy", "Salty", "Crispy1", "Earthy1", "Salty1"]);
    const [selectedFlavours, setSelectedFlavours] = useState("Crispy");
    const dispatch = useDispatch();

    function setSelectedMealCourse(mealCourseSelected) {
        if (mealCourseSelected !== "") {
            scrollIntoViewWithOffset(mealCourseSelected, 300)
        }
        updateSelectedMealCourse(mealCourseSelected)
    }

    const scrollListener = useCallback(event => {
        let scrolled = document.scrollingElement.scrollTop;
        const dropDown = document.getElementById("drop-down-category");
        const dropDown2 = document.getElementById("drop-down-category-2");
        if (scrolled > 150) {
            setShowStar(false)
        } else {
            setShowStar(true)
        }

        if (scrolled >= dropDown?.offsetTop + dropDown?.offsetParent?.offsetTop - dropDown2?.offsetTop) {
            setPos(true)
        } else {
            setPos(false)
        }
    }, []);

    useEffect(() => {
        document.addEventListener("scroll", scrollListener)

        axios.get(`${baseUrl}/restaurant/get-restaurant-id?id=${props.match.params.id}`)
            .then(res => {                
                setRestaurant(res.data.data);
                setCate([...new Set(res.data.data.restaurant_menu.map(m => m.typeOfMenu))]);
                const meal_courses = [...new Set(res.data.data.restaurant_menu.map(m => m.meal_courses))];
                setMealCourses(meal_courses);
                if(selectedDish !== -1) {
                    setSelectedMealCourse(_.find(res.data.data.restaurant_menu, { '_id': selectedDish }).meal_courses);
                    setCategory(_.find(res.data.data.restaurant_menu, { '_id': selectedDish }).typeOfMenu)
                } else {
                    updateSelectedMealCourse(res.data.data.restaurant_menu?.[0].meal_courses)
                    setCategory(res.data.data.restaurant_menu?.[0].typeOfMenu)
                }
                
                setLoading(false)
            })
            // setTimeout(() => {
            //     document.getElementsByClassName("restaurant-card")?.[0]?.scrollIntoViewIfNeeded()
            // }, 2000)

        return () => {
            document.removeEventListener("scroll", scrollListener)
        }
    }, []);

    useEffect(() => {
        if(selectedDish === -1) {
            let mealdata = new Array(...new Set(meals.filter(m => m.mealName === category).map(a => a.subCourse)));
            setSubCategory(mealdata[0]);
        }
    }, [category, meals]);

    function onImageTap(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        // setShowStar(true)
        // clearTimeout(timeout);
        // timeout = setTimeout(() => {
        //     setShowStar(false)
        // }, 10000)
    }

    function reset() {
        setLoading(true)
        setData(defaultData)
        setDishQuantity({});
        setSelectedDish(-1);
        setTags([]);
        setSelectedTag("all");
    }

    function goBack() {
        const backTo = localStorage.getItem("back");
        if (backTo) {
            history.push(backTo);
        } else {
            history.goBack()
        }
    }

    function getTotalAmount() {
        let total = 0;
        for (let key in dishQuantity) {
            if (dishQuantity[key] > 0) {
                total += (dishQuantity[key] * restaurant?.restaurant_menu.find(m => m._id === key).price)
            }
        }
        return Math.round(total * 100) / 100;
    }

    async function gotoCheckout() {
        dispatch(setCartDetails({ restaurant, dishQuantity }));
        history.push(`/restaurant/${props.match.params.id}/checkout`)
    }

    function getDishes(ml) {
        let filteredDishes = restaurant?.restaurant_menu.filter(d => d.typeOfMenu === category);
        if (ml !== "") {
            filteredDishes = filteredDishes.filter(d => d.meal_courses === ml)
        }
        return filteredDishes
    }

    function getDishesById() {
        if ("restaurant_menu" in restaurant) {
            return getDishes().map((d, index) => ({
                ...d,
                index
            })).filter(d => d.resDishName === restaurant.dish.dishName[0].name)
        }

    }

    function getRestaurantCuisine() {
        return restaurant?.cuisine_details?.map(c => c.name.map(n => n.name)).flat().join(", ")
    }

    function getRestaurantAddress() {
        return restaurant?.contact_details?.map(c => [c.addressLine1, c.addressLine2, c.city, c.state].filter(a => a !== "").join(", ")).flat().join(", ");
    }

    function getRestaurantPricing() {
        const range = (restaurant?.pricing_details?.[0]?.price_range || "Expensive").toLowerCase();
        if (range.includes("very expensive")) {
            return "$$$$"
        } else if (range.includes("expensive")) {
            return "$$$"
        } else if (range.includes("moderately")) {
            return "$$"
        } else {
            return "$"
        }
        return restaurant?.pricing_details?.[0].price_range;
    }
    const elementsRef = useRef(mealCourses.map(() => createRef()));

    function shouldDishExpand(x) {
        return selectedDish === x._id || x?.recipeId === selectedDish
    }

    return (
        <div className="restaurant-view">

            {type === 'feedback' ? <></> : <div className="restaurants-hero" onClick={onImageTap} style={{
                position: "relative",
                color: "red",
                backgroundImage: `url(${getCompressedImgUrl(restaurant?.image?.[0] ?? getRestImage(0))})`
            }}>
                {showStart && <div className="backdrop-img" />}
                <div className="restaurants-hero__header">
                    <div className="restaurants-hero__header--back" onClick={goBack}>
                        <SmallBackIcon />
                    </div>
                    <div className="restaurants-hero__header--right">
                        {/* <div className="restaurants-hero__header--icon" style={{marginRight: '16px'}}>
                            <ShareIcon />
                        </div> */}
                        <div className="restaurants-hero__header--icon">
                            <HeartIcon />
                        </div>
                    </div>
                </div>
                {showStart && <div className="restaurants-vector mr-1">
                    <RestaurantsIcon option={type}
                        selectOptions={["Feedback", "Gallery", "Memories", "Story", "Menu"]} />
                </div>}
            </div>}
            {/*<div id="restaurant-view-hero" className="restaurants-hero">
                <div className="restaurants-hero__header">
                    <div className="restaurants-hero__header--back" onClick={goBack}>
                        <SmallBackIcon/>
                    </div>
                    <div className="restaurants-hero__header--right">
                        <div className="restaurants-hero__header--icon">
                            <ShareIcon/>
                        </div>
                        <div className="restaurants-hero__header--icon">
                            <HeartIcon/>
                        </div>
                    </div>
                </div>
                <div className="restaurants-vector">
                    <img src={restaurant?.restaurantImg?.imageUrl?.[0] ?? getImage(0)}/>
                </div>
            </div>*/}

            {
                !loading && type !== 'feedback' && <div className={"restaurant-view__header px-0 " + (type === 'feedback' ? ' no-after' : '') + (pos ? "visibility-hidden" : "")}
                    style={{ paddingBottom: 0 }}>
                    <BackIcon id="restaurant-view-header" className="restaurant-view__header--back"
                        onClick={goBack} />
                    {type === 'feedback' ? <></> : <div className="restaurant-view__lower-header" style={{ paddingLeft: 20, paddingRight: 20 }}>
                        <div>
                            <Title level={2}><div className="text-capitalize">{restaurant.restaurantName}</div></Title>
                            <Title level={'subHeading'}><div className="mt-4px" style={{
                                color: "#979797",
                                marginTop: "4px",
                                textTransform: "capitalize"
                            }}>{getRestaurantCuisine()}</div></Title>
                            <Title level={'subHeading'}><div className="mt-4px" style={{
                                color: "#979797",
                                textTransform: "capitalize"
                            }}>{getRestaurantAddress()}</div></Title>
                            <Title level={'subHeading'}><div className="mt-4px" style={{
                                color: "#979797",
                                textTransform: "capitalize"
                            }}>{getRestaurantPricing()}</div></Title>
                        </div>
                        <div className="d-flex mt-3">
                            <div className="d-flex">
                                <img className="mr-1" style={{height: '16px', width: '16px', marginTop: '2px'}} src={PhoneCallImg} />
                                <Title level={'subHeading'}><a className="text-black" style={{textDecoration: 'none'}} href={"tel:" + restaurant?.contact_details?.[0].contactNo}>Call&nbsp;Restaurant</a></Title>
                            </div>
                            <div className="d-flex">
                                <div className="mr-1 ml-44px" style={{height: '16px', width: '16px'}}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginBottom: '8px'}}>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.16638 0.666016C8.44161 0.666016 8.68855 0.83516 8.788 1.0918L13.9547 14.4251C14.0572 14.6896 13.9811 14.9899 13.7651 15.1738C13.5491 15.3576 13.2404 15.3846 12.9958 15.2411L8.16638 12.4086L3.33698 15.2411C3.09233 15.3846 2.78368 15.3576 2.56768 15.1738C2.35167 14.9899 2.2756 14.6896 2.37808 14.4251L7.54475 1.0918C7.6442 0.83516 7.89114 0.666016 8.16638 0.666016ZM4.31253 13.1232L7.8291 11.0607C8.03736 10.9385 8.29539 10.9385 8.50365 11.0607L12.0202 13.1232L8.16638 3.17776L4.31253 13.1232Z" fill="black" fill-opacity="0.85"/>
                                    </svg>
                                </div>
                                {/* <img className="mr-1 ml-3" src={DropDownArrowImg}/> */}
                                <Title level={'subHeading'}><a className="text-black" style={{textDecoration: 'none'}}
                                    href={"http://maps.google.com/?q=" + restaurant.restaurantName + " " + getRestaurantAddress()}>Get
                                    Directions</a></Title>
                            </div>
                        </div>
                    </div>}
                    <RestaurantNav downCategory={true} dropDownId={"drop-down-category"} resId={props.match.params.id}
                        restaurant={restaurant} type={type}
                        resData={restaurant}
                        fetchData={() => {
                        }} reset={reset} setSelectedTag={setSelectedTag} tags={tags}
                        categories={categories} category={category} setSubCategory={setSubCategory}
                        showCategoryDropDown={showCategoryDropDown} subcategory={subcategory}
                        mealCourses={mealCourses} selectedMealCourse={selectedMealCourse}
                        setSelectedMealCourse={setSelectedMealCourse}
                        flavours={flavours} selectedFlavours={selectedFlavours}
                        setSelectedFlavours={setSelectedFlavours}
                        getDishes={getDishes}
                    />

                </div>
            }
            {
                !loading && <div className={"" + (!pos ? "visibility-hidden" : "")} style={{
                    position: 'fixed',
                    top: 0,
                    boxSizing: "border-box",
                    backgroundColor: "#ffffff",
                    zIndex: 9,
                    width: '100%',
                    // paddingLeft: 20,
                    // paddingRight: 20,

                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: 40,
                        paddingLeft: 24,
                        paddingBottom: 0

                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            flex: 1,
                        }}
                        >

                            <span>
                                <LeftArrowIcon onClick={goBack} />
                            </span>
                            <Title level={2}>
                                <div className="text-capitalize" style={{
                                    paddingLeft: 12,
                                    width: '100%'
                                }}>
                                    {restaurant.restaurantName.slice(0, 28)}
                                    {restaurant.restaurantName.length > 28 ? '...' : ''}
                                </div>
                            </Title>
                        </div>
                        <div>
                        </div>

                    </div>

                    <RestaurantNav downCategory2={true} dropDownId={"drop-down-category-2"} resId={props.match.params.id}
                        restaurant={restaurant} resData={restaurant}
                        type={type}
                        fetchData={() => {
                        }} reset={reset} setSelectedTag={setSelectedTag} tags={tags}
                        categories={categories} category={category} setSubCategory={setSubCategory}
                        showCategoryDropDown={showCategoryDropDown} subcategory={subcategory}
                        mealCourses={mealCourses}
                        selectedMealCourse={selectedMealCourse}
                        setSelectedMealCourse={setSelectedMealCourse}
                        flavours={flavours} selectedFlavours={selectedFlavours}
                        setSelectedFlavours={setSelectedFlavours}
                        getDishes={getDishes}
                    />
                </div>

            }
            {loading && <div style={{ paddingTop: "5rem" }}><Loader loading={loading} isComponent /></div>}



            {!loading &&
                <div className={`${type === 'feedback' ? 'feedback-view' : 'restaurant-view__main'}`} id={"menu-items"}>
                    {type === 'feedback' ? <RestaurantFeedbackView restaurant={restaurant} /> : <div className="restaurant-view__dishes" >

                        {
                          mealCourses.map((mc, index) => {
                                const withOutAttention = getDishes(mc).filter(e => Boolean(e.tags?.attention) === false )
                                const withAttention = getDishes(mc).filter(e => !!e.tags?.attention )
                                
                              const foodList = [...withOutAttention, ...withAttention ]
                                if (getDishes(mc).length > 0)
                                    return <div id={mc} ref={elementsRef.current[index]} key={index}>
                                        <Title level={2}><span className="dishes-type-text">{mc}</span></Title>
                                        {
                                            foodList.map((x, indx) => {
                                                return (
                                                    <FoodItem key={indx} title={x.dish_name}
                                                        selectedDish={selectedDish}
                                                        item={x}
                                                        tags={x.tags}
                                                        price={"$" + x.price}
                                                        img={[x.image.length ? x.image[0] : "", "", getImage(indx)].filter(s => s !== "" || !!s)[0]}
                                                        expand={shouldDishExpand(x)}
                                                        setExpand={() => setSelectedDish(selectedDish === x._id ? -1 : x._id)}
                                                        quantity={dishQuantity?.[x._id] ?? 0}
                                                        setQuantity={(newQuantity) => {
                                                            setDishQuantity(d => ({
                                                                ...d,
                                                                [x._id]: newQuantity
                                                            }))
                                                        }
                                                        } />
                                                )
                                            }
                                            )
                                        }
                                    </div>
                            }
                            )
                        }


                    </div>}
                </div>
            }


            {Object.keys(dishQuantity).length > 0 && getTotalAmount() > 0 && <div className="restaurant-view__cart-footer">
                <div className="divider-border"><div className="border-x"></div></div>
                <div className="d-flex justify-content-between" style={{width: '100%'}}>
                <div className="restaurant-view__cart-footer--total">
                    <Footnote><span style={{textTransform: 'uppercase'}}>Total</span></Footnote>
                    <Title level={'headLine'}><div>${getTotalAmount()}</div></Title>
                </div>
                <Button variant="primary" caption="Pay" onClick={gotoCheckout} />
                </div>
            </div>}

            <CoursesCategory showCategoryDropDown={showCategoryDropDown} show={categoryDropDown} onSelectItem={(item) => {
                setCategory(item);
                showCategoryDropDown(false)
            }} selectedItem={category} title={restaurant.restaurantName} categories={categories} />
        </div>
    );
};


/**
 * Restaurant feedback nav bar
 */
const FeedbackNav = ({restaurantName, feedbackMenu}) => {
    const history = useHistory()
    const navItems = ["Pricing", "Experience", "Food", "Service", "Feeling"]
    const [selectedNav, setSelectedNav] = useState('Pricing')
    
    return <div className="feedback-nav">
         <button className='button' onClick={() => history.goBack()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        <h2 className="feedback-title">{ restaurantName && restaurantName }</h2>
        <ul className="feedback-nav-items">{navItems.map((n, i) => <li className={`nav-item ${selectedNav === n ? 'nav-item--active' : ''}`} key={i} onClick={() => { setSelectedNav(n); feedbackMenu(n)} }>{getSelectedText({parentAllergy: n}, selectedNav === n)}</li>)}</ul>
    </div>
}


export const RestaurantNav = ({
    dropDownId,
    resId, restaurant, type, tags, reset,
    setSelectedTag,
    fetchData, showCategoryDropDown,
    category,
    categories,
    subcategory,
    setSubCategory, resData, mealCourses, selectedMealCourse, setSelectedMealCourse,
    flavours, selectedFlavours, setSelectedFlavours, getDishes,
    downCategory2,
    downCategory,
    feedbackMenu
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    let back = "";
    if ("back" in params) {
        back = params.back
    }
    const listenToScroll = () => {
        let heightToHideFrom = 650;
        const winScroll = document.body.scrollTop || 
            document.documentElement.scrollTop;
    
        if (winScroll > heightToHideFrom) {  
            isVisible && setIsVisible(false);
        } else {
            setIsVisible(true);
        }  
      };
    useEffect(()=> {
        window.addEventListener("scroll", listenToScroll);
        return () => window.removeEventListener("scroll", listenToScroll); 
    }, [])
    return (
        <>
            {type === 'feedback' ? <></> : <><div className={categories.length <= 1 ? "invisible h-0" : categories.length > 1 && !isVisible ? "invisible h-0" : ''}>
                <div id={dropDownId} style={{ marginLeft: 24, marginTop: downCategory ? 0 : 24 }} className="drop-down" onClick={() => showCategoryDropDown(true)}>
                    <Title level={'subHeading'} className='text-capitalize'>{category}</Title>
                    <img src={DropDownArrowImg} className="ml-1" />
                </div>
            </div>

            <div style={{
                width: "100%",
                paddingLeft: 0,
                paddingRight: 6,
            }} id="comfort-header-nav" className="restaurant-view__links">
                {
                    mealCourses.map(m => {
                        if (getDishes(m).length > 0) {
                            return <div
                                className={"restaurant-view__link-items" + (selectedMealCourse === m ? " restaurant-view__link-items--active" : "")}
                                onClick={() => {
                                    setSelectedMealCourse(selectedMealCourse === m ? "" : m)
                                }}>
                                <Title level={'subHeading'}>{getSelectedText({ parentAllergy: m }, selectedMealCourse === m)}</Title>
                            </div>
                        }
                    })
                }
            </div>

        
            <div className="sub-category-wrapper">
                {
                    flavours.map(item => (
                        <div
                            className={`sub-category-item ${item === selectedFlavours && "sub-category-item-active"}`}
                            onClick={() => setSelectedFlavours(item === selectedFlavours ? "" : item)} style={{
                                backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, .75)), url(${CheeseImg})`,
                                backgroundSize: "cover"
                            }}>
                            <Title level={'subHeading'}><div style={{ textTransform: "capitalize", color: "white" }}>{item}</div></Title>
                        </div>
                    ))
                }
            </div></>}
          

            {
                type === "sensory" &&
                <SensoryTag className="mb-1" sensoryTags={Object.values(tags || {}).flat()}
                    setSelectedSensory={(index) => {
                        reset();
                        setSelectedTag(Object.values(tags || {}).flat()[index])
                        fetchData(Object.values(tags || {}).flat()[index])
                    }} />
            }
        </>
    );
};

export default RestaurantView;
function useOnScreen(ref) {

    const [isIntersecting, setIntersecting] = useState(false)

    const observer = new IntersectionObserver(
        ([entry]) => setIntersecting(entry.isIntersecting)
    )

    useEffect(() => {
        observer.observe(ref.current)
        // Remove the observer as soon as the component is unmounted
        return () => { observer.disconnect() }
    }, [])

    return isIntersecting
}