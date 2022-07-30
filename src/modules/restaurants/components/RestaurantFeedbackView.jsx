import React, { useState, useEffect, useRef } from "react";
import "../styles/restaurantFeedbackView.scss";
import ExperienceIcon from "../assets/images/Experience.svg";
import FoodIcon from "../assets/images/Food.svg";
import SuperbIcon from "../assets/images/Superb.svg";
import ChicIcon from "../assets/images/Chic.svg";
import CleanIcon from "../assets/images/Clean.svg";
import { useHistory, useParams } from "react-router-dom";
import { getSelectedText } from "../../onboarding/components/UserFoodAllergic";
import axios from "axios";
import { baseUrl } from "../../../config/api-config";
import _ from "lodash";
import AnimatedNavView from "../../../components/Navigation/AnimatedNavView";

const RestaurantFeedbackView = ({ restaurant }) => {
  const { id: restaurantId } = useParams();
  const [activeMenu, setActiveMenu] = useState('')
  const [reviewTypes, setReviewTypes] = useState([]);
  const [reviews, setReviews] = useState({})
  const [totalCount, setTotalCount] = useState(0)

  // Get feedback
  useEffect(() => { 
    axios.get(`${baseUrl}/restaurant/reviews/${restaurantId}`).then(res => {
      setActiveMenu(_.capitalize(Object.keys(res.data.data?.tagsCount)[0]))
      setReviewTypes(Object.keys(res.data.data?.tagsCount).map(e => _.capitalize(e)))
      setReviews(res.data.data?.tagsCount)
      setTotalCount(res.data.data?.totalReviewsCount)
    })
  }, [restaurantId])

  // Get percentage 
  const getPercentage = (value, totalValue) => {
    return Math.round((value / totalValue) * 100)
  }

  return (
    <AnimatedNavView activeMenu={activeMenu} menuList={reviewTypes} >
      <FeedbackNav
        // feedbackMenu={feedbackMenu}
        restaurantName={restaurant?.restaurantName}
        activeMenu={{ activeMenu, setActiveMenu }}
        navItems={reviewTypes}
      />
      <div id="feedback-view-root" style={{ paddingBottom: 20, marginTop: 228 }}>
        {reviewTypes.length < 1 ? <div style={{ marginLeft: 22, color: "#777777" }}>No feedback to show</div> : reviewTypes.map((review, i) => <div key={i} className="restaurant-feedback-view" id={review} data-menu-interactive-section={true} data-menu-interactive-section-id={review}>
          {/* Header */}
          <div className="header">
            <div>
               <img src={FoodIcon} alt={ review } />
            </div>
             <div className="label">{ review }</div>
          </div>

          {/* Content */}
           <div className="content feedback-content-list">
             {reviews[_.lowerCase(review)] && Object.keys(reviews[_.lowerCase(review)]).map((e, i) => {

              // Full width item
              if (i !== 0 && i % 2 === 0) return <div key={i} className="item grid-span-2">
              <div className="icon">
                  <img src={CleanIcon} alt={ e } />
              </div>
              <div>
                <div className="value">
                   <span>{ getPercentage(Number(reviews[_.lowerCase(review)][e]), totalCount)}</span>
                  <span>%</span>
                </div>
                  <div className="name">{ e }</div>
              </div>
            </div>
              
               return <div className="item" key={i}>
                 <div className="icon">
                   <img src={SuperbIcon} alt={ e } />
                 </div>
                 <div className="value">
                   <span>{ getPercentage(Number(reviews[_.lowerCase(review)][e]), totalCount)}</span>
                   <span>%</span>
                 </div>
                 <div className="name">{ e }</div>
               </div>
             })}
          </div>
        </div>)}
      </div>
    </AnimatedNavView>
  );
};

export default RestaurantFeedbackView;

/**
 * Restaurant feedback nav bar
 */
const FeedbackNav = ({ restaurantName, activeMenu, navItems }) => {
  const history = useHistory();

  return (
    <div className="feedback-nav" id="animated-nav-view">
      <button className="button" onClick={() => history.goBack()}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="#292929"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <h2 className="feedback-title">{restaurantName && restaurantName}</h2>
      <ul className="feedback-nav-items">
        {navItems.map((n, i) => (
          <li
            // className={`nav-item`}
            key={i}
            onClick={() => {
              activeMenu.setActiveMenu(n)
            }}
            className={`${i === 0 ? 'nav-active' : ''}`}
            data-menu-item={true}
            data-menu-item-id={n}
            left={10}
            >
            {n && n}
          </li>
        ))}

        {/* Active menu indicator is required */}
        <div id="active-menu-indicator"></div>
      </ul>
    </div>
  );
};
