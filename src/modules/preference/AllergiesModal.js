
import { useEffect, useState } from "react"
import { getSelectedText } from "../onboarding/components/UserFoodAllergic"
import Button from "../../components/buttons"
import { Popup } from "../../components/Popup"
import _ from "lodash"
import { baseUrl } from "../../config/api-config"
import axios from "axios"
import {useDispatch} from "react-redux";
import {fetchSwipingDishes} from "../home/redux/actions";


const AllergiesModal = ({ modal, onClick, allergyList, useInfo, getUserDetails }) => {
    
    const [allergyData, setAllergyData] = useState([])
    const [allergyNone, setAllergyNone] = useState(false)
    const dispatch = useDispatch()
    useEffect(() => {
        setAllergyData(useInfo.parentAllergies)
    }, [useInfo])

    const UpdateAllergies = (id) => {
        if (id === 'none') {
            setAllergyData([])
            return setAllergyNone(true)
        }
        setAllergyNone(false)
        if (_.includes(allergyData, id)) {
            const updatedAllergies = _.remove(allergyData, (allergy) => allergy !== id)
            setAllergyData(updatedAllergies)
        } else {
            setAllergyData([...allergyData, id])
        }
    }

    const UpdateUserAllergies = async () => {
        try {
            await axios.post(`${baseUrl}/user/editUserAllergy`, { allergies: allergyData }).then(() => {
                getUserDetails()
            }).then(() => {
                onClick()
                dispatch(fetchSwipingDishes())

            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(!allergyData?.length) {
           setAllergyNone(true) 
        }else{
            setAllergyNone(false)    
        }
    }, [allergyData])
    


    return (
        <>
            <Popup show={modal == 'allergies'} title='Your allergies'>
                <div onClick={onClick} className="tab-popup-btn"></div>
                <div className="position-relative popup-body-content-wrapper" style={{height: '100%'}}>
                    <div style={{ flex: 2, overflow: 'scroll' }}>
                        <div style={{ paddingBottom: 24 }}>
                            {allergyList.map((allergy, index) => {
                                const isActiveAllergy = _.includes(allergyData, allergy?._id)
                                return (
                                    <>
                                        {index == 0 &&
                                            <div key={allergy?._id} style={{ marginTop: 24, lineHeight: 21, display: 'flex', alignItems: 'center', textTransform: 'capitalize' }}>
                                                <span
                                                    className={"restaurant-view__link-items food-preference-modal-link sub-heading" + (allergyNone ? " restaurant-view__link-items--active" : " link-disable-text")}
                                                    onClick={() => UpdateAllergies('none')}
                                                >
                                                    {getSelectedText({ parentAllergy: 'None' }, allergyNone )}
                                                </span>
                                            </div>}
                                        <div key={allergy?._id} style={{ marginTop: 24, lineHeight: 21, display: 'flex', alignItems: 'center', textTransform: 'capitalize' }}>
                                            <span
                                                className={"restaurant-view__link-items food-preference-modal-link sub-heading" + (isActiveAllergy ? " restaurant-view__link-items--active" : " link-disable-text")}
                                                onClick={() => UpdateAllergies(allergy?._id)}
                                            >
                                                {getSelectedText({ parentAllergy: allergy?.parentAllergy }, isActiveAllergy)}
                                            </span>
                                        </div>
                                    </>
                                )
                            })}
                        </div>
                    </div>
                    <div style={{height: 74, }} className="food-preference-submit-btn justify-content-end">
                        <Button onClick={UpdateUserAllergies} variant="primary" caption={'Select'} />
                    </div>
                </div>
            </Popup>
        </>
    )
}

export default AllergiesModal