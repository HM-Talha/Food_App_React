import React, {useEffect, useState} from "react";
import './index.css';
import {useHistory} from "react-router-dom";
import {vibrate} from "../../modules/onboarding/components/FoodtypeSelector";

export function FoodTypeSelector() {
    const [foodType, setFoodType] = useState("");
    const [subFoodTypeSelected, setSubFoodTypeSelected] = useState("");
    const [subFoodTypes, setSubFoodTypes] = useState([]);
    const [linePath, setLinePath] = useState("M 250 1200 L250 900");
    const [subTypeLinePath, setSubTypeLinePath] = useState("");
    const [subTypePosition, setSubTypePosition] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            // document.getElementById("line-path").classList.remove("d-none")
            // document.getElementById("line-path").classList.add("path")
        }, 250)

    }, [linePath]);

    const pad = (str, length, char = ' ') => str.padStart((str.length + length) / 2, char).padEnd(length, char);

    function getImageEle(startPosition, yOffset, type, index) {
        let imageEle = document.createElementNS("http://www.w3.org/2000/svg", 'image');
        if (foodType === "Veg") {
            imageEle.setAttribute("href", "./assets/vegSmallUnSelected.svg");
        } else {
            imageEle.setAttribute("href", "./assets/nonVegSmallUnSelected.svg");
        }
        imageEle.setAttribute("x", "" + startPosition);
        imageEle.setAttribute("y", 300 + yOffset);
        imageEle.setAttribute("width", "10%");
        imageEle.setAttribute("opacity", "0");
        imageEle.onclick = (evt) => {
            if (!("firstClick" in evt)) {
                onSubTypeSelected(type, index)
            }
        };
        return imageEle;
    }

    function getTextEle(startPosition, yOffset, text) {
        let textEle = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        textEle.setAttribute("x", "" + (startPosition + 15));
        textEle.setAttribute("y", 300 + yOffset);
        textEle.setAttribute("xml:space", "preserve");
        textEle.setAttribute("font-size", "1.5rem");
        // textEle.setAttribute("fill", "#DAEF04");
        // textEle.setAttribute("font-family", "#Verdana");
        textEle.textContent = pad(text, 10);
        return textEle;
    }

    function getGroupEle() {
        return document.createElementNS("http://www.w3.org/2000/svg", 'g');
    }

    useEffect(() => {
        setTimeout(() => {
            const subTypesEle = document.getElementById("subTypes");
            if (subTypesEle) {
                if (subFoodTypes.length > 0) {
                    let offset = parseInt(400 / subFoodTypes.length);
                    let startPosition = 100;
                    let yOffset = 80;
                    subFoodTypes.forEach((type, index) => {
                        let groupEle = getGroupEle();
                        let imageEle = getImageEle(startPosition, yOffset, type, index);
                        let textEle = getTextEle(startPosition - 10, yOffset, type.type);
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
                    subTypesEle.childNodes.forEach(ele => {
                        let event = new Event('click');
                        event.firstClick = true;
                        ele.childNodes[1].dispatchEvent(event);
                    })
                }
            }
        }, 50)
    }, [subFoodTypes]);

    function onSubTypeSelected(type, index) {
        const subTypesEle = document.getElementById("subTypes");
        subTypesEle.childNodes.forEach(ele => {
            if (foodType === "Veg") {
                ele.children[1].setAttribute("href", "./assets/vegSmallUnSelected.svg");
            } else {
                ele.children[1].setAttribute("href", "./assets/nonVegSmallUnSelected.svg");
            }
            // ele.children[1].setAttribute("href","./assets/btn.svg")
        });
        const selectedTypeEle = subTypesEle.children[index].children[1];
        if (foodType === "Veg") {
            selectedTypeEle.setAttribute("href", "./assets/vegSmallSelected.svg")
        } else {
            selectedTypeEle.setAttribute("href", "./assets/nonVegSmallSelected.svg")
        }
        // selectedTypeEle.setAttribute("href","./assets/btn-active.svg");
        let fadeIn = getFadeAnimation().cloneNode(true);
        fadeIn.setAttribute("attributeName", "opacity");
        fadeIn.setAttribute("from", "0");
        fadeIn.setAttribute("to", "1");
        fadeIn.setAttribute("begin", "click");
        selectedTypeEle.appendChild(fadeIn);
        let event = new Event('click');
        event.firstClick = true;
        selectedTypeEle.dispatchEvent(event);
        const x1 = parseInt(selectedTypeEle.attributes.x.value);
        const y1 = parseInt(selectedTypeEle.attributes.y.value);
        setSubTypeLinePath(`M250, 720 C${type.curve} ${x1 + 25}, ${y1 + 35}`);
        setSubFoodTypeSelected(type.type);
        setSubTypePosition([x1 + 25, y1 + 35]);
        vibrator();
    }

    function applyAnimations(mainElement, secondaryElement, mainText, secondaryText, fadeOut, fadeIn, slide, type) {
        secondaryElement.appendChild(fadeOut);
        mainElement.appendChild(fadeIn);
        slide.setAttribute("from", mainElement.attributes.x.value);
        slide.setAttribute("to", 215);
        mainElement.appendChild(slide.cloneNode(true));
        let textSlide = slide.cloneNode(true);
        if (type === "Veg") {
            textSlide.setAttribute("to", 200);
        } else {
            textSlide.setAttribute("to", 180);
        }
        mainText.appendChild(textSlide);
        let textFade = fadeOut.cloneNode(true);
        textFade.setAttribute("attributeName", "font-size");
        secondaryText.appendChild(textFade)
    }

    function vibrator() {
        vibrate()
    }

    function getFadeAnimation() {
        let fade = document.createElementNS("http://www.w3.org/2000/svg", 'animate');
        fade.setAttribute("attributeName", "width");
        fade.setAttribute("begin", "click");
        fade.setAttribute("dur", "0.5s");
        fade.setAttribute("restart", "never");
        fade.setAttribute("fill", "freeze");
        fade.setAttribute("repeatCount", "1");
        return fade;
    }

    function mainFoodTypeClick(evt) {
        setFoodType(evt.target.id);
        if (foodType === "") {

            const vegEleImg = document.getElementById("Veg").firstChild;
            const vegEleText = document.getElementById("Veg").lastChild;
            const nonVegEleImg = document.getElementById("Nonveg").firstChild;
            const nonVegEleText = document.getElementById("Nonveg").lastChild;
            let fade = getFadeAnimation();
            fade.setAttribute("dur", "0.1s");
            let slide = fade.cloneNode(true);
            slide.setAttribute("attributeName", "x");

            let fadeIn = fade.cloneNode(true);
            fadeIn.setAttribute("attributeName", "opacity");
            fadeIn.setAttribute("from", "0.25");
            fadeIn.setAttribute("to", "1");
            fadeIn.setAttribute("dur", ".5s");

            let fadeOut = fade.cloneNode(true);
            fadeOut.setAttribute("to", "0%");


            if (evt.target.parentElement.id === "Veg") {
                applyAnimations(vegEleImg, nonVegEleImg, vegEleText, nonVegEleText, fadeOut, fadeIn, slide, evt.target.parentElement.id);
                setSubFoodTypes([{type: "Lacto", curve: "250,550 100,600"}, {
                    type: "Egg",
                    curve: "250,650 260,625"
                }, {type: "Vegan", curve: "250,550 393,600"}])
            } else {
                applyAnimations(nonVegEleImg, vegEleImg, nonVegEleText, vegEleText, fadeOut, fadeIn, slide, evt.target.parentElement.id);
                setSubFoodTypes([{type: "Chicken", curve: "250,550 100,600"}, {
                    type: "Mutton",
                    curve: "250,650 327,625"
                }])
            }
            vegEleImg.dispatchEvent(new Event('click'));
            vegEleText.dispatchEvent(new Event('click'));
            nonVegEleImg.dispatchEvent(new Event('click'));
            nonVegEleText.dispatchEvent(new Event('click'));
            // document.getElementById("line-path").classList.remove("path")
            // document.getElementById("line-path").classList.add("d-none")
            setLinePath(linePath.substr(0, linePath.length - 3) + "750");
            vibrator();
        }
    }

    function reset() {
        vibrator();
        window.location.reload()
    }

    return (
        <div className="App">
            {/*<img src={ReloadSvg} style={{position: "absolute", width: "2rem", height: "3rem", left: "1rem"}}*/}
            {/*     onClick={reset}/>*/}
            <span style={{
                position: "absolute",
                left: "41%",
                top: "5%",
                fontSize: "2rem",
                fontWeight: "bold"
            }}>I am a</span>
            <svg viewBox="0 0 500 1000" xmlns="http://www.w3.org/2000/svg" width={"100%"} height={"100%"}>

                {subTypeLinePath && <Line4 d={subTypeLinePath} subTypePosition={subTypePosition} type={foodType}/>}
                <g id={"subTypes"}>

                </g>
                {
                    foodType !== "" && <Line2 d={linePath} type={foodType}/>
                }
                <g id={"Veg"}>
                    <image id={"Veg"} href={foodType === "" ? "./assets/veg.svg" : "./assets/vegSelected.svg"} x="100"
                           y="700" onClick={mainFoodTypeClick} width={"15%"}/>
                    <text x="80" y="790" fontSize="2rem"
                          xmlSpace={"preserve"}>{("    " + "Vegetarian").slice(-12)}</text>
                </g>
                <g id={"Nonveg"}>
                    <image id={"Nonveg"} href={foodType === "" ? "./assets/nonveg.svg" : "./assets/nonvegSelected.svg"}
                           x="300" y="700" onClick={mainFoodTypeClick} width={"15%"}/>
                    <text x="280" y="790" fontSize="2rem">Non-Vegetarian</text>
                </g>
                {subTypeLinePath !== "" && <NextSvg/>}
            </svg>

        </div>
    );
}

const Line4 = ({d, subTypePosition, type}) => {
    return (
        <>
            <path key={d} d={d} stroke="url(#paint0_linear4)" fill="white" strokeWidth="3" className="path"/>
            <defs>
                <linearGradient id="paint0_linear4" x1="250" y1="700" x2={subTypePosition[0]} y2={subTypePosition[1]}
                                gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={type === "Nonveg" ? "#F5D4D8" : "#F6FF98"}/>
                    <stop offset="80%" stopColor={type === "Nonveg" ? "#DD2E44" : "#DAEF04"}/>
                    <stop offset="100%" stopColor={type === "Nonveg" ? "#DD2E44" : "#DAEF04"}/>

                </linearGradient>
            </defs>
            <image
                href={type === "Nonveg" ? "./assets/NonVegHalftoneSelection.svg" : "./assets/VegHalftoneSelection.svg"}
                x={subTypePosition[0] - 100} y={subTypePosition[1] - 110} style={{zIndex: -1, width: "40%"}}/>
        </>
    )
};

const Line2 = ({d, type}) => {
    return (
        <>
            <path d={d} stroke="url(#paint0_linear)" strokeWidth="5" fill={"none"} className="path"/>
            <defs>
                <linearGradient id="paint0_linear" x1="250" y1="1200" x2="250" y2="800" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={type === "Nonveg" ? "#DD2E44" : "#DAEF04"}/>
                    <stop offset="10%" stopColor={type === "Nonveg" ? "#DD2E44" : "#DAEF04"}/>
                    <stop offset="45%" stopColor={type === "Nonveg" ? "#DD2E44" : "#DAEF04"}/>
                    <stop offset="50%" stopColor={type === "Nonveg" ? "#DD2E44" : "#DAEF04"}/>
                    <stop offset="100%" stopColor={type === "Nonveg" ? "#F5D4D8" : "#F6FF98"}/>

                </linearGradient>
            </defs>
            <image
                href={type === "Nonveg" ? "./assets/NonVegHalftoneSelection.svg" : "./assets/VegHalftoneSelection.svg"}
                x="150" y="640" style={{zIndex: -1, width: "40%"}}/>
        </>
    )
};

const NextSvg = () => {
    const history = useHistory();
    return (
        <svg width="15%" height="10%" viewBox="0 0 40 40" fill="none" x={"215"} y={"900"} onClick={() => {
            history.push("/i_grew_up_eating")
        }}>
            <rect width="40" height="40" rx="20" fill="#DAEF04"/>
            <path d="M17 26L23 20L17 14" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
};