import React, { useEffect, useRef } from "react";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { ComfortIcon, DeActiveHomeIcon, ExploreIcon, MoreIcon, PatternIcon, } from "../../../assets/icons";
import "../styles/AppMenuBar.scss";
import { useDispatch, useSelector } from "react-redux";
import { setActivePath } from '../redux/actions'
import { setMenu } from '../../../onState/actions'
import Lottie from "lottie-react";
import HomeAnimation from "../../../assets/lottie/animation/Home.json";
import ComfortAnimation from "../../../assets/lottie/animation/Comfort.json";
import ExploreAnimation from "../../../assets/lottie/animation/Explor.json";
import PatternAnimation from "../../../assets/lottie/animation/Pattern.json";
import MoreAnimation from "../../../assets/lottie/animation/More.json";
import { Footnote } from "../../../components/Fonts";


const AppMenuBar = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const ref = useRef(null);
    const { pathName } = useSelector(state => state.activePath)
    const { isMenu } = useSelector((state) => state.onState)
    useEffect(() => {
        ref.current.playSegments([0, 76], true);
    }, [])
    return (
        <div className="app-menu-bar">
            <NavLink
                to="/home"
                className="app-menu-bar__item"
                activeClassName="app-menu-bar__item--active"
                onClick={() => dispatch(setActivePath('/home'))}
            >
                {history.location.pathname === '/home'
                    ? <div className="app-menu-svg"><Lottie loop={false} animationData={HomeAnimation} autoPlay={false} lottieRef={ref} /></div>
                    : <DeActiveHomeIcon color="" className="app-menu-bar__icon" />
                }

                <Footnote><div className="mt-4px">Home</div></Footnote>
            </NavLink>
            <NavLink
                to="/comfort"
                className="app-menu-bar__item"
                activeClassName="app-menu-bar__item--active"
                onClick={() => dispatch(setActivePath('/comfort'))}
            >
                {
                    history.location.pathname.includes('/comfort')
                        ? <div className="app-menu-svg"><Lottie loop={false} animationData={ComfortAnimation} autoPlay={false} lottieRef={ref} /></div>
                        : <ComfortIcon className="app-menu-bar__icon" />
                }

                <Footnote><div className="mt-4px">Comfort</div></Footnote>
            </NavLink>
            <NavLink
                onClick={() => dispatch(setActivePath('/explore'))}
                to="/explore"
                className="app-menu-bar__item"
                activeClassName="app-menu-bar__item--active"
            >
                {
                    history.location.pathname.includes('/explore')
                        ? <div className="app-menu-svg"><Lottie loop={false} animationData={ExploreAnimation} autoPlay={false} lottieRef={ref} /></div>
                        : <ExploreIcon className="app-menu-bar__icon" />
                }

                <Footnote><div className="mt-4px">Explore</div></Footnote>
            </NavLink>
            <NavLink
                onClick={() => dispatch(setActivePath('/home'))}
                to="/imagine"
                className="app-menu-bar__item"
                activeClassName="app-menu-bar__item--active"
            >
                {
                    pathName === '/make-pattern'
                        ? <div className="app-menu-svg"><Lottie loop={false} animationData={PatternAnimation} autoPlay={false} lottieRef={ref} /></div>
                        : <PatternIcon className="app-menu-bar__icon" />
                }
                <Footnote><div className="mt-4px">Imagine</div></Footnote>
            </NavLink>
            <NavLink
                to={'?popup=open'}
                className="app-menu-bar__item"
                activeClassName={isMenu ? "app-menu-bar__item--active" : ''}
            >
                {
                    isMenu
                        ? <div className="app-menu-svg"><Lottie loop={false} animationData={MoreAnimation} autoPlay={false} lottieRef={ref} /></div>
                        : <MoreIcon className="app-menu-bar__icon" />
                }
                <Footnote><div className="mt-4px">More</div></Footnote>
            </NavLink>
        </div>
    );
};


export default AppMenuBar;
