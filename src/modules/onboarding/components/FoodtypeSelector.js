// Copyright Pikky. 2021. All Rights Reserved.
// Project: Pikky
// Version: 1.0.1
// Author: Tejash JL
// Email: tejash@pikky.io
// Status: Development

import React, {useEffect, useState} from "react";
// import "./index.css";
import {useHistory} from "react-router-dom";
import "../styles/foodTypeSelector.scss"
import axios from "axios";
import {baseUrl} from "../../../config/api-config";
import Loader from "../../../components/loader/Loader";
import OnboardingLayout from "../../../components/layout/OnboardingLayout";
import {useDispatch, useSelector} from "react-redux";
import {setFoodTypes} from "../redux/actions";


export function vibrate() {
    // if (window.navigator.vibrate) {
    //     window.navigator.vibrate(10);
    // }
    window?.ReactNativeWebView?.postMessage("vibrate");
}

export function getTextEle(startPosition, yOffset, text, index) {
    let textEle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
    );
    if (text.length < 5) {
        startPosition += 15
    }

    textEle.setAttribute("x", -35 + (startPosition));
    textEle.setAttribute("y", 36 + yOffset);

    if(text == 'Pure Vegetarian') {
        textEle.setAttribute("x", -60 + (startPosition));
        textEle.setAttribute("y", 30 + yOffset);
    }

    if(text == 'Eggetarian') {
        textEle.setAttribute("x", -85 + (startPosition));
        textEle.setAttribute("y", -8 + yOffset);
    }

    if(text == 'Vegan') {
        textEle.setAttribute("x", -115 + (startPosition));
        textEle.setAttribute("y", 20 + yOffset);
    }

    if(text == 'Eat all') {
        textEle.setAttribute("x", -110 + (startPosition));
        textEle.setAttribute("y", 25 + yOffset);
    }

    if(text == 'Pescatarian') {
        textEle.setAttribute("x", -85 + (startPosition));
        textEle.setAttribute("y", -6 + yOffset);
    }


    console.log('texttext', text)

    if(text == 'lupin') {
        textEle.setAttribute("x", -14 + (startPosition));
        textEle.setAttribute("y", -6 + yOffset);
    }

    if(index == 2 && text == 'lupin') {
        textEle.setAttribute("x", -72 + (startPosition));
        textEle.setAttribute("y", -4 + yOffset);
    }

    if(text == 'nuts') {
        textEle.setAttribute("x", -56 + (startPosition));
        textEle.setAttribute("y", 26 + yOffset);
    }

    if(index == 0 && text == 'nuts') {
        textEle.setAttribute("x", -28 + (startPosition));
        textEle.setAttribute("y", -3 + yOffset);
    }

    if(index == 2 && text == 'nuts') {
        textEle.setAttribute("x", -84 + (startPosition));
        textEle.setAttribute("y", -2 + yOffset);
    }

    if(text == 'milk') {
        textEle.setAttribute("x", -84 + (startPosition));
        textEle.setAttribute("y", -4 + yOffset);
    }

    if(index == 0 && text == 'milk') {
        textEle.setAttribute("x", -24 + (startPosition));
        textEle.setAttribute("y", -4 + yOffset);
    }

    if(text == 'None') {
        textEle.setAttribute("x", -117 + (startPosition));
        textEle.setAttribute("y", 26 + yOffset);
    }

    if(text == 'Others') {
        textEle.setAttribute("x", -135 + (startPosition));
        textEle.setAttribute("y", -4 + yOffset);
    }

    if(text == 'egg') {
        textEle.setAttribute("x", -54 + (startPosition));
        textEle.setAttribute("y", 24 + yOffset);
    }

    if(text == 'seeds') {
        textEle.setAttribute("x", -12 + (startPosition));
        textEle.setAttribute("y", -3 + yOffset);
    }

    if(text == 'fish') {
        textEle.setAttribute("x", -84 + (startPosition));
        textEle.setAttribute("y", -3 + yOffset);
    }

    textEle.setAttribute("xml:space", "preserve");
    textEle.classList.add('body-text')
    textEle.textContent = pad(text, 10);
    return textEle;
}

export function getGroupEle() {
    return document.createElementNS("http://www.w3.org/2000/svg", "g");
}

export const pad = (str, length, char = "\u00A0") =>
    str.padStart((str.length + length) / 2, char).padEnd(length, char);

export function getImageEle(foodType, onSubTypeSelected, startPosition, yOffset, type, index) {
    let imageEle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "image"
    );
    if (foodType === "veg") {
        imageEle.setAttribute("href", "./assets/animate/vegSmallUnSelected.svg");
    } else {
        imageEle.setAttribute("href", "./assets/animate/nonVegSmallUnSelected.svg");
    }
    imageEle.setAttribute("x", "" + (startPosition + 10));
    imageEle.setAttribute("y", 100 + yOffset);
    imageEle.setAttribute("width", "8%");
    imageEle.setAttribute("opacity", "0");
    imageEle.onclick = (evt) => {
        if (!("firstClick" in evt)) {
            onSubTypeSelected(type, index);
        }
    };
    return imageEle;
}

export function getFadeAnimation() {
    let fade = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "animate"
    );
    fade.setAttribute("attributeName", "width");
    fade.setAttribute("begin", "click");
    fade.setAttribute("dur", "0.5s");
    fade.setAttribute("restart", "never");
    fade.setAttribute("fill", "freeze");
    fade.setAttribute("repeatCount", "1");
    return fade;
}
function useForceUpdate() {
    let [value, setState] = useState(true);
    return () => setState(!value);
}
function FoodTypeSelector() {
    let forceUpdate = useForceUpdate();
    const vegSubTypes = [
        {type: "Pure Vegetarian", id: "pure vegetarian", curve: "250,350 100,400"},
        {
            type: "Eggetarian",
            id: "eggetarian",
            curve: "250,450 260,425",
        },
        {type: "Vegan", id: "vegan", curve: "250,350 393,400"},
    ];
    const nonVegSubTypes = [
        {type: " Halal", id: "halal", curve: "250,350 100,400"},
        {type: "Pescatarian", id: "pescatarian", curve: "250,450 260,425"},
        {type: "Eat all", id: "meat base", curve: "250,350 393,400"},
    ];
    const history = useHistory();
    const {foodType: ft, subFoodType: sft} = useSelector(state => state.onboarding)
    const [foodType, setFoodType] = useState(ft);
    const [loading, setLoading] = useState(true);
    const [subFoodTypeSelected, setSubFoodTypeSelected] = useState("");
    const [subFoodTypes, setSubFoodTypes] = useState([]);
    const [linePath, setLinePath] = useState("M 250 1200 L250 800");
    const [subTypeLinePath, setSubTypeLinePath] = useState("");
    const [subTypePosition, setSubTypePosition] = useState([]);
    useEffect(() => {
        setTimeout(() => {
            // document.getElementById("line-path").classList.remove("d-none")
            // document.getElementById("line-path").classList.add("path")
        }, 250);
    }, [linePath]);


    useEffect(() => {
        setTimeout(() => {
            const subTypesEle = document.getElementById("subTypes");
            if (subTypesEle) {
                if (subFoodTypes.length > 0) {
                    let offset = parseInt(400 / subFoodTypes.length);
                    let startPosition = 100;
                    let yOffset = 70;
                    subFoodTypes.forEach((type, index) => {
                        let groupEle = getGroupEle();
                        let imageEle = getImageEle(foodType, onSubTypeSelected, startPosition, yOffset, type, index);
                        let textEle = getTextEle(startPosition, yOffset, type.type);
                        let fadeIn = getFadeAnimation().cloneNode(true);
                        fadeIn.setAttribute("attributeName", "opacity");
                        fadeIn.setAttribute("from", "0");
                        fadeIn.setAttribute("to", "1");
                        fadeIn.setAttribute("begin", "click");
                        imageEle.appendChild(fadeIn);
                        groupEle.appendChild(textEle);
                        groupEle.appendChild(imageEle);
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
        }, 50);
    }, [subFoodTypes]);

    async function getUserDetails() {
        try {
            const res = await axios.get(`${baseUrl}/user/get/one`)
            if ("age" in res.data.data && res.data.data.age !== "") {
                history.push("/home")
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setLoading(false)
        if (ft && sft) {

            mainFoodTypeClick({
                target: {
                    id: ft,
                    parentElement: {
                        id: ft
                    }
                }
            }, true);

            setTimeout(() => {


                vegSubTypes.find((type, index) => {
                    if (type.id === sft) {
                        onSubTypeSelected(type, index, false)
                        return true;
                    }
                    return false;
                });
                nonVegSubTypes.find((type, index) => {
                    if (type.id === sft) {
                        onSubTypeSelected(type, index, false)
                        return true;
                    }
                    return false;
                })
            }, 1000)
        }
    }, [])

    function onSubTypeSelected(type, index, goNext=true) {
        const subTypesEle = document.getElementById("subTypes");
        subTypesEle.childNodes.forEach((ele) => {
            if (foodType === "veg") {
                ele.children[1].setAttribute("href", "./assets/animate/vegSmallUnSelected.svg");
            } else {
                ele.children[1].setAttribute(
                    "href",
                    "./assets/animate/nonVegSmallUnSelected.svg"
                );
            }
            // ele.children[1].setAttribute("href","./assets/animate/btn.svg")
        });
        const selectedTypeEle = subTypesEle.children[index].children[1];
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
        setTimeout(() => {

            selectedTypeEle.dispatchEvent(event);
        }, 1)
        const x1 = parseInt(selectedTypeEle.attributes.x.value);
        const y1 = parseInt(selectedTypeEle.attributes.y.value);
        setSubTypeLinePath(`M250, 720 C${type.curve} ${x1 + 15}, ${y1 + 30}`);
        setSubFoodTypeSelected(type.id);
        setSubTypePosition([x1 + 25, y1 + 35]);
        vibrate();
        if (goNext) {
            // onNext(type.id)
        }
    }

    function applyAnimations(
        mainElement,
        secondaryElement,
        mainText,
        secondaryText,
        fadeOut,
        fadeIn,
        slide,
        type
    ) {
        secondaryElement.appendChild(fadeOut);
        mainElement.appendChild(fadeIn);
        slide.setAttribute("from", mainElement.attributes.x.value);
        slide.setAttribute("to", 225);
        mainElement.appendChild(slide.cloneNode(true));
        let textSlide = slide.cloneNode(true);
        if (type === "veg") {
            textSlide.setAttribute("to", 180);
        } else {
            textSlide.setAttribute("to", 180);
        }
        mainText.appendChild(textSlide);
        let textFade = fadeOut.cloneNode(true);
        textFade.setAttribute("attributeName", "font-size");
        secondaryText.appendChild(textFade);
    }


    function mainFoodTypeClick(evt, force=false) {
        setFoodType(evt.target.id);
        if (foodType === "" || force) {
            const vegEleImg = document.getElementById("veg").firstChild;
            const vegEleText = document.getElementById("veg").lastChild;
            const nonVegEleImg = document.getElementById("non-veg").firstChild;
            const nonVegEleText = document.getElementById("non-veg").lastChild;
            let fade = getFadeAnimation();
            fade.setAttribute("dur", "0.2s");
            let slide = fade.cloneNode(true);
            slide.setAttribute("attributeName", "x");

            let fadeIn = fade.cloneNode(true);
            fadeIn.setAttribute("attributeName", "opacity");
            fadeIn.setAttribute("from", "0.25");
            fadeIn.setAttribute("to", "1");
            fadeIn.setAttribute("dur", ".5s");

            let fadeOut = fade.cloneNode(true);
            fadeOut.setAttribute("to", "0%");

            if (evt.target.parentElement.id === "veg") {
                applyAnimations(
                    vegEleImg,
                    nonVegEleImg,
                    vegEleText,
                    nonVegEleText,
                    fadeOut,
                    fadeIn,
                    slide,
                    evt.target.parentElement.id
                );


                setSubFoodTypes(vegSubTypes);
            } else {
                applyAnimations(
                    nonVegEleImg,
                    vegEleImg,
                    nonVegEleText,
                    vegEleText,
                    fadeOut,
                    fadeIn,
                    slide,
                    evt.target.parentElement.id
                );
                // setSubFoodTypes([
                //     {type: "Chicken", curve: "250,550 100,600"},
                //     {
                //         type: "Mutton",
                //         curve: "250,650 327,625",
                //     },
                // ]);
                /*setSubFoodTypes([
                    {type: "Halal", id: "halal", curve: "250,550 100,600"},
                    {
                        type: "Kosher", id: "kosher",
                        curve: "250,650 260,625",
                    },
                    {type: "Pescatarian", id: "pescatarian", curve: "250,550 393,600"},
                    {type: "Eat all", id: "all", curve: "250,550 393,600"},
                ]);*/

                setSubFoodTypes(nonVegSubTypes);
            }
            setTimeout(() => {
                vegEleImg.dispatchEvent(new Event("click"));
                vegEleText.dispatchEvent(new Event("click"));
                nonVegEleImg.dispatchEvent(new Event("click"));
                nonVegEleText.dispatchEvent(new Event("click"));
            }, 1);

            // document.getElementById("line-path").classList.remove("path")
            // document.getElementById("line-path").classList.add("d-none")
            setLinePath(linePath.substr(0, linePath.length - 3) + "650");
            vibrate();
        }
    }

    function reset() {
        vibrate();
        window.location.reload();
    }

    const dispatch = useDispatch();

    function onNext() {

        dispatch(setFoodTypes({foodType, subFoodType: subFoodTypeSelected}))
        history.push("/step-6");
        // setTimeout(() => {
        // }, 0)
    }

    const [show, setShow] = useState(true)
    const [key, setKey] = useState(0);

    function reset() {
        setFoodType("")
        setKey(k => k + 1)
        setSubTypeLinePath("");
        setLinePath("M 250 1200 L250 900");
        dispatch(setFoodTypes({foodType: "", subFoodType: ""}))
    }

    return (
        <div className="food-type pt-0" key={key} index={key}>
            {loading && <Loader loading={loading} isComponent/>}
            {/*<img src={ReloadSvg} style={{position: "absolute", width: "2rem", height: "3rem", left: "1rem"}}*/}
            {/*     onClick={reset}/>*/}
            {show ? <OnboardingLayout

                title={foodType === "" ? "I eat..." : "What do you eat?"}
                hideNext={true}
                disableNext={true}
                onNextClick={() => {
                }}
                onSearchText={(text) => {

                }}
                onSearchSelected={(item) => {

                }}
                className="food-type-selector-wrapper"
                hideSearch
                onBackClick={() => {
                    if (foodType!=="") {
                        reset();
                    } else {
                        history.goBack()
                    }
                }}
            >
                <svg
                    viewBox="0 0 500 1100"
                    xmlns="http://www.w3.org/2000/svg"
                    width={"100%"}
                    height={"100%"}
                >
                    {subTypeLinePath && (
                        <CurveLine
                            d={subTypeLinePath}
                            subTypePosition={subTypePosition}
                            type={foodType}
                        />
                    )}
                    <g id={"subTypes"}></g>
                    {foodType !== "" && <BigLine d={linePath} type={foodType}/>}
                    <g id={"veg"}>
                        <image
                            id={"veg"}
                            href={
                                foodType === "" ? "./assets/animate/vegInactive.svg" : "./assets/animate/vegSelected.svg"
                            }
                            x="90"
                            y={foodType !== "" ? "600" : "580"}
                            width={foodType !== "" ? "10%" : "18%"}
                            onClick={mainFoodTypeClick}
                            style={{zIndex: 5}}
                        />
                        
                        <text style={{transform: foodType !== "" && 'translate(-65px) scale(1.42)'}} className="body-text" x="52" y='490' xmlSpace={"preserve"}>
                            {("    " + "Vegetarian").slice(-12)}
                        </text>
                    </g>
                    <g id={"non-veg"}>
                        <image
                            id={"non-veg"}
                            href={
                                foodType === ""
                                    ? "./assets/animate/nonvegInactive.svg"
                                    : "./assets/animate/nonvegSelected.svg"
                            }
                            x="320"
                            y={foodType !== "" ? "600" : "580"}
                            width={foodType !== "" ? "10%" : "18%"}
                            onClick={mainFoodTypeClick}
                            style={{zIndex: 5}}
                        />
                        <text style={{transform: foodType !== "" && 'translate(-80px) scale(1.42)'}} className="body-text" x="205" y="490" >
                            Non-Vegetarian
                        </text>
                    </g>
                </svg>
                {foodType !== "" && <NextSvg onClick={onNext} active={subTypeLinePath !== ""}/>}
            </OnboardingLayout>:<div/>}
        </div>
    );
}

export default FoodTypeSelector

export const CurveLine = ({d, subTypePosition, type, showFinger = true}) => {
    return (
        <>
            <path
                key={d}
                d={d}
                stroke="url(#paint0_linear4)"
                fill="white"
                strokeWidth="6"
                className="path"
            />
            <defs>
                <linearGradient
                    id="paint0_linear4"
                    x1="250"
                    y1="700"
                    x2={subTypePosition[0]}
                    y2={subTypePosition[1]}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop
                        offset="0%"
                        stopColor={type === "non-veg" ? "#F5D4D8" : "#F6FF98"}
                    />
                    <stop
                        offset="80%"
                        stopColor={type === "non-veg" ? "#DD2E44" : "#DAEF04"}
                    />
                    <stop
                        offset="100%"
                        stopColor={type === "non-veg" ? "#DD2E44" : "#DAEF04"}
                    />
                </linearGradient>
            </defs>
            {showFinger && <image
                href={
                    type === "non-veg"
                        ? "./assets/animate/NonVegHalftoneSelection.svg"
                        : "./assets/animate/VegHalftoneSelection.svg"
                }
                x={subTypePosition[0] - 110}
                y={subTypePosition[1] - 120}
                style={{zIndex: -1, width: "40%"}}
            />}
        </>
    );
};

export const BigLine = ({d, type, fx = "150", fy = "530", showFinger = true}) => {
    return (
        <>
            <path
                d={d}
                stroke="url(#paint0_linearbig)"
                strokeWidth="8"
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
                        stopColor={type === "non-veg" ? "#DD2E44" : "#DAEF04"}
                    />
                    <stop
                        offset="10%"
                        stopColor={type === "non-veg" ? "#DD2E44" : "#DAEF04"}
                    />
                    <stop
                        offset="35%"
                        stopColor={type === "non-veg" ? "#DD2E44" : "#DAEF04"}
                    />
                    <stop
                        offset="50%"
                        stopColor={type === "non-veg" ? "#DD2E44" : "#DAEF04"}
                    />
                    <stop
                        offset="100%"
                        stopColor={type === "non-veg" ? "#F5D4D8" : "#F6FF98"}
                    />
                </linearGradient>
            </defs>
            {showFinger && <image
                href={
                    type === "non-veg"
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

export const NextSvg = ({
                            onClick = () => {
                            },
                            active = false
                        }) => {

    return <div className="food-type__footer" onClick={(e) => {
        active && onClick(e)
        vibrate()
    }}>
        {active ? <svg width="50" height="50" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z" fill="#DBEF06"/>
                <path d="M17 26L23 20L17 14" stroke="#292929" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            :
            <svg width="50" height="50" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z"
                    fill="#E2E4C8"/>
                <path d="M17 26L23 20L17 14" stroke="#292929" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round"/>
            </svg>
        }
    </div>
};

