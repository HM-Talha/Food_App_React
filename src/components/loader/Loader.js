import React, {useState} from "react";
import Lottie from "lottie-react";
import cx from "classnames"
import "./loader.scss";
import {useInterval} from "../customHooks/useInterval";
let loaderLottie = require('../../assets/lottie/FinallogoPIKKY.json');
const Loader = ({loading, isComponent}) => {
    const [state, setState] = useState(1);

    useInterval(() => {
        if (state >= 6) {
            setState(1);
        } else {
            setState(state + 1);
        }
    }, 500);

    if (!loading) return null;
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: loaderLottie,

    };
    // const { View } = useLottie(defaultOptions);
    return (
        <div className={cx("p-loader", {"p-loader--component": isComponent})}>

            <Lottie style={{width: "20%", height: "20%"}} animationData={loaderLottie} autoPlay={true} loop={true} />

        </div>
    );
};

export default Loader;
