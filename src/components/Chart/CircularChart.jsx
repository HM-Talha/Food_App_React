import React from 'react'
import {
    CircularProgressbar,
    buildStyles
} from "react-circular-progressbar";


const CircularChart = ({ value }) => {
    const colors = ["#DD2E44", "#F6BF50", "#FCEA4C", "#DBEF06"]

    const getPathColor = val => {
        if (val <= 33) return colors[0]
        if (value > 33 && value <= 66) return colors[1]
        if (value > 66 && value <= 75) return colors[2]
        if (value > 75) return colors[3]
    }

    return (
        <CircularProgressbar
            value={value}
            strokeWidth={23}
            styles={buildStyles({
                pathColor: getPathColor(value),
                trailColor: 'rgba(255, 255, 255, 0.25)',
                strokeLinecap: "butt"
            })}
        />
    )
}

export default CircularChart