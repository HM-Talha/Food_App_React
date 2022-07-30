import React from "react";

export const SensoryTag = ({sensoryTags, setSelectedSensory, className=""}) => {
    return (
        <div className={`sensory-wrapper ${className}`} style={{marginTop: "1rem"}}>
            {
                sensoryTags.map((t, index) => (
                    <div className="sensory-tag" style={{background: getSensoryColors(index)}}
                         onClick={() => setSelectedSensory(index)}>{t}</div>
                ))
            }
        </div>
    )
};

function getSensoryColors(index) {
    const colors = ["#FC7647", "#815FED", "#35D682", "#DD2E44", "#F6BF50"];
    return colors[index % colors.length]
}