// Copyright Pikky. 2021. All Rights Reserved.
// Project: Pikky
// Version: 1.0.1
// Author: Tejash JL
// Email: tejash@pikky.io
// Status: Development

import React, {useEffect, useState} from "react";
import {
    BigLine,
    CurveLine,
    getTextEle,
    getGroupEle,
    getImageEle,
    getFadeAnimation,
    NextSvg,
    vibrate
} from "./FoodtypeSelector";
import "../styles/foodTypeSelector.scss";
import {AllergicFoodList} from "./UserFoodAllergic";
import {addOrRemoveAllergy, removeAllergy, setAllergies} from "../redux/actions";
import {useDispatch, useSelector} from "react-redux";

function getAllergyNodes(foodList) {
    let allergyNodes = []
    if (foodList.length >= 1) {
        allergyNodes = [{type: foodList[0].parentAllergy, _id: foodList[0]._id, curve: "230,550 260,600"}];
    }
    if (foodList.length >= 2) {
        allergyNodes = [...allergyNodes, {type: foodList[1].parentAllergy, _id: foodList[1]._id, curve: "250,650 260,625"}];
    }
    if (foodList.length >= 3) {
        allergyNodes = [{type: foodList[2].parentAllergy, _id: foodList[2]._id, curve: "230,650 260,625"}, ...allergyNodes];
    }
    if (foodList.length === 4) {
        allergyNodes = [{type: foodList[3].parentAllergy, _id: foodList[3]._id, curve: "230,620 100,600"}, ...allergyNodes];
    }
    allergyNodes = [...allergyNodes, {type: "None", _id: "None", curve: "250,650 260,625"}];
    if (foodList.length > 5) {
        allergyNodes = [...allergyNodes, {type: "Others", curve: "250,650 260,625"}];
    }
    return allergyNodes;
}

export const AllergiesSelector = ({ foodList,selectFood, onConfirm, selectedFood, onNextClick}) => {
    const [showOtherList, setShowOtherList] = useState(false);
    const [initialLoad, setInitialLoad] = useState(false);
    const [subFoodTypes, setSubFoodTypes] = useState(getAllergyNodes(foodList));
    useEffect(() => {
        if (!initialLoad) {
            setTimeout(() => {
                let otherSelected = false;
                selectedFood.forEach(sf => {
                    if (sf === "None") {
                        setNoneSelected(true)
                    }
                    const ele = document.getElementById(sf);
                    const index = ele === null ? 4 : parseInt(ele?.getAttribute("index"));
                    const type = subFoodTypes[index];
                    if (index <= 3) {
                        onSubTypeSelected(type, index)
                    }
                    if (index > 3 && !otherSelected) {
                        onSubTypeSelected(type, index)
                        otherSelected = true;
                    }
                })
                setInitialLoad(true);
            }, 1000)
        }

    }, [selectedFood]);

    const [foodType, setFoodType] = useState("veg");
    const [subFoodTypeSelected, setSubFoodTypeSelected] = useState([]);

    const [linePath, setLinePath] = useState("M 250 1200 L250 720");
    const [subTypeLinePath, setSubTypeLinePath] = useState(["","","", "", ""]);
    const [subTypePosition, setSubTypePosition] = useState([-100,-100]);
    const [noneSelected, setNoneSelected] = useState(false);
    const onOtherClick = () => {
        setShowOtherList(!showOtherList)
    };
    console.log(subTypeLinePath);
    const dispatch = useDispatch();
    useEffect(() => {
        setTimeout((selectedFood) => {
            const subTypesEle = document.getElementById("subTypes");
            if (subTypesEle) {
                if (subFoodTypes.length > 0) {
                    let offset = 100;
                    let startPosition = 30;
                    let yOffset = 200;
                    subFoodTypes.forEach((type, index) => {
                        let groupEle = getGroupEle();
                        let imageEle = getImageEle(foodType, onSubTypeSelected, startPosition, yOffset, type, index);
                        imageEle.onclick = (evt) => {
                            if (!("firstClick" in evt)) {

                                if (type.type === "Others") {
                                    onOtherClick()
                                    return
                                }

                                onSubTypeSelected(type, index);
                                if (type.type === "None") {
                                    setNoneSelected(status => !status)
                                    if (!noneSelected) {
                                        for (let i = 0; i < subFoodTypes.length; i++) {
                                            if (subFoodTypes[i].type !== "None") {
                                                onSubTypeSelected(subFoodTypes[i], i, true);
                                            }
                                        }
                                        dispatch(addOrRemoveAllergy("None"))
                                    }
                                } else {
                                    selectFood(type)
                                    for (let i = 0; i < subFoodTypes.length; i++) {
                                        if (subFoodTypes[i].type === "None") {
                                            onSubTypeSelected(subFoodTypes[i], i, true);
                                            dispatch(removeAllergy(subFoodTypes[i]._id))
                                        }
                                    }
                                }
                            }
                        };
                        let textEle = getTextEle(startPosition, yOffset, type.type, index);
                        textEle.setAttribute("style","text-transform: capitalize; transform: scale(1.42)")
                        let fadeIn = getFadeAnimation().cloneNode(true);
                        fadeIn.setAttribute("attributeName", "opacity");
                        fadeIn.setAttribute("from", "0");
                        fadeIn.setAttribute("to", "1");
                        fadeIn.setAttribute("begin", "click");
                        imageEle.appendChild(fadeIn);
                        groupEle.appendChild(textEle);
                        groupEle.appendChild(imageEle);
                        groupEle.setAttribute("id", type._id);
                        groupEle.setAttribute("index", index);
                        subTypesEle.appendChild(groupEle);
                        startPosition += offset;
                        yOffset = yOffset === 200 ? 100 : 200;
                    });
                    subTypesEle.childNodes.forEach((ele) => {
                        let event = new Event("click");
                        event.firstClick = true;
                        setTimeout(() => {

                        ele.childNodes[1].dispatchEvent(event);
                        }, 1)
                    });
                }
            }
        }, 50, selectedFood);
    }, []);

    function onSubTypeSelected(type, index, showUnSelected=false) {
        const subTypesEle = document.getElementById("subTypes");
        let ele = subTypesEle.children[index];
        if (ele.children[1].href.baseVal === "./assets/animate/vegSmallSelected.svg" || showUnSelected) {
            if (type.type === "Others" && !showUnSelected) {
                return
            }
            if (foodType === "veg") {
                ele.children[1].setAttribute("href", "./assets/animate/vegSmallUnSelected.svg");
            } else {
                ele.children[1].setAttribute(
                    "href",
                    "./assets/animate/nonVegSmallUnSelected.svg"
                );
            }
            setSubFoodTypeSelected(s => [...s].filter(a => a !== type.type))
            setSubTypeLinePath((s) => [...s].map((a, idx) => index !== idx ? a : ""))
            setSubFoodTypeSelected((s) => [...s].filter((a, idx) => index !== idx))
        } else {
            const selectedTypeEle = ele.children[1];
            if (foodType === "veg") {
                selectedTypeEle.setAttribute("href", "./assets/animate/vegSmallSelected.svg");
            } else {
                selectedTypeEle.setAttribute("href", "./assets/animate/nonVegSmallSelected.svg");
            }
            // selectedTypeEle.setAttribute("href","./assets/animate/btn-active.svg");
            let fadeIn = getFadeAnimation().cloneNode(true);
            fadeIn.setAttribute("attributeName", "opacity");
            fadeIn.setAttribute("from", "0");
            fadeIn.setAttribute("to", "1");
            fadeIn.setAttribute("begin", "click");
            selectedTypeEle.appendChild(fadeIn);
            let event = new Event("click");
            event.firstClick = true;
            setTimeout(()=> {
            selectedTypeEle.dispatchEvent(event);

            }, 1)
            const x1 = parseInt(selectedTypeEle.attributes.x.value);
            const y1 = parseInt(selectedTypeEle.attributes.y.value);
            setSubTypeLinePath((slps) => {
                const s = [...slps];
                s[index] = `M250, 720 C${type.curve} ${x1 + 15}, ${y1 + 30}`;
                return s;
            });
            setSubFoodTypeSelected(s => [...s].concat(type.type));
            setSubTypePosition([x1 + 25, y1 + 35]);
        }
        vibrate();
    }

    return (
        <div className="food-type">
            <div className="allergies">
                <svg
                    viewBox="0 0 500 1300"
                    xmlns="http://www.w3.org/2000/svg"
                    width={"82%"}
                    height={"100%"}
                    >
                    {subTypeLinePath && subTypeLinePath.map((p, index) => {
                        return  <CurveLine
                            key={index}
                            d={p}
                            subTypePosition={subTypePosition}
                            type={foodType}
                            showFinger={false}
                        />
                    }

                    )}
                    <g id={"subTypes"}></g>
                    {foodType !== "" && <BigLine2 d={linePath} type={foodType} showFinger={false}/>}
                </svg>
            </div>
            {<NextSvg onClick={() => {onNextClick(subFoodTypeSelected)}} active={selectedFood.length > 0}/>}
            <AllergicFoodList
                key={selectedFood}
                show={showOtherList}
                cancel={() => setShowOtherList(false)}
                foodList={foodList.slice(3)}
                selectedFood={selectedFood}
                onSelectFood={() => {}}
                onConfirm={(othersSelected) => {
                    onConfirm();
                    setShowOtherList(false);
                    const otherFoodsSelected = othersSelected.map(sf => foodList.slice(3).find( fl => fl._id===sf)).filter(s => !!s);
                    onSubTypeSelected(subFoodTypes[subFoodTypes.length - 1], subFoodTypes.length - 1, otherFoodsSelected.length===0);
                    if (noneSelected && otherFoodsSelected.length > 0) {
                        for (let i = 0; i < subFoodTypes.length; i++) {
                            if (subFoodTypes[i].type === "None") {
                                onSubTypeSelected(subFoodTypes[i], i, true);
                                selectFood(subFoodTypes[i])
                            }
                        }
                        setNoneSelected(false)
                        othersSelected = othersSelected.filter(o => o!== "None")
                    }
                    dispatch(setAllergies(othersSelected))
                }}
            />
        </div>
    )
};

const BigLine2 = ({d, type, fx = "150", fy = "630", showFinger = true}) => {
    return (
        <>
            <path
                d={d}
                stroke="url(#paint0_linearbig)"
                strokeWidth="6"
                fill={"none"}
                className="path"
            />
            <defs>
                <linearGradient
                    id="paint0_linearbig"
                    x1="250"
                    y1="1200"
                    x2="250"
                    y2="800"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop
                        offset="0%"
                        stopColor={type === "Nonveg" ? "#DD2E44" : "#DAEF04"}
                    />
                    <stop
                        offset="10%"
                        stopColor={type === "Nonveg" ? "#DD2E44" : "#DAEF04"}
                    />
                    <stop
                        offset="45%"
                        stopColor={type === "Nonveg" ? "#DD2E44" : "#DAEF04"}
                    />
                    <stop
                        offset="70%"
                        stopColor={type === "Nonveg" ? "#DD2E44" : "#DAEF04"}
                    />
                    <stop
                        offset="100%"
                        stopColor={type === "Nonveg" ? "#F5D4D8" : "#F6FF98"}
                    />
                </linearGradient>
            </defs>
            {showFinger &&<image
                href={
                    type === "Nonveg"
                        ? "./assets/animate/NonVegHalftoneSelection.svg"
                        : "./assets/animate/VegHalftoneSelection.svg"
                }
                x={fx}
                y={fy}
                style={{zIndex: -10, width: "40%"}}
            />}
        </>
    );
};
