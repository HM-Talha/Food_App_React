import React, { useLayoutEffect } from "react";
import {
    NavLink,
    Redirect,
    Route,
    Switch,
    useRouteMatch,
    useHistory
} from "react-router-dom";
import { BackIcon, SearchIcon } from "../../../assets/icons";
import RestaurantsList from "../../../views/restaurants/RestaurantsList";
import "../styles/pattern.scss"
import Dishes from "../../comfort/components/Dishes";
import FlipPage from "react-flip-page";

const Pattern = () => {
    return (
        <div>
            <FlipPage>
                <article>
                    <h1>My awesome first article</h1>
                    <p>My awesome first content</p>
                </article>
                <article>
                    <h1>My wonderful second article</h1>
                    <p>My wonderful second content</p>
                </article>
                <article>
                    <h1>My excellent third article</h1>
                    <p>My excellent third content</p>
                </article>
            </FlipPage>
        </div>
    )
};

const Pattern1 = () => {
    const match = useRouteMatch();
    const history = useHistory();
    // useStickyHeader({ id: "comfort-header", stickyClassname: "is-sticky" });
    function goBack() {
        history.goBack()
    }
    return (
        <div className="pattern">
            <div id="comfort-header" className="pattern__header">
                <BackIcon className="pattern__header--back" onClick={goBack}/>
                <div className="pattern__lower-header">
                    <h2>Pattern</h2>
                    <SearchIcon />
                </div>
            </div>

            <div className="pattern__main">
                <ComfortNav />
                <div className="pattern__main--content">
                    <Switch>
                        <Redirect exact from={`${match.url}/`} to={`${match.url}/dishes`} />
                        <Route path={`${match.url}/dishes`} component={Dishes} />
                        <Route to={`${match.url}/restaurants`} component={RestaurantsList}/>
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
        <div id="pattern-header-nav" className="pattern__links">
            <NavLink
                to={`${match.url}/dishes`}
                className="pattern__link-items"
                activeClassName="pattern__link-items--active"
            >
                Dishes
            </NavLink>
            <NavLink
                to={`${match.url}/restaurants`}
                className="pattern__link-items"
                activeClassName="pattern__link-items--active"
            >
                Restaurants
            </NavLink>
            <NavLink
                to={`${match.url}/recipes`}
                className="pattern__link-items"
                activeClassName="pattern__link-items--active"
            >
                Recipes
            </NavLink>
        </div>
    );
};

export default Pattern;
