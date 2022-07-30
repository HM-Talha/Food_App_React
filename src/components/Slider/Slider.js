import React from "react";
import sliderHead from "../../assets/images/slider-head.png"
import Slider, {createSliderWithTooltip} from "rc-slider";
import "rc-slider/assets/index.css";
import "./styles.scss"

const SliderWithTooltip = createSliderWithTooltip(Slider)

const CustomSlider = ({onChange, value, ...props}) => {
    function onStepChange(e) {
        document.getElementsByClassName("rc-slider-handle")[0]?.setAttribute("dataafter",e)
        "onStepChange" in props && props.onStepChange(e)
    }
    return (
        <SliderWithTooltip
            railStyle={{backgroundColor: "var(--bg-3)", height: "6px"}}
            trackStyle={{
                backgroundColor: "var(--highlight-primary)",
            }}
            onChange={onStepChange}
            onAfterChange={onChange}
            handleStyle={{
                width: "25px",
                height: "25px",
                marginTop: "-9px",
                backgroundImage: `url(${sliderHead})`,
                backgroundSize: "contain",
                border: "none",
                "&:after": {
                    content: "21"
                }
            }}
            dataafter="21"
            {...props}
        />
    );
};

export default CustomSlider;
