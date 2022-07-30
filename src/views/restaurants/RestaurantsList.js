import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom"
import { best_buy, comfort_bg, burger } from "../../assets/images";
import Carousel from "../../components/carousel";
import SimpleCard from "../../components/cards/SimpleCard";
import "../../modules/restaurants/styles/restaurantsList.scss"
import axios from "axios";
import {baseUrl} from "../../config/api-config";
import {getImage} from "../../modules/onboarding/components/PastFoodHabbit";
import {getBookmark, splitToBulks} from "../../modules/comfort/components/Dishes";
import Loader from "../../components/loader/Loader";
import {Popup} from "../../components/Popup";
import {PlusIcon} from "../../assets/icons";
import Input, {CustomButton} from "../../components/formInput/Input";
import "../../modules/comfort/styles/dishes.scss";
import {getRestImage} from "../../modules/imagine/components";
import {getCompressedImgUrl} from "../../config/utils";
import { Title } from "../../components/Fonts";
import { useDispatch, useSelector } from "react-redux";
import { setComfortRestaurants, setExploreRestaurants } from "../../modules/home/redux/actions";

const RestaurantsList = ({type="comfort"}) => {
    const { comfortRestaurants, exploreRestaurants } = useSelector(state => state.home)
    const dispatch = useDispatch()

    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [res, setRes] = useState([]);
    const [res2, setRes2] = useState([]);
    const [showBookmark, setShowBookmark] = useState(false);
    const [showCreateBookmark, setShowCreateBookmark] = useState(false);
    const [selectedDish, setSelectedDish] = useState(null);
    const [bookmarkName, setBookmarkName] = useState("");
    const [bookmarks, setBookmarks] = useState({});
    function next(restaurant) {
        localStorage.setItem("back", `/${type}/restaurants`)
        history.push(`/restaurant-view/${restaurant._id}/popular?back=/${type}/restaurants`, {restaurant})
    }

    async function fetchComfortRes() {
        if (type === 'comfort' && comfortRestaurants.length > 0) {
            setLoading(false)
        }
    
        if (type === 'explore' && exploreRestaurants.length > 0) {
            setLoading(false)
        }
        
        const r1 = await axios.get(`${baseUrl}/dsl/${'comfort'}/restaurants`);
        const r2 = await getBookmark();
        const res = await r1;
        const res4 = await r2;

        const data = res.data.result.Restaurants.map(d => ({
            image: {imageName: [], imageUrl: d["image"]},
            restaurantName: d.restaurantName,
            probability: d?.probability,
            inComfort: d?.inComfort,
            _id: d.restaurant,
        }))

        dispatch(setComfortRestaurants(data.filter(e => e?.inComfort === 1)))
        dispatch(setExploreRestaurants(data.filter(e => e?.inComfort === 0)))
        
        console.log(res4.data.result);
        setRes(data)
        setBookmarks(res4.data.result);        
        setLoading(false)
        // const res2 = await axios.get(`${baseUrl}/user/user-recommendation?type=dish`)
        // setRes2([...res2.data.withImages, ...res2.data.withoutImages])
    }

    useEffect(() => {
        fetchComfortRes();
    }, []);

    console.log(res)
    async function addItemToBookmark(name) {
        await axios.post(`${baseUrl}/bookmark/add-bookmark`, {
            "bookmarks": [
                {
                    name,
                    data: [
                        {
                            type: "restaurant",
                            id: selectedDish._id
                        }
                    ]
                }
            ]
        });
        const res4 = await getBookmark();
        console.log(res4.data.result);
        setBookmarks(res4.data.result);
    }
    return (
        <div className="restaurants-list">
            <div className="restaurants-list__main">
                {/* <img src={comfort_bg} className="restaurants-list__main--bg" /> */}
                {loading && <div style={{paddingTop: "5rem"}}><Loader loading={loading} isComponent/></div>}
                {
                    splitToBulks(type === 'comfort' ? comfortRestaurants : exploreRestaurants, type === 'comfort' ? comfortRestaurants.length : exploreRestaurants.length).map((data, index) => (
                        <div className="restaurants-list__carousel-wrapper">
                            <Title level={2} className='position-fixed text-capitalize ml-24px'>Recommended Restaurants</Title>
                            <Carousel>
                                <div className="dishes__carousel-items mt-44px">
                                    {
                                        type === 'comfort' && comfortRestaurants?.map((dish, idx) => {
                                            { console.log(dish?.probability) }
                                            return <SimpleCard key={idx} img={dish?.image?.imageUrl?.[0] ?? getRestImage(idx)}
                                                probabilityScore={dish?.probability}
                                                footerText={dish.restaurantName}
                                                onClick={() => next(dish)}
                                                showBookmark={() => {
                                                    setShowBookmark(true);
                                                    setSelectedDish(dish)
                                                }} />
                                        })
                                    }
                                    {
                                        type === 'explore' && exploreRestaurants?.map((dish, idx) => {
                                            { console.log(dish?.probability) }
                                            return <SimpleCard key={idx} img={dish?.image?.imageUrl?.[0] ?? getRestImage(idx)}
                                                probabilityScore={dish?.probability}
                                                footerText={dish.restaurantName}
                                                onClick={() => next(dish)}
                                                showBookmark={() => {
                                                    setShowBookmark(true);
                                                    setSelectedDish(dish)
                                                }} />
                                        })
                                    }
                                </div>
                            </Carousel>
                        </div>
                    ))
                }
                {/* {
                    splitToBulks(res2, res2.length).map((data, index) => (
                        <div className="restaurants-list__carousel-wrapper">
                            <Title level={2}><div>Recommended Restaurants</div></Title>
                            <Carousel>
                                <div className="dishes__carousel-items">
                                    {
                                        data.map((dish, idx) => (
                                            <SimpleCard img={dish?.image?.imageUrl?.[0] ?? getImage(idx)}
                                                        footerText={dish.restaurantName}
                                                        onClick={() => next(dish)}/>
                                        ))
                                    }
                                </div>
                            </Carousel>
                        </div>
                    ))
                } */}
                <Popup show={showBookmark} onHide={() => {
                    setShowBookmark(false)
                }} height={"30vh"} title={"Favourite Recipes"}>
                    <div className="bookmark_menu">
                        <div className="bookmark">
                            <div className="add-bookmark" onClick={() => {
                                setShowCreateBookmark(true);
                                setShowBookmark(false);
                            }}>
                                <PlusIcon/>
                            </div>
                            <span className="mt-1" style={{color: "white"}}>create</span>
                        </div>

                        {bookmarks?.bookmarks?.map((d, index) => (
                            <div key={index} className="bookmark" onClick={async () => {
                                setShowBookmark(false)
                                await addItemToBookmark(d.name);
                            }}>
                                <div className="bookmark-img">
                                    <img src={getCompressedImgUrl(getImage(index))}/>
                                </div>
                                <span className="mt-2">{d.name}</span>
                            </div>
                        ))
                        }

                    </div>
                </Popup>
                {showCreateBookmark &&
                <Popup show={showCreateBookmark} onHide={() => {
                    setShowCreateBookmark(false)
                }} height={"30vh"} title={""}>
                    <div className="float-img bookmark-img">
                        <img src={getCompressedImgUrl(getImage(0))}/>
                    </div>
                    <h4>{selectedDish?.restaurantName}</h4>
                    <div className="">
                        <Input
                            name={bookmarkName}
                            placeholder="Name"
                            onChange={(evt) => {
                                setBookmarkName(evt.target.value)
                            }}
                        />
                        <CustomButton className="mt-3" title={"Next"} disabled={bookmarkName.length === 0}
                                      onClick={async () => {
                                          await addItemToBookmark(bookmarkName);
                                          setShowCreateBookmark(false)
                                          setBookmarkName("")

                                      }}/>

                    </div>
                </Popup>}
            </div>
        </div>
    );
};

export default RestaurantsList;
