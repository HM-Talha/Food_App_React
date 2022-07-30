import React, { useRef, useEffect } from "react";
import {NavLink, Redirect, Route, Switch, useHistory, useParams, useRouteMatch} from "react-router-dom";
import '../styles/feedback.scss'
import { navbar } from "./template";
import { Title } from "../../../components/Fonts";
import { getSelectedText } from "../../onboarding/components/UserFoodAllergic";
import { scrollIntoViewWithOffset } from "../../../config/utils";

export const FeedbackNav = ({type}) => {
    const ref = useRef();
    const params = useParams()
    const history = useHistory();
    
    useEffect(() => {
        if (type === 'food'){
            console.log(type, 'type')
            ref.current.scrollLeft += 470;
        }
        if(type === 'dine') {
            ref.current.scrollLeft += 570
        }
    }, [])
    
    useEffect(() => {
        if(type !== 'ambience')
            ref.current.scrollLeft += 100
    }, [type])
    return (
        <div style={{
            width: "100%",
            paddingLeft: 0,
            paddingRight: 6,
        }} id="comfort-header-nav" className="feedback-view__links" ref={ref}> 
            {
                navbar.map(m => {
                    return <div
                        className={"feedback-view__link-items" + (type.charAt(0).toUpperCase() + type.slice(1) === m ? " feedback-view__link-items--active" : "")}
                        onClick={() => {
                            history.push(`/feedback/${m.toLowerCase()}/${params.id}`)
                        }}>
                        <Title level={'subHeading'}>{getSelectedText({parentAllergy: m}, type.charAt(0).toUpperCase() + type.slice(1) === m )}</Title>
                    </div>
                })
            }
    </div>
    );
};