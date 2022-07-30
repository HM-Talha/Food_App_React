import React from "react";
import {Card, CardFooter} from "../../../components/cards/Card";
import {BasketIcon} from "../../../assets/icons";
import "../styles/restaurandCard.scss"
import { Title } from "../../../components/Fonts";

 const RestaurantCard = ({ name, img , tagNames, onClick, dishPrice}) => {
    const startAnimation = (entries, observer) => {
        entries.forEach(entry => {
          setTimeout(() => {
            entry.target.classList.toggle("res-card-animation", entry.isIntersecting);
          }, 1000)
        });
      };
      
      const observer = new IntersectionObserver(startAnimation);
      const options = { root: null, rootMargin: '0px', threshold: 1 }; 
      
      const elements = document.querySelectorAll('.res-non-active');
      elements.forEach(el => {
        observer.observe(el, options);
      });
    return (
        <div className="restaurant-card" onClick={onClick}>
            <Card img={img} tagNames={tagNames}>
                <CardFooter>
                    <div className="restaurant-card__footer">
                        <div>
                            <Title level={'headLine'} color='#fff'>
                                {
                                    name.length > 42 ?
                                    <div className="res-card-animation">
                                        {name}
                                    </div> :
                                    name
                                }
                            </Title>
                            <Title level={'headLine'} color='#fff' className={'mt-4px'}>${dishPrice}</Title>
                        </div>
                        {/* <BasketIcon /> */}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default RestaurantCard