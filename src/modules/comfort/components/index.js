import React, {useState} from "react";
import {NavLink, Redirect, Route, Switch, useHistory, useRouteMatch} from "react-router-dom";
import AppMenuBar from "../../layout/components/AppMenuBar";
import Dishes from "./Dishes";
import {BackIcon, SearchIcon} from "../../../assets/icons";
import "../styles/comfort.scss";
import RestaurantsList from "../../../views/restaurants/RestaurantsList";
import {getSelectedText} from "../../onboarding/components/UserFoodAllergic";
import {SearchComponent} from "../../../components/layout/OnboardingLayout";
import axios from "axios";
import {baseUrl} from "../../../config/api-config";
import {getImage} from "../../onboarding/components/PastFoodHabbit";
import ComingSoon from './ComingSoon';
import { Title } from "../../../components/Fonts";

const Comfort = ({type="comfort"}) => {
    const match = useRouteMatch();
    const history = useHistory();
    const [showSearch, setShowSearch] = useState(false);
    // useStickyHeader({ id: "comfort-header", stickyClassname: "is-sticky" });
    function goBack() {

        history.push("/home")
    }

    async function onSearch(text) {
        if (text.length <= 3) {
            return [];
        }
      let type = "recipes";
      if (window.location.pathname.includes("dishes")) {
        type = "dish"
      }
      if (window.location.pathname.includes("restaurants")) {
        type = "restaurant"
      }
      const res = await axios.get(`${baseUrl}/restaurant/homepage/search?type=${type}&keyword=${text}`);
      return res.data.resultUsersData.map((r, index) => ({id:r._id,type: type, image: Array.isArray(r.image?.imageUrl) ? r.image?.imageUrl?.[0] ?? getImage(index) : r.image?.imageUrl || getImage(index), name: r?.dishName?.[0]?.name ?? r.restaurantName}));
    }

    return (
        <div className="comfort">
            <div id="comfort-header" className="comfort__header">
                {/* <BackIcon className="comfort__header--back" onClick={goBack}/> */}
                <div className="comfort__lower-header mt-0">
                    <Title level={1} className='text-capitalize'>{type}</Title>
                    <SearchIcon onClick={()=>{setShowSearch(true)}}/>
                </div>
            </div>

            <div className="comfort__main">
                <ComfortNav/>
                <div className="comfort__main--content">
                    <Switch>
                        <Redirect exact from={`${match.url}/`} to={`${match.url}/dishes`}/>
                        <Route path={`${match.url}/dishes`} component={() => <Dishes type={type}/>}/>
                        <Route path={`${match.url}/recipes`} component={() => /*<Dishes key={1} type={type} viewRecipe={true}/>*/ <ComingSoon />} />
                        <Route path={`${match.url}/restaurants`} component={() => <RestaurantsList type={type}/>}/>
                        {/*<Route to={`${match.url}/recipes`} />*/}
                    </Switch>
                </div>
            </div>
            {showSearch && <div className="o-layout">
                <SearchComponent key={window.location.pathname} onBackClick={() => {
                  localStorage.removeItem('search'); setShowSearch(false);
                }} onSearchText={async (text) => {
                  return await onSearch(text);
                }} onSearchSelected={(e) => {
                  if (e.type === "dish" || e.type === "recipes") {
                    history.push(`/restaurants/${e.id}/restaurant`, {dish: {dishId: e.id, dishImgUrl: e.image, dishName: [{name: e.name}]}})
                  } else if (e.type === "restaurant") {
                    history.push(`/restaurant-view/${e.id}/popular`, {restaurant: {_id: e.id, restaurantName: e.name, image: {imageUrl: [e.image]}}})
                  }
                  setShowSearch(false)
                  localStorage.removeItem('search')
                }} tabs={<ComfortNav className="comfort-search-nav"/>}/>
            </div>}
          <AppMenuBar />
        </div>
    );
};

export const ComfortNav = ({className=""}) => {
    const match = useRouteMatch();
    return (
        <div id="comfort-header-nav" className={`comfort__links ${className}`}>
            <NavLink
                to={{
                  pathname: `${match.url}/dishes`,
                  key: new Date().getTime()+1, // we could use Math.random, but that's not guaranteed unique.
                  state: {
                    applied: true
                  }
                }}
                className="comfort__link-items"
                activeClassName="comfort__link-items--active"
            >
                {getSelectedText({parentAllergy: "Dishes"}, window.location.pathname.includes("dishes"))}
            </NavLink>
            <NavLink
                to={`${match.url}/restaurants`}
                className="comfort__link-items"
                activeClassName="comfort__link-items--active"
            >
                {getSelectedText({parentAllergy: "Restaurants"}, window.location.pathname.includes("restaurants"))}
            </NavLink>
            <NavLink
                to={`${match.url}/recipes`}
                className="comfort__link-items"
                activeClassName="comfort__link-items--active"
            >
                {getSelectedText({parentAllergy: "Recipes"}, window.location.pathname.includes("recipes"))}
            </NavLink>
        </div>
    );
};

export default Comfort;
