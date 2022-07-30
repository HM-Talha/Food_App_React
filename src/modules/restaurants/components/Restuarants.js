import React, {useEffect, useState, useCallback} from "react";
import {Redirect, useHistory} from "react-router-dom";

import {HeartIcon, ShareIcon, SmallBackIcon, BasketIcon } from "../../../assets/icons";
import "../styles/restaurants.scss";
import Carousel from "../../../components/carousel";
import SimpleCard from "../../../components/cards/SimpleCard";
import RestaurantCard from "./RestaurantCard";
import axios from "axios";
import {baseUrl} from "../../../config/api-config";
import {getImage} from "../../onboarding/components/PastFoodHabbit";
import {RestaurantsIcon} from "./RestaurantsIcon";
import Loader from "../../../components/loader/Loader";
import {SensoryTag} from "../../../components/SensoryTag";
import Picker from "react-mobile-picker-scroll";
import {vibrate} from "../../onboarding/components/FoodtypeSelector";
import Lottie from "lottie-react";
import CalorieAnimationData from '../assets/lottie/Calorie.json'
import CarbsAnimationData from '../assets/lottie/Carbs.json'
import FatsAnimationData from '../assets/lottie/Fat.json'
import ProteinAnimationData from '../assets/lottie/Protein.json'
import { Title } from "../../../components/Fonts";
import {getCompressedImgUrl, scrollIntoViewWithOffset} from "../../../config/utils";
import {getRestImage} from "../../imagine/components";
import { LeftArrowIcon } from '../../../assets/icons'

let timeout = null;
const Restaurants = (props) => {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [restaurants, setRestaurants] = useState([]);
    const {type} = props.match.params;
    console.log(type, 'type')
    const [showStart, setShowStar] = useState(false);
    const [selectedSensory, setSelectedSensory] = useState(-1);
    const [sensoryProfile, setSensoryProfile] = useState({})
    const [sensoryProfileTags, setSensoryProfileTags] = useState([])
    const navbar = ["Restaurant", "Similar Dishes", 'Sensory Profile', 'Nutrition Profile', 'Gallery', 'Ratings']
    const [pos, setPos] = useState(false);
    const [dishes, setDishes] = useState([])
    const [state, setState] = useState({
        valueGroups: {
            nutritional: "",
        },
        optionGroups: {
            nutritional: [],
        },
        index: 0
    })
    const handleChange = (name, value) => {
        vibrate()
        setState(({ valueGroups,optionGroups,index }) => ({
            valueGroups: {
                ...valueGroups,
                [name]: value
            },
            optionGroups,
            index: parseInt(value?.key ?? 0)
        }));
    };
    function next(restaurant) {
        history.push(`/restaurant-view/${restaurant._id}/popular`, {restaurant: {...restaurant}})
    }

    function goBack(evt) {
        if('from' in history.location.state.dish)
            history.push("/" + history?.location?.state?.dish?.from + "/dishes");
        else
            history.goBack()
        evt.preventDefault();
        evt.stopPropagation();
    }

    const [dish, setDish] = useState({});
    console.log(dish, 'dish')    

    async function fetchDishDetails() {
        console.log(history.location.state, 'state')
        let res = await axios.get(`${baseUrl}/recipe/v2/${props.match.params.id}`, {timeout: 10000});
        if (res.data.message.recipe == null) {
           res = await axios.get(`${baseUrl}/recipe/v2/${history.location.state.dish.recipeId}`, {timeout: 10000});
        }
        console.log(res, 'res')
        setDish(res.data.message)
        const tags = [
            ...res.data.message.sensory.sensoryProfile.Mouthfeel_Tag,
            ...res.data.message.sensory.sensoryProfile.Visual_Tag,
            ...res.data.message.sensory.sensoryProfile.Aroma_Tag.map(tag=>tag.Aroma_Tag),
            ...res.data.message.sensory.sensoryProfile.Taste_Tag.map(tag=>tag.Taste_Tag)
        ]
        setSensoryProfileTags(tags)
    }

    const scrollListener = useCallback(event => {
        let scrolled = document.scrollingElement.scrollTop;
        const dropDown = document.getElementById("main");
        const dropDown2 = document.getElementById("comfort-header-nav");
        const line = document.getElementById("line");
        if (scrolled >= dropDown?.offsetHeight + dropDown2?.offsetHeight - line?.offsetTop + 35) {
            setPos(true)
        } else {
            setPos(false)
        }
    }, []);

    useEffect(() => {
        document.addEventListener("scroll", scrollListener)
        fetchDishDetails()
    }, [history.location.state.dish]);


    useEffect(() => {
        setLoading(true)

        async function fetchDetails() {
            setRestaurants([])
            try {
                if (type === "restaurant") {
                    const res = await axios.get(`${baseUrl}/restaurant/recipe-associate-restaurant?dishId=${props.match.params.id}`, {timeout: 10000});
                    setRestaurants(res.data.data)
                    try {
                        res = await axios.get(`${baseUrl}/comfort/star-light/dish?type=similar&dish_id=${props.match.params.id}`, {timeout: 100000});
                    } catch (e) {
                        res = await axios.get(`${baseUrl}/comfort/star-light/dish?type=similar&dish_id=${history.location.state.dish.recipeId}`, {timeout: 100000});
                    }
                    setDishes(res.data.result.dishes)
                    setSelectedSensory(-1)
                } else if (type === "nutrition profile") {
                    console.log('came')
                    let res = await axios.get(`${baseUrl}/recipe/recipesSensory/${props.match.params.id}`, {timeout: 10000});
                    if (res.data.message == null) {
                        res = await axios.get(`${baseUrl}/recipe/recipesSensory/${history.location.state.dish.recipeId}`, {timeout: 10000});
                    }
                    setSensoryProfile(res.data?.message.sensoryProfile)
                    
                    let values = res.data.message.nutritionalValue;
                    const data = Object.keys(values).map((key, index) => {
                        const nutri = values[key];

                        // If value is 0
                        if ((Math.round(nutri.value * 100) / 100) === 0) return {name: '', element: ''};
                        
                        return !["serving_size", "yield"].includes(key) ? {
                            name: key, element: <div key={index} className={`nutri-item ${key}`}>
                                <div className="nutri-anim">
                                    {key === 'energy' && <Lottie loop animationData={CalorieAnimationData} />}
                                    {key === 'carbs' && <Lottie loop animationData={CarbsAnimationData} />}
                                    {key === 'cholesterol' && <Lottie loop animationData={CalorieAnimationData} />}
                                    {key === 'fats' && <Lottie loop animationData={FatsAnimationData} />}
                                    {key === 'dietaryfibre' && <Lottie loop animationData={CalorieAnimationData} />}
                                    {key === 'protein' && <Lottie loop animationData={ProteinAnimationData} />}
                                    {key === 'water' && <Lottie loop animationData={CalorieAnimationData} />}
                                    {key === 'sugars' && <Lottie loop animationData={CalorieAnimationData} />}
                                    {key === 'serving_size' && <Lottie loop animationData={CalorieAnimationData} />}
                                    {key === 'yield' && <Lottie loop animationData={CalorieAnimationData} />}
                                </div>
                                <div className="nutri-quantity">{Math.round(nutri.value * 100) / 100 >= 1000 ? Math.round(Math.round(nutri.value * 100) / 100) : Math.round(nutri.value * 100) / 100} <small>{nutri.unit}</small></div>
                                <div className="nutri-name">{key === 'fats' ? 'fat' : key}</div>
                            </div>
                        } : {name: key, element: <span>{ Math.round((nutri * 100) / 100)}</span>}
                    })
                    setState(({ valueGroups,optionGroups }) => ({
                        optionGroups: {
                            nutritional: data
                        },
                        valueGroups: {
                            nutritional: Object.keys(values)[0]
                        },
                        index: 0
                    }));
                } else if (type === "similar dishes") {
                    let res;
                    try {
                        res = await axios.get(`${baseUrl}/comfort/star-light/dish?type=similar&dish_id=${props.match.params.id}`, {timeout: 100000});
                    } catch (e) {
                        res = await axios.get(`${baseUrl}/comfort/star-light/dish?type=similar&dish_id=${history.location.state.dish.recipeId}`, {timeout: 100000});
                    }
                    setDishes(res.data.result.dishes)
                    setSelectedSensory(-1)
                }
            } catch (e) {

            } finally {
                setLoading(false)
            }
        }

        fetchDetails()
    }, [type]);

    function onImageTap(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        setShowStar(true)
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            setShowStar(false)
        }, 10000)
    }

    const sensoryTags = [...new Set((Object.values(restaurants?.[0]?.sensoryProfile ?? {}) ?? []).flat().sort().filter(a => a.length > 0) ?? [])];
    return (
        <div className="restaurants">
            <div className="restaurants-hero" id="main" onClick={onImageTap} style={{
                position: "relative",
                color: "red",
                backgroundImage: `url(${getCompressedImgUrl(history.location.state.dish?.image !== '[]' ? history.location.state.dish?.image?.replace(/(\[')|('\])/gi, '') : getImage(0))})`
            }}>
                {/* {showStart && <div className="backdrop-img"/>} */}
                <div className="restaurants-hero__header">
                    <div className="restaurants-hero__header--back" onClick={goBack}>
                        <SmallBackIcon/>
                    </div>
                    <div className="restaurants-hero__header--right">
                        {/* <div className="restaurants-hero__header--icon">
                            <ShareIcon/>
                        </div> */}
                        <div className="restaurants-hero__header--icon">
                            <HeartIcon/>
                        </div>
                    </div>
                </div>
                {/* {showStart && <div className="restaurants-vector">
                    <RestaurantsIcon option={type}/>
                </div>} */}
                <div className="restaurants-hero__footer">
                    <Title level={2}><div className="pr-24px" style={{textTransform: "capitalize"}}>{history.location.state?.dish.dishName?.length > 0 && history.location.state?.dish.dishName[0].name || history.location.state?.dish?.dish?.length > 0 && history.location.state?.dish?.dish}</div></Title>
                    <Title level={"subHeading"}><div className="mt-4px" style={{textTransform: "capitalize", color: '#292929'}}>{history.location.state?.dish?.nativeCuisine}</div></Title>
                    <Title level={"subHeading"}><div className="mt-4px" style={{textTransform: "capitalize", color: '#292929'}}>{ sensoryProfileTags.join(', ')}</div></Title>
                </div>
            </div>
            {loading && <Loader loading={loading} isComponent/>}
            {!loading && <div className="restaurants__list">
                {/* Basket icon */}
                {/*<div className="basket-icon">*/}
                {/*    <BasketIcon />*/}
                {/*</div>*/}
                {/* Restaurant name */}
                {/* <Title level={2}><div style={{textTransform: "capitalize", color: '#292929'}}>{history.location.state?.dish.dishName?.length > 0 && history.location.state?.dish.dishName[0].name}</div></Title>
                <Title level={"subHeading"}><div className="mt-4px" style={{textTransform: "capitalize", color: '#8A8A87'}}>{ sensoryProfileTags.join(', ')}</div></Title> */}
                <div className={"" + (!pos ? "visibility-hidden" : "")} style={{
                    position: 'fixed',
                    top: 0,
                    boxSizing: "border-box",
                    backgroundColor: "#ffffff",
                    zIndex: 9,
                    width: '100%',
                    borderBottom: '1px solid #F2F2ED',
                    height: '88px'
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
                                    <Title level={2}><div className="pl-24px pr-24px" style={{textTransform: "capitalize"}}>{history.location.state?.dish.dishName?.length > 0 && history.location.state?.dish.dishName[0].name || history.location.state?.dish?.dish?.length > 0 && history.location.state?.dish?.dish}</div></Title>
                                </div>
                            </Title>
                        </div>
                    </div>
                </div>
                {type !== 'nutrition profile' && <div style={{
                    width: "100%",
                    paddingLeft: 24,
                    paddingRight: 6,
                    paddingTop: 0
                }} id="comfort-header-nav" className="restaurant-view__links"> 
                    {
                        navbar.map(m => {
                            return <div
                                className={"restaurant-view__link-items"}
                                style={{border: '1px solid #F2F2ED', borderRadius: '16px', width: '100%', marginLeft: '0', padding: '14px 16px'}}
                                onClick={() => {
                                    // type = m;
                                    if(m !== 'Similar Dishes' && m !== 'Restaurant'){
                                        let pathname = history.location.pathname;
                                        pathname = pathname.substr(0,pathname.lastIndexOf("/"))
                                        history.push(`${pathname}/${m.toLowerCase()}`, history.location.state)
                                    }
                                    else{
                                        if(type !== m){
                                            scrollIntoViewWithOffset(m.toLowerCase(), 300)
                                        }
                                    }
                                }}>
                                <div style={{width: '100%', whiteSpace: 'nowrap'}}><Title level={'subHeading'}>{m}</Title></div>
                            </div>
                        })
                    }
                </div>}
                <div id="line" style={{height: '1px', background: '#F2F2ED'}}></div>
                {type === "restaurant" &&
                <div className="restaurants__list--wrapper" style={{paddingLeft: "24px", paddingRight: "24px", paddingTop: '24px'}}>
                    <div id={'restaurant'} style={{paddingBottom: '24px'}}><Title level={3}>Restaurants</Title></div>
                    {
                        restaurants.map(res => (
                            <RestaurantCard
                                img={res?.image?.[0] ?? getRestImage(0)}
                                tagNames={[(res?.time !== -1) ? `${res?.time} away` : 'Not Reachable', (res?.distance !== -1) ? `${parseFloat(res?.distance?.toFixed(2))} miles away` : 'Not Reachable']}
                                onClick={() => {
                                    next(res)
                                }}
                                name={res.restaurantName}
                                dishPrice={res.restaurant_menu?.price}
                            />
                        ))
                    }
                <div id={'similar dishes'} style={{paddingBottom: '24px'}}><Title level={3}>Similar Dishes</Title></div>
                    <Carousel>
                        <div className="dishes__carousel-items">
                            {
                                dishes.map(res => (
                                    <SimpleCard img={res?.imageUrl?.[0] ?? getImage(0)}
                                        footerText={res.dish} onClick={() => {
                                                    console.log(res.image?.[0])
                                        history.push(`/restaurants/${res.recipeId}/restaurant`, {dish: {...res, image: res?.image ?? getImage(0)}})
                                    }}/>
                                ))
                            }
                        </div>
                    </Carousel>
                </div>}
                {/* {type === "similar dishes" && <div className="restaurants__carousel-wrapper" style={{paddingLeft: "24px"}}>
                </div>} */}
                {/* {type === "sensory profile" && <div className="restaurants__carousel-wrapper">
                </div>}
                {type === "similar dishes" && <div className="restaurants__carousel-wrapper">
                    <div className="dishes__carousel-wrapper" style={{overflow: 'scroll'}}>
                        {
                            dishes.length > 0 &&
                            <Carousel>
                                <div className="dishes__carousel-items">
                                    {
                                        dishes.map(res => (
                                            <SimpleCard img={res?.imageUrl?.[0] ?? getImage(0)}
                                            footerText={res.dish} onClick={() => {
                                                history.push(`/restaurants/${res.recipeId}/restaurant`, {dish: {...res, image: res?.image ?? getImage(0)}})
                                            }}/>
                                        ))
                                    }
                                </div>
                            </Carousel>
                        }
                    </div>
                </div>} */}
                {type === "sensory profile" && <div className="restaurants__carousel-wrapper" style={{paddingLeft: "24px", paddingRight: "24px"}}>
                    <Redirect to={"/sensory-profile/"+props.match.params.id+"/"+history.location.state.dish.recipeId}/>
                    {/*{
                        <SensoryTag sensoryTags={sensoryTags.slice(0, sensoryTags.length / 2)}
                                    setSelectedSensory={setSelectedSensory}/>
                    }
                    {
                        selectedSensory > -1 && <div>
                            <h3 style={{
                                color: "#4B4B4B",
                                paddingTop: "10px",
                                textTransform: "capitalize"
                            }}>{sensoryTags[selectedSensory]}</h3>
                            <div style={{color: "#4B4B4B", padding: "10px 0"}}>The content related to spicy would come
                                here in context to the dish selected
                            </div>
                        </div>
                    }
                    {
                        <SensoryTag sensoryTags={sensoryTags.slice(sensoryTags.length / 2)}
                                    setSelectedSensory={(index) => setSelectedSensory(parseInt(sensoryTags.length / 2) + index)}/>
                    }*/}
                </div>}
            </div>}
            {!loading && type === "nutrition profile" && <div className="restaurants__carousel-wrapper m-0">
                {/* Nutritional Info */}
                <div className="nutri-wrapper">
                    {state.optionGroups.nutritional.map((e) => !["serving_size", "yield"].includes(e.name) && e?.element)}
                </div>
            </div>}
        </div>
    );
};

const Nutrition = ({index}) => {
    const colors = ["#DBEF06", "#344569", "#FC7647", "#7163AC", "#ACD9D6", "#F5BE4F"];
    return (

        <>
            <svg width="199" height="265" viewBox="0 0 199 265" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M144.179 48.7543C155.802 63.0055 164.332 79.5202 169.224 97.2476L159.585 99.9081C156.608 89.1238 152.153 78.7418 146.299 69.0701C133.948 48.6623 115.906 32.305 94.3893 22.0058C72.8726 11.7066 48.817 7.91367 25.1751 11.0927C16.0389 12.3212 7.11806 14.5702 -1.43008 17.7688L-4.93457 8.40298C12.2893 1.95814 30.6662 -0.830694 49.0267 0.213957C67.3872 1.25861 85.3292 6.11386 101.711 14.4708C118.093 22.8276 132.555 34.5032 144.179 48.7543Z"
                      fill={colors[index % colors.length] }/>

                <path fillRule="evenodd" clipRule="evenodd"
                      d="M-0.592687 247.541L-4.02881 256.932C12.3119 262.911 29.6702 265.613 47.055 264.883C64.4399 264.154 81.5108 260.007 97.2932 252.681L93.0824 243.61C90.8701 244.637 88.6232 245.6 86.3444 246.497C64.1457 255.229 39.8803 257.29 16.5266 252.427C10.6859 251.211 4.96573 249.575 -0.592687 247.541Z"
                      fill={colors[(5 + index) % colors.length]}/>

                <path fillRule="evenodd" clipRule="evenodd"
                      d="M89.0229 245.406L92.9024 254.623C113.498 245.954 131.567 232.217 145.428 214.69L137.585 208.487C124.782 224.676 108.082 237.384 89.0229 245.406Z"
                      fill={colors[(4 + index) % colors.length]}/>
                <path id="strokes"
                      d="M164.97 164.469C164.073 160.219 180.411 153.758 180.015 148.277C179.819 145.832 159.755 143.539 159.778 140.222C159.794 137.581 179.87 135.515 180.115 132.396C180.325 129.672 160.772 124.582 161.213 121.549C161.61 118.814 181.751 119.516 182.409 116.547C183.003 113.818 164.97 105.469 164.47 95.9687"
                      stroke={colors[(2 + index) % colors.length]} strokeWidth="8" strokeLinecap="round"
                      strokeLinejoin="round"/>
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M159.585 99.908L169.225 97.2474C162.764 73.8418 149.997 52.6613 132.317 36.019L125.463 43.3006C133.502 50.8676 140.523 59.5258 146.299 69.0699C152.153 78.7416 156.608 89.1237 159.585 99.908Z"
                      fill={colors[(1 + index) % colors.length]}/>

                <path fillRule="evenodd" clipRule="evenodd"
                      d="M136.191 210.216L143.921 216.56C156.355 201.411 165.273 183.691 170.033 164.68L160.332 162.251C156.664 176.902 150.3 190.821 141.49 203.269C139.803 205.652 138.035 207.969 136.191 210.216Z"
                      fill={colors[(3 + index) % colors.length]}/>


                <circle cx="131" cy="131" r="12" fill={colors[(2 + index) % colors.length]}/>
            </svg>


        </>
    )
}

export default Restaurants;

