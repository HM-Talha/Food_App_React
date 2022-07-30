import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import cx from "classnames";

import OnboardingLayout from "../../../components/layout/OnboardingLayout";

import Input from "../../../components/formInput/Input";
import Button from "../../../components/buttons";
import useBackdrop from "../../../components/customHooks/useBackdrop";
import "../styles/userFoodAllergic.scss";
import axios from "axios";
import { baseUrl } from "../../../config/api-config";
import { AllergiesSelector } from "./AllergiesSelector";
import Loader from "../../../components/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { addOrRemoveAllergy, setFullAllergyList } from "../redux/actions";
import { Popup } from "../../../components/Popup";
import { Text, Title } from "../../../components/Fonts";


const UserFoodAllergic = () => {
    const { allergies, subFoodType, allergyList } = useSelector(state => state.onboarding)

    // const [selectedFood, setSelectedFood] = useState(allergies);
    const [foodList, setFoodList] = useState([]);
    const [loading, setloading] = useState(false);
    const history = useHistory();

    async function fetchAllergies() {
        if (allergyList.length === 0) {
            const res = await axios.get(`${baseUrl}/cuisine/get-allergies`);
            dispatch(setFullAllergyList(res.data.data))
        }
    }

    useEffect(() => {
        fetchAllergies()
    }, []);

    useEffect(() => {
        const allergies = allergyList.filter(allergy => allergy.subCategory.includes(subFoodType));
        // const allergies = res.data.data;
        setFoodList(allergies.sort((a, b) => a.parentAllergy.length - b.parentAllergy.length))
    }, [allergyList]);


    const dispatch = useDispatch();

    function selectFood(item) {
        dispatch(addOrRemoveAllergy(item._id))
        if (item.type !== "None") {
        }
    }

    async function onNextClick(allergies) {
        setloading(true);
        history.push("/step-7");


    }

    function onConfirm() {

    }


    return (
        <OnboardingLayout
            title="I am allergic to"
            hideNext={true}
            hideSearch={true}
            onNextClick={onNextClick}
            disableNext={allergies.length < 3}
            className={"allergies-wrapper"}
        >
            <div className="user-food-allergic">
                {loading && <Loader loading={loading} isComponent />}
                {
                    !loading && foodList.length > 0 &&
                    <AllergiesSelector foodList={foodList} setFoodList={setFoodList} selectFood={selectFood}
                        onConfirm={onConfirm} selectedFood={allergies} onNextClick={onNextClick} />
                }
            </div>
        </OnboardingLayout>
    );
};
const leftIndex = {};

export function getSelectedText(item, active = true) {
    function getLeftStyle(len) {
        if (len in leftIndex) {
            return leftIndex[len]
        }
        const maxNum = 60, minNum = 0;
        let number = Math.floor(Math.random() * (maxNum - minNum) + minNum);
        leftIndex[len] = number
        return number;
    }

    return <span>
        { active ? 
            <Title level={'headLine'}>
                {item.parentAllergy}
                {active && <span className="backdrop" style={{ left: `${getLeftStyle(item.parentAllergy.length)}%` }} />}
            </Title>
            :
            <Text>
                {item.parentAllergy}
            </Text>
        }
            </span>;
}

export const AllergicFoodList = ({
    show,
    cancel,
    onConfirm,
    foodList,
    selectedFood,
}) => {

    const modalHeightRef = useRef(null)
    const [clientHeight, setClientHeight] = useState(0)
    const [search, setSearch] = useState("");
    const [othersSelected, onOtherSelected] = useState(selectedFood);
    useBackdrop({ addBackdrop: show, onClick: cancel});

    function handleChange(e) {
        setSearch(e.target.value);
    }

    useEffect(() => {
        if(modalHeightRef.current) {
            setClientHeight(modalHeightRef.current.clientHeight)
        }
    }, [modalHeightRef.current])

    return (
        <>
            <Popup show={show} title='You’re allergic to...' height={`${clientHeight + 74 + 52 + 32}px`}  >
                
            <div onClick={cancel} className="tab-popup-btn"></div>
                {/* <Input
                    className={'mt-24px body-text'}
                    name="search"
                    value={search}
                    onChange={handleChange}
                    placeholder="Search here..."
                /> */}
                <div className="position-relative popup-body-content-wrapper">
                    <div ref={modalHeightRef}>
                        <div style={{paddingBottom: 20}}>
                            {foodList
                                .filter((item) => item && item.parentAllergy.toLowerCase().indexOf(search.toLowerCase()) >= 0)
                                .map((item) => (
                                    <div
                                        key={item._id}
                                        className={cx("f-l__list--item sub-heading mt-24px", {
                                            "f-l__list--item-active": othersSelected.includes(item._id),
                                        })}
                                        onClick={() => {
                                            let newAllergies = [...othersSelected];
                                            if (newAllergies.includes(item._id)) {
                                                newAllergies = newAllergies.filter((c) => c !== item._id);
                                            } else {
                                                newAllergies.push(item._id);
                                            }
                                            onOtherSelected(newAllergies);
                                        }}
                                    >
                                        {getSelectedText(item, othersSelected.includes(item._id))}

                                    </div>
                                ))}

                        </div>
                    </div>
                    <div style={{height: 74, }} className="food-preference-submit-btn justify-content-end mb-0">
                        <div className="f-l__footer mt-24px">
                            <Button  style={{ width: 92, marginRight: 16 }} caption="Cancel" onClick={cancel} />
                            <Button style={{ width: 92 }} variant="primary" caption="Confirm" onClick={() => onConfirm(othersSelected)} />
                        </div>
                    </div>
                </div>
            </Popup>
        </>
    );
};

export default UserFoodAllergic;
