import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import '../styles/imagine.scss';
import axios from "axios";
import { baseUrl } from "../../../config/api-config";
import ImagineIcon from '../../../assets/icons/imagineIcon.svg';
import ImagineBackground from '../../../assets/icons/imagineBackground.svg';
import { pikkyLogo } from "../../../assets/images";
import { BackIconVariant } from '../../../assets/icons';
import NutritionIcon from '../../../assets/icons/nutritionIcon.svg';
import IngredientIcon from '../../../assets/icons/ingredientIcon.svg';
import SensoryIcon from '../../../assets/icons/sensoryIcon.svg';
import UserChoice from "../../onboarding/components/UserChoice";
import { setUserDetails } from "../../../modules/home/redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { Popup } from "../../../components/Popup";
import RestaurantCard from "../../restaurants/components/RestaurantCard";

const Imagine = () => {
    const [showSplashScreen, setShowSplashScreen] = useState(true);
    const [selectedSensoryTags, setSelectedSensoryTags] = useState([]);
    const [selectedIngredientsTags, setSelectedIngredientsTags] = useState([]);
    const [selectedNutritionTags, setSelectedNutritionTags] = useState([]);
    const [unselectedSensoryTags, setUnselectedSensoryTags] = useState(['Energetic', 'Electrifying', 'Loud', 'Lively', 'Playful', 'Classy']);
    const [unselectedNutritionTags, setUnselectedNutritionTags] = useState(['Protein', 'Fibre', 'Probiotics']);
    const [unselectedIngredientsTags, setUnselectedIngredientsTags] = useState(['Chicken', 'Beef', 'Fish']);
    const [selectedSection, setSelectedSection] = useState('Sensory'); // There can be 3 states for this: Sensory, Ingredients and Nutrition.
    const [showPopup, setShowPopup] = useState(false);
    const [restaurants, setRestaurants] = useState([]);

    const { userDetails } = useSelector(state => state.home);

    const dispatch = useDispatch()
    const history = useHistory();
    const forceUpdate = useForceUpdate();

    async function getUserDetails() {
        if (Object.keys(userDetails).length === 0) {
            const res = await axios.get(`${baseUrl}/user/get/one`)
            dispatch(setUserDetails(res.data.data))
        }
    }

    useEffect(() => {
        getUserDetails();
        fetchRestaurants();
        setTimeout(() => {
            setShowSplashScreen(false);
        }, 2000);
    }, [])

    function useForceUpdate() {
        const [value, setValue] = useState(0);
        return () => setValue(value => value + 1);
    }

    function addSelectedTag(index) {
        let tempUnselectedTags;
        let tempSelectedTags;

        if (selectedSection === 'Sensory') {
            tempUnselectedTags = unselectedSensoryTags;
            tempSelectedTags = selectedSensoryTags;
        } else if (selectedSection === 'Ingredients') {
            tempUnselectedTags = unselectedIngredientsTags;
            tempSelectedTags = selectedIngredientsTags;
        } else if (selectedSection === 'Nutrition') {
            tempUnselectedTags = unselectedNutritionTags;
            tempSelectedTags = selectedNutritionTags;
        }

        tempSelectedTags.push(tempUnselectedTags.splice(index, 1)[0]);

        if (selectedSection === 'Sensory') {
            setUnselectedSensoryTags(tempUnselectedTags);
            setSelectedSensoryTags(tempSelectedTags);
        } else if (selectedSection === 'Ingredients') {
            setUnselectedIngredientsTags(tempUnselectedTags);
            setSelectedIngredientsTags(tempSelectedTags);
        } else if (selectedSection === 'Nutrition') {
            setUnselectedNutritionTags(tempUnselectedTags);
            setSelectedNutritionTags(tempSelectedTags);
        }

        forceUpdate();
    }

    function removeSelectedTag(index, tagOrigin) {
        let tempUnselectedTags;
        let tempSelectedTags;

        if (tagOrigin === 'Sensory') {
            tempUnselectedTags = unselectedSensoryTags;
            tempSelectedTags = selectedSensoryTags;
        } else if (tagOrigin === 'Ingredients') {
            tempUnselectedTags = unselectedIngredientsTags;
            tempSelectedTags = selectedIngredientsTags;
        } else if (tagOrigin === 'Nutrition') {
            tempUnselectedTags = unselectedNutritionTags;
            tempSelectedTags = selectedNutritionTags;
        }

        tempUnselectedTags.push(tempSelectedTags.splice(index, 1)[0]);

        if (tagOrigin === 'Sensory') {
            setUnselectedSensoryTags(tempUnselectedTags);
            setSelectedSensoryTags(tempSelectedTags);
        } else if (tagOrigin === 'Ingredients') {
            setUnselectedIngredientsTags(tempUnselectedTags);
            setSelectedIngredientsTags(tempSelectedTags);
        } else if (tagOrigin === 'Nutrition') {
            setUnselectedNutritionTags(tempUnselectedTags);
            setSelectedNutritionTags(tempSelectedTags);
        }

        forceUpdate();
    }

    async function fetchRestaurants() {
        const dish = {
            "Probability": 0.33,
            "dishId": "627f8c52eb18c40014e84b07",
            "dishName": [
                {
                    "name": "Agedashi Tofu"
                }
            ],
            "dishImgUrl": [],
            "cuisineInfo": [
                {
                    "nativeCuisine": "japanese"
                }
            ],
            "sensoryInfo": [
                "fermenty",
                "sour",
                "nutty"
            ]
        }
        const res = await axios.get(`${baseUrl}/restaurant/recipe-associate-restaurant?dishId=${dish.dishId}`, { timeout: 10000 });
        setRestaurants(res.data.data);
    }



    // The two functions above are simply for completing designs, eventually these nearby restaurants will be populated by a proper end point.

    return (
        <>
            <Popup show={showPopup} onHide={() => {
                setShowPopup(false)
            }} height={"95vh"} title={"Nearby restaurants"} showTopBar={true} customContainerClass="popupModalLayout" customTitleContainerStyles="popupTitleContainer" customChildrenStyles="popupBodyStyles">
                        {
                            restaurants.map((res, index) => (
                                <RestaurantCard
                                    key={index}
                                    img={res?.restaurantImg?.imageUrl?.[0] ?? getRestImage(0)}
                                    tagNames={[(res.time !== -1) ? `${res.time} drive` : 'Not Reachable', (res.distance !== -1) ? `${parseFloat(res.distance.toFixed(2))} miles away` : 'Not Reachable']}
                                    onClick={() => {
                                        goNext(res._id)
                                    }}
                                    name={res.restaurantName}
                                    dishPrice={res.restaurant_menu.price}
                                />
                            ))
                        }
            </Popup>
            {
                showSplashScreen
                    ? <div className="splashScreen">
                        <div className="yellowLine mt-auto mb-4" />
                        <img className="imagineIcon" src={ImagineIcon} />
                        <div className="yellowLine mt-4" />
                        <img className="pikkyLogo mt-auto" src={pikkyLogo} />
                    </div>
                    : <div className="mainContainer">
                        <div className='header'>
                            <BackIconVariant className='backIcon' onClick={() => { history.push('/home') }} />
                            <p className='imagineHeading'>Imagine</p>
                        </div>
                        <div className='body'>
                            <div className='dishContainer'>
                                {
                                    (selectedNutritionTags.length + selectedSensoryTags.length + selectedIngredientsTags.length) >= 1
                                        ? <UserChoice user={userDetails} setUser={(user) => { dispatch(setUserDetails(user)) }} hideExtendedInformation={true} />
                                        : <div className='dishImagineContainer'
                                            style={{
                                                backgroundImage: `url(${ImagineBackground})`,
                                                backgroundPosition: 'center',
                                                backgroundSize: 'auto',
                                                backgroundRepeat: 'no-repeat'
                                            }}>
                                            <p>Start imagining...</p>
                                        </div>
                                }
                            </div>
                            {
                                (selectedNutritionTags.length + selectedSensoryTags.length + selectedIngredientsTags.length) >= 1 &&
                                <div className="nearbyRestaurantsContainer mb-4" onClick={() => setShowPopup(true)}>
                                    <p>Nearby restaurants</p>
                                    <BackIconVariant className="forwardIcon" />
                                </div>
                            }
                            <div className="selectedTagsContainer">
                                {
                                    selectedSensoryTags.map((tag, index) => (
                                        <div className="tag" key={index} onClick={() => removeSelectedTag(index, 'Sensory')}>
                                            <p>{tag}</p>
                                        </div>
                                    ))
                                }
                                {
                                    selectedIngredientsTags.map((tag, index) => (
                                        <div className="tag" key={index} onClick={() => removeSelectedTag(index, 'Ingredients')}>
                                            <p>{tag}</p>
                                        </div>
                                    ))
                                }
                                {
                                    selectedNutritionTags.map((tag, index) => (
                                        <div className="tag" key={index} onClick={() => removeSelectedTag(index, 'Nutrition')}>
                                            <p>{tag}</p>
                                        </div>
                                    ))
                                }
                            </div>
                            <p className="sensoryTagsHeading my-4">{selectedSection} tags</p>
                            <div className="unselectedTagsContainer">
                                {
                                    selectedSection === 'Sensory' && unselectedSensoryTags.map((tag, index) => (
                                        <div className="tag" key={index} onClick={() => addSelectedTag(index)}>
                                            <p>{tag}</p>
                                        </div>
                                    ))
                                }
                                {
                                    selectedSection === 'Ingredients' && unselectedIngredientsTags.map((tag, index) => (
                                        <div className="tag" key={index} onClick={() => addSelectedTag(index)}>
                                            <p>{tag}</p>
                                        </div>
                                    ))
                                }
                                {
                                    selectedSection === 'Nutrition' && unselectedNutritionTags.map((tag, index) => (
                                        <div className="tag" key={index} onClick={() => addSelectedTag(index)}>
                                            <p>{tag}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="selectionBarContainer">
                            <div className="selectionBar">
                                <div className="d-flex flex-row">
                                    <div className="selectedSection" onClick={() => setSelectedSection('Nutrition')}>
                                        <img className='icon' src={NutritionIcon} />
                                    </div>
                                    <div className="selectedSection" onClick={() => setSelectedSection('Ingredients')}>
                                        <img className='icon' src={IngredientIcon} />
                                    </div>
                                    <div className="selectedSection" onClick={() => setSelectedSection('Sensory')}>
                                        <img className='icon' src={SensoryIcon} />
                                    </div>
                                </div>
                                <div className={`sectionSelectionIndicator${selectedSection}`} />
                            </div>
                        </div>
                    </div>
            }
        </>
    );
};
export const getRestImage = (index = 0) => {
    const images = [
        "https://pikky.s3.amazonaws.com/patterns/rest1.svg",
        "https://pikky.s3.amazonaws.com/patterns/rest2.svg",
        "https://pikky.s3.amazonaws.com/patterns/rest3.svg",
        "https://pikky.s3.amazonaws.com/patterns/rest4.svg",
        "https://pikky.s3.amazonaws.com/patterns/rest5.svg"
    ];
    return images[index % images.length]
};
export default Imagine;