import React from 'react';
import {NavLink, Redirect, Route, Switch, useHistory, useRouteMatch} from "react-router-dom";
import {BackIcon, SearchIcon} from "../../../assets/icons";
import Dishes from "../../comfort/components/Dishes";
import RestaurantsList from "../../../views/restaurants/RestaurantsList";

const Explore = () => {
    const match = useRouteMatch();
    const history = useHistory();
    // useStickyHeader({ id: "comfort-header", stickyClassname: "is-sticky" });
    function goBack() {
        history.goBack()
    }
    return (
        <div className="comfort">
            <div id="comfort-header" className="comfort__header">
                <BackIcon className="comfort__header--back" onClick={goBack}/>
                <div className="comfort__lower-header">
                    <h2>Explore</h2>
                    <SearchIcon />
                </div>
            </div>

            <div className="comfort__main">
                <ComfortNav />
                <div className="comfort__main--content">
                    <Switch>
                        <Redirect exact from={`${match.url}/`} to={`${match.url}/dishes`} />
                        <Route path={`${match.url}/dishes`} component={(props) => <Dishes type={"explore"} {...props}/>} />
                        <Route to={`${match.url}/restaurants`} component={(props) => <RestaurantsList type={"explore"} {...props}/>}/>
                        {/*<Route to={`${match.url}/recipes`} />*/}
                    </Switch>
                </div>
            </div>
        </div>
    );
};

export const ComfortNav = () => {
    const match = useRouteMatch();
    return (
        <div id="comfort-header-nav" className="comfort__links">
            <NavLink
                to={`${match.url}/dishes`}
                className="comfort__link-items"
                activeClassName="comfort__link-items--active"
            >
                Dishes
            </NavLink>
            <NavLink
                to={`${match.url}/restaurants`}
                className="comfort__link-items"
                activeClassName="comfort__link-items--active"
            >
                Restaurants
            </NavLink>
            <NavLink
                to={`${match.url}/recipes`}
                className="comfort__link-items"
                activeClassName="comfort__link-items--active"
            >
                Recipes
            </NavLink>
        </div>
    );
};

export default Explore;
