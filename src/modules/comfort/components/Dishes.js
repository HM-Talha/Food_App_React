import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom"
import {comfort_bg} from "../../../assets/images";
import Carousel from "../../../components/carousel";
import "../styles/dishes.scss";
import SimpleCard from "../../../components/cards/SimpleCard";
import axios from "axios";
import {baseUrl} from "../../../config/api-config";
import {getImage} from "../../onboarding/components/PastFoodHabbit";
import Loader from "../../../components/loader/Loader";
import {Popup} from "../../../components/Popup";
import {PlusIcon} from "../../../assets/icons"
import Input, {CustomButton} from "../../../components/formInput/Input";
import {useDispatch, useSelector} from "react-redux";
import {setComfortDishes, setExploreDishes} from "../../home/redux/actions";
import {getCompressedImgUrl} from "../../../config/utils";
import { Title } from "../../../components/Fonts";

export function splitToBulks(arr, bulkSize = 20) {
    const bulks = [];
    for (let i = 0; i < Math.ceil(arr.length / bulkSize); i++) {
        bulks.push(arr.slice(i * bulkSize, (i + 1) * bulkSize));
    }
    return bulks;
}

export async function getBookmark() {
    return await axios.get(`${baseUrl}/bookmark/get-all-bookmark`)
}

const Dishes = ({type = "comfort", viewRecipe = false}) => {
    const history = useHistory();
    const dispatch = useDispatch()
    const {comfortDishes, exploreDishes} = useSelector(state => state.home)

    const [showBookmark, setShowBookmark] = useState(false);
    const [showCreateBookmark, setShowCreateBookmark] = useState(false);
    const [selectedDish, setSelectedDish] = useState(null);
    const [loading, setLoading] = useState(false);
    const dishes = type === "comfort" ? comfortDishes : exploreDishes;
    const [bookmarkName, setBookmarkName] = useState("");
    const [bookmarks, setBookmarks] = useState({});
    function next(dish) {
        if (viewRecipe) {
            history.push(`/view-recipe/${dish.dishId}`, {dish})
        } else {
            history.push(`/restaurants/${dish.dishId}/restaurant`, {dish: {...dish, from: type}})
        }
    }

    async function fetchComfortDishes() {
        try {
            if (dishes.length === 0) {
                setLoading(true)
                const r1 = axios.get(`${baseUrl}/dsl/comfort/dishes`)
                const res = await r1;
                let data = res.data.result.dishes.filter(d => d.inComfort === 1).map(d => {
                    const img = d.imageUrl
                    return {
                        dishId: d.dishId,
                        recipeId: d.recipeId,
                        image: d.image,
                        dishImgUrl: img && img.length > 0 ? img[0] : undefined,
                        dishName: [{name: d.restaurantDishName}, {}],
                        probability: Math.round(d.Probability * 10000) / 100,
                        nativeCuisine: d.nativeCuisine
                    }
                })
                dispatch(setComfortDishes(data))

                console.log(data)
                
                data = res.data.result.dishes.filter(d => d.inComfort === 0).map(d => {
                    const img = d.imageUrl
                    return {
                        dishId: d.recipeId,
                        image: d.image,
                        dishImgUrl: img && img.length > 0 ? img[0] : undefined,
                        dishName: [{name: d.restaurantDishName}, {}],
                        probability: Math.round(d.Probability * 10000) / 100,
                        nativeCuisine: d.nativeCuisine
                    }
                })
                dispatch(setExploreDishes(data))
                
                console.log(data)

            } else {
                setLoading(false)
            }
            // const r2 = axios.get(`${baseUrl}/dsl/${type}/dishes/recommendations`);
            // const r3 = axios.get(`${baseUrl}/dsl/comfortexplorepage/propbabilityScores`);
            const r4 = await getBookmark();
            // const res2 = await r2;
            const res4 = await r4;
            // const res3 = await r3;
            setBookmarks(res4.data.result);

            // const data2 = res2.data.result?.rec_dishes?.map(d => ({
            //     dishId: d.recipeId,
            //     dishImgUrl: d.imageUrl && d.imageUrl.length > 0 ? d.imageUrl[0] : undefined,
            //     dishName: [{name: d.dish}, {}]
            // }))
            // setDishes2(data2 || [])
            //
            // const propbabilityScores = {};
            // res3.data.result.dishes.forEach(d => {
            //     propbabilityScores[d.recipeId] = d
            // });
            // setProbabilityScores(propbabilityScores);

        } catch (e) {

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchComfortDishes();
    }, []);


    async function addItemToBookmark(name) {
        await axios.post(`${baseUrl}/bookmark/add-bookmark`, {
            "bookmarks": [
                {
                    name,
                    data: [
                        {
                            type: viewRecipe ? "recipe" : "dish",
                            id: selectedDish.dishId
                        }
                    ]
                }
            ]
        });
        const res4 = await getBookmark();
        setBookmarks(res4.data.result);
    }
    const [probabilityDetails, setProbabilityDetails] = useState({});
    const [recipeDetails, setRecipeDetails] = useState({});
    async function onProbabilityIconClick(recipeId) {
        setProbabilityDetails({})
        await axios.get(`${baseUrl}/recipe/recipesSensory/${recipeId}`).then(res => {
            console.log(res)
            setProbabilityDetails(res.data.message)
        });
        // await axios.get(`${baseUrl}/recipe/${recipeId}`).then(res => {
        //     console.log(res)
        //     setRecipeDetails(res.data)
        // });
    }

    return (
        <><Title level={2} className='position-fixed text-capitalize ml-24px'>{type} Dishes</Title>
        <div className="dishes">
            <div className="dishes__main">
                {/* <img src={comfort_bg} className="dishes__main--bg"/> */}

                {loading && <div style={{paddingTop: "5rem"}}><Loader loading={loading} isComponent/></div>}

                {
                    splitToBulks(dishes, dishes.length).map((data, index) => (
                        <div key={index} className="dishes__carousel-wrapper">
                            <Carousel>
                                <div className="dishes__carousel-items mt-44px">
                                    {
                                        data.map((dish, index) => {
                                            let image = dish.image.replace(/(['])|('])/gim, '')
                                            image = image.replace('[', '')
                                            image = image.replace(']', '')

                                            return <SimpleCard key={index} img={image ? image : getImage(index)}
                                                footerText={dish.dishName[0].name}
                                                onClick={() => next(dish)}
                                                probabilityScore={dish.probability || 0}
                                                probabilityDetails={probabilityDetails}
                                                recipeDetails={recipeDetails}
                                                showBookmark={() => {
                                                    setShowBookmark(true);
                                                    setSelectedDish(dish)
                                                }}
                                                onProbabilityIconClick={async () => {
                                                    next(dish);
                                                }}
                                            />
                                        })
                                    }
                                </div>
                            </Carousel>
                        </div>
                    ))
                }
                <Popup show={showBookmark} onHide={() => {
                    setShowBookmark(false)
                }} height={"30vh"} title={"Favourite Dishes"}>
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
                {showCreateBookmark && <Popup show={showCreateBookmark} onHide={() => {
                    setShowCreateBookmark(false)
                }} height={"30vh"} title={""}>
                    <div className="float-img bookmark-img">
                        <img src={getCompressedImgUrl(getImage(0))}/>
                    </div>
                    <h4>{selectedDish?.dishName[0].name}</h4>
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
        </div></>
    );
};

export default Dishes;
