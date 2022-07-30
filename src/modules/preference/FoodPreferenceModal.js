import { useState, Fragment, useEffect } from "react"
import { getSelectedText } from "../onboarding/components/UserFoodAllergic"
import Button from "../../components/buttons"
import { Popup } from "../../components/Popup"
import {useDispatch, useSelector} from "react-redux"
import axios from "axios";
import { baseUrl } from "../../config/api-config"
import _ from "lodash"
import {fetchSwipingDishes} from "../home/redux/actions";
import { Title } from "../../components/Fonts"


const vegetarian = [
    { type: "pure vegetarian", id: "pure vegetarian" },
    {
        type: "eggetarian",
        id: "eggetarian",
    },
    { type: "vegan", id: "vegan" },
];

const nonVegetarian = [
    { type: "halal", id: "halal" },
    { type: "pescatarian", id: "pescatarian" },
    { type: "eat all", id: "meat base" },
];

const FoodPreferenceModal = ({allergiesFiltered, modal, onClick, subCategory, setSubCategory, mainCategory, setMainCategory, getUserDetails }) => {
    const [preferenceTab, setPreferenceTab] = useState(mainCategory)
    const useInfo = useSelector(state => state)
    const dispatch = useDispatch();
    useEffect(async () => {

        if (mainCategory === 'veg') {
            return setPreferenceTab('vegetarian')
        }

        if (mainCategory === 'non-veg') {
            return setPreferenceTab('non-vegetarian')
        }


    }, [subCategory, mainCategory])

    const UpdateUserAllergies = async () => {
        try {
            await axios.post(`${baseUrl}/user/editUserAllergy`, { allergies: [] })
        } catch (error) {
            console.log(error)
        }
    }

    const updateUserSubCategory = async () => {
        try {
            await axios.post(`${baseUrl}/user/editUserCategory`, {
                subCategory: subCategory,
                mainCategory: mainCategory
            }).then(() => {
                UpdateUserAllergies()
            })
            .then(() => {
                getUserDetails()
            }).then(() => {
                allergiesFiltered()
            })
            .then(() => {
                onClick()
                dispatch(fetchSwipingDishes())
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Popup show={modal == 'food-preference'} title='What do you eat ?' height="402px">
                <div onClick={onClick} className="tab-popup-btn"></div>
                <div className="position-relative popup-body-content-wrapper">
                    <Fragment>
                        <Title className={'mt-8px'} level={'subHeading'} color="#8A8A87">Your food preferences</Title>

                        <div className="food-preference-tab">
                            <div className={`tab-overlay ${preferenceTab}`}></div>
                            <button className="sub-heading" onClick={() => setMainCategory('veg')}>Vegetarian</button>
                            <button className="sub-heading" onClick={() => setMainCategory('non-veg')}>Non-vegetarian</button>
                        </div>
                         <div className="pt-4px">
                            <div className="mb-24px">
                                {(
                                    ((preferenceTab === 'vegetarian' && vegetarian) ||
                                        (preferenceTab === 'non-vegetarian' && nonVegetarian)) || []
                                ).map(({ type }) => {
                                    const isActive = subCategory.toLowerCase() === type.toLowerCase()
                                    return (
                                        <div style={{ marginTop: 24, display: 'flex', lineHeight: 21, alignItems: 'center', textTransform: 'capitalize' }}>
                                            <span
                                                className={"restaurant-view__link-items food-preference-modal-link sub-heading" + (isActive ? " restaurant-view__link-items--active" : " link-disable-text")}
                                                onClick={() => { setSubCategory(type) }}
                                            >
                                                {getSelectedText({ parentAllergy: type }, isActive)}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div> 
                    </Fragment>

                    <div className="food-preference-submit-btn mb-0">
                        <Button onClick={updateUserSubCategory} variant="primary" caption={'Select'} />
                    </div>
                </div>
            </Popup>
        </>
    )
}

export default FoodPreferenceModal