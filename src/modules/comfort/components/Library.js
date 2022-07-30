import React, {useState} from "react";
import {Redirect, Route, Switch, useHistory, useRouteMatch} from "react-router-dom";
import Dishes from "./Dishes";
import {BackIcon, SearchIcon} from "../../../assets/icons";
import "../styles/comfort.scss";
import RestaurantsList from "../../../views/restaurants/RestaurantsList";
import {getSelectedText} from "../../onboarding/components/UserFoodAllergic";
import {SearchComponent} from "../../../components/layout/OnboardingLayout";
import axios from "axios";
import {baseUrl} from "../../../config/api-config";
import {getImage} from "../../onboarding/components/PastFoodHabbit";
import {ComfortNav} from "./index";
import LibraryView from "./LibraryView";

const Library = ({type = "comfort"}) => {
    const match = useRouteMatch();
    const history = useHistory();
    const [showSearch, setShowSearch] = useState(false);

    // useStickyHeader({ id: "comfort-header", stickyClassname: "is-sticky" });
    function goBack() {
        history.push("/home")
    }

    function getScreenType() {
        let type = "recipes";
        if (window.location.pathname.includes("dishes")) {
            type = "dish"
        }
        if (window.location.pathname.includes("restaurants")) {
            type = "restaurant"
        }
        return type;
    }

    async function onSearch(text) {
        let type = getScreenType();
        const res = await axios.get(`${baseUrl}/restaurant/homepage/search?type=${type}&keyword=${text}`);
        return res.data.resultUsersData.map((r, index) => ({
            id: r._id,
            type: type,
            image: Array.isArray(r.image?.imageUrl) ? r.image?.imageUrl?.[0] ?? getImage(index) : r.image?.imageUrl || getImage(index),
            name: r?.dishName?.[0]?.name ?? r.restaurantName
        }));
    }

    return (
        <div className="comfort">
            <div id="comfort-header" className="comfort__header">
                <BackIcon className="comfort__header--back" onClick={goBack}/>
                <div className="comfort__lower-header">
                    <h2 style={{textTransform: "capitalize"}}>Library</h2>
                    <SearchIcon onClick={() => {
                        setShowSearch(true)
                    }}/>
                </div>
            </div>

            <div className="comfort__main">
                <ComfortNav type={ getScreenType()}/>
                <div className="comfort__main--content">
                    <Switch>
                        <Redirect exact from={`${match.url}/`} to={`${match.url}/dishes`}/>
                        <Route path={`${match.url}/dishes`} component={() => <LibraryView key={0} type={"dish"}/>}/>
                        <Route path={`${match.url}/recipes`}
                               component={() => <LibraryView key={1} type={"recipe"} viewRecipe={true}/>}/>
                        <Route path={`${match.url}/restaurants`} component={() => <LibraryView type={"restaurant"}/>}/>
                        {/*<Route to={`${match.url}/recipes`} />*/}
                    </Switch>
                </div>
            </div>
            {showSearch && <div className="o-layout">
                <SearchComponent key={window.location.pathname} onBackClick={() => {
                    setShowSearch(false)
                }} onSearchText={async (text) => {
                    return await onSearch(text);
                }} onSearchSelected={(e) => {
                    if (e.type === "dish" || e.type === "recipes") {
                        history.push(`/restaurants/${e.id}/restaurant`, {
                            dish: {
                                dishId: e.id,
                                dishImgUrl: e.image,
                                dishName: [{name: e.name}]
                            }
                        })
                    } else if (e.type === "restaurant") {
                        history.push(`/restaurant-view/${e.id}/popular`, {
                            restaurant: {
                                _id: e.id,
                                restaurantName: e.name,
                                image: {imageUrl: [e.image]}
                            }
                        })
                    }
                    setShowSearch(false)
                }} tabs={<ComfortNav className="comfort-search-nav"/>}/>
            </div>}
        </div>
    );
};


export default Library;
