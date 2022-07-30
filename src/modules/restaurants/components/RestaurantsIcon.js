import React, {useEffect, useState} from "react";
import {vibrate} from "../../onboarding/components/FoodtypeSelector";
import {useHistory} from "react-router-dom";

export const RestaurantsIcon = ({option, selectOptions=["Ratings", "Sensory Profile", "Nutritional Info", "Similar Dishes", "Restaurant"]}) => {
    const history = useHistory();
    const [type, setType] = useState(option);
    const [fingerPos, setFingerPos] = useState([65,700]);

    function onTypeSelected(evt) {
        vibrate();
        setType(evt.target.id)
        setFingerPos([evt.target.x.baseVal.value-85, evt.target.y.baseVal.value-70]);
        let pathname = history.location.pathname;
        pathname = pathname.substr(0,pathname.lastIndexOf("/"))
        history.push(`${pathname}/${evt.target.id.toLowerCase()}`, history.location.state)
    }

    return (
        <svg
            viewBox="0 100 500 900"
            xmlns="http://www.w3.org/2000/svg"
            width={"140%"}
            height={"140%"}
        >
            <BigLine2 d={"M 440 470 L250 340 L80 470 L40 630 L170 790"} fx={fingerPos[0]} fy={fingerPos[1]}/>
            <g id={"non-veg"}>
                <image
                    id={selectOptions[0]}
                    href={type === selectOptions[0] ? "/assets/starlinkselected.svg" : "/assets/starlink.svg"}
                    x="420"
                    y="450"
                    onClick={onTypeSelected}
                    width={"10%"}
                    style={{zIndex: 5}}
                />
                <text x="410" y="530" fontSize="1.5rem" fontFamily="FoundersGrotesk" stopColor={"white"} fill="white" id={"Ratings"} onClick={onTypeSelected}>
                    {selectOptions[0]}
                </text>
                <image
                    id={selectOptions[1]}
                    href={type === selectOptions[1] ? "/assets/starlinkselected.svg" : "/assets/starlink.svg"}
                    x="230"
                    y="320"
                    onClick={onTypeSelected}
                    width={"10%"}
                    style={{zIndex: 5}}
                />
                <text x="290" y="350" fontSize="1.5rem" fontFamily="FoundersGrotesk" stopColor={"white"} fill="white" id={"Sensory Profile"} onClick={onTypeSelected}>
                    {selectOptions[1]}
                </text>
                <image
                    id={selectOptions[2]}
                    href={type === selectOptions[2] ? "/assets/starlinkselected.svg" : "/assets/starlink.svg"}
                    x="50"
                    y="450"
                    onClick={onTypeSelected}
                    width={"10%"}
                    style={{zIndex: 5}}
                />
                <text x="110" y="480" fontSize="1.5rem" fontFamily="FoundersGrotesk" stopColor={"white"} fill="white" id={"Nutritional Info"} onClick={onTypeSelected}>
                   {selectOptions[2]}
                </text>
                <image
                    id={selectOptions[3]}
                    href={type === selectOptions[3] ? "/assets/starlinkselected.svg" : "/assets/starlink.svg"}
                    x="10"
                    y="600"
                    onClick={onTypeSelected}
                    width={"10%"}
                    style={{zIndex: 5}}
                />
                <text x="70" y="630" fontSize="1.5rem" fontFamily="FoundersGrotesk" stopColor={"white"} fill="white" id={"Similar Dishes"} onClick={onTypeSelected}>
                    {selectOptions[3]}
                </text>
                <image
                    id={selectOptions[4]}
                    href={type === selectOptions[4] ? "/assets/starlinkselected.svg" : "/assets/starlink.svg"}
                    x="150"
                    y="770"
                    onClick={onTypeSelected}
                    width={"10%"}
                    style={{zIndex: 5}}
                />
                <text x="210" y="800" fontSize="1.5rem" fontFamily="FoundersGrotesk" stopColor={"white"} fill="white" id={"Restaurant"} onClick={onTypeSelected}>
                    {selectOptions[4]}
                </text>
            </g>

        </svg>
    )
};

const BigLine2 = ({d, type, fx = "65", fy = "700", showFinger = true}) => {
    return (
        <>
            <path
                d={d}
                stroke="url(#paint0_linearbig)"
                strokeWidth="5"
                fill={"none"}
                className="path"
            />
            <defs>
                <linearGradient
                    id="paint0_linearbig"
                    x1="440"
                    y1="470"
                    x2={150}
                    y2={770}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop
                        offset="0%"
                        stopColor={"#DAEF04"}
                    />
                    <stop
                        offset="60%"
                        stopColor={"#DAEF04"}
                    />
                    <stop
                        offset="100%"
                        stopColor={"#E4EAAE"}
                    />
                </linearGradient>
            </defs>
            {showFinger && <image
                href={"/assets/animate/VegHalftoneSelection.svg"}
                x={fx}
                y={fy}
                style={{height: "20%"}}
            />}
        </>
    );
};
