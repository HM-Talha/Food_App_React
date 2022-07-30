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
import {PlusIcon, VMoreIcon, DeleteIcon, CreateRecipe} from "../../../assets/icons"
import Input, {CustomButton} from "../../../components/formInput/Input";
import {getBookmark} from "./Dishes";
import {getCompressedImgUrl} from "../../../config/utils";

export function splitToBulks(arr, bulkSize = 20) {
    const bulks = [];
    for (let i = 0; i < Math.ceil(arr.length / bulkSize); i++) {
        bulks.push(arr.slice(i * bulkSize, (i + 1) * bulkSize));
    }
    return bulks;
}

const LibraryView = ({type = "comfort", viewRecipe = false}) => {
    const history = useHistory();
    const [showBookmark, setShowBookmark] = useState(false);
    const [showUpdateBookmark, setShowUpdateBookmark] = useState(false);
    const [showCreateBookmark, setShowCreateBookmark] = useState(false);
    const [selectedDish, setSelectedDish] = useState(null);
    const [loading, setLoading] = useState(true);
    const [probabilityScores, setProbabilityScores] = useState({});
    const [bookmarkName, setBookmarkName] = useState("");
    const [bookmarks, setBookmarks] = useState({});
    const [dishes, setDishes] = useState({});
    const [restaurants, setRestaurants] = useState({});
    const [showBookmarkOptions, setShowBookmarkOptions] = useState(false);
    const [showBookmarkDelete, setShowBookmarkDelete] = useState(false);
    const [bookmarkSelected, setBookmarkSelected] = useState("");
    function next(dish) {
        if (type === "recipe") {
            history.push(`/view-recipe/${dish.id}`, {dish: dishes[dish.id]})
        } else if (type === "dish") {
            history.push(`/restaurants/${dish.id}/restaurant`, {dish: {...dishes[dish.id], from: "library"}})
        } else {
            localStorage.setItem("back", `/library/restaurants`)
            history.push(`/restaurant-view/${dish.id}/popular?back=/library/restaurants`, {restaurant: restaurants[dish.id]})
        }
    }

    async function fetchComfortDishes() {
        try {
            const res4 = await getBookmark();

            const res3 = await axios.get(`${baseUrl}/dsl/comfortexplorepage/propbabilityScores`);
            const propbabilityScores = {};
            res3.data.result.similarity_score.forEach(d => {
                propbabilityScores[d.recipeId] = d
            });
            const data = {};
            res4.data.result.dishData.forEach(d => {
                data[d._id] = {
                    dishId: d._id,
                    dishImgUrl: d?.image?.imageUrl,
                    dishName: [{name: d.dishName[0].name}, {}]
                }
            });
            const resData = {};
            res4.data.result.restaurantData.forEach(d => {
                resData[d._id] = {
                    dishImgUrl: d?.image?.imageUrl[0] ?? "",
                    dishName: [{name: d.restaurantName}, {}],
                    dishId: d._id,
                }
            });

            setProbabilityScores(propbabilityScores);
            setRestaurants(resData)
            setDishes(data);
            console.log(res4.data.result);
            setBookmarks(res4.data.result);
            setLoading(false)
        } catch (e) {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchComfortDishes();
    }, []);


    function getData(dish) {
        if (dish.type !== "restaurant") {
            return dishes[dish.id];
        } else {
            return restaurants[dish.id]
        }
    }
    const deleteBookmark = async () => {
        await axios.delete(`${baseUrl}/bookmark/remove-bookmark?name=${bookmarkSelected}`);
        setShowBookmarkDelete(false);
        setLoading(true)
        setBookmarks({});
        const res4 = await getBookmark();
        setBookmarks(res4.data.result);
        setLoading(false)
    }

    const deleteBookmarkData = async () => {
        await axios.delete(`${baseUrl}/bookmark/remove-bookmark?name=${bookmarkSelected}&id=${selectedDish}`);
        setShowBookmark(false);
        setShowBookmarkDelete(false);
        setLoading(true)
        setBookmarks({});
        const res4 = await getBookmark();
        setBookmarks(res4.data.result);
        setLoading(false)
    }

    const updateBookmark = async () => {
        await axios.put(`${baseUrl}/bookmark/update-bookmarks-name?name=${bookmarkSelected}&updateName=${bookmarkName}`);
        setShowUpdateBookmark(false);
        setLoading(true)
        setBookmarks({});
        const res4 = await getBookmark();
        setBookmarks(res4.data.result);
        setLoading(false)
    };

    async function addItemToBookmark(name) {
        await axios.post(`${baseUrl}/bookmark/add-bookmark`, {
            "bookmarks": [
                {
                    name,
                    data: [
                        {
                            type: type,
                            id: selectedDish
                        }
                    ]
                }
            ]
        });
    }

    return (
        <div className="dishes">
            <div className="dishes__main">
                {!viewRecipe && <img src={comfort_bg} className="dishes__main--bg"/>}

                {loading && <div style={{paddingTop: "5rem"}}><Loader loading={loading} isComponent/></div>}
                {!loading && viewRecipe && <div onClick={()=>{
                    history.push("/create/recipe/1")}
                }><CreateRecipe onCLick={() => {
                    history.push("/create/recipe/1")
                }}/></div>}
                {
                    bookmarks?.bookmarks?.map((data, index) => {
                        if (data?.data?.filter(d => d.type === type).length > 0) {
                            return <div className="dishes__carousel-wrapper">
                                <div className="d-flex justify-content-between align-items-center" style={{paddingRight: "1rem"}}>
                                    <h4 style={{textTransform: "capitalize"}}>{data.name}</h4>
                                    <h4 onClick={() => {
                                        setShowBookmarkOptions(true)
                                        setBookmarkSelected(data.name)
                                    }}><VMoreIcon/></h4>
                                </div>
                                <Carousel>
                                    <div className="dishes__carousel-items">
                                        {
                                            data?.data?.filter(d => d.type === type).map((dish, index) => (
                                                <SimpleCard img={getData(dish)?.dishImgUrl ?? getImage(index)}
                                                            footerText={getData(dish)?.dishName[0].name}
                                                            onClick={() => next(dish)}
                                                            probabilityScore={probabilityScores[getData(dish)?.dishId]?.probability}
                                                            probabilityDetails={probabilityScores[getData(dish)?.dishId]?.prob_details}
                                                            showMoreBtn={() => {
                                                                setShowBookmark(true);
                                                                setBookmarkSelected(data.name)
                                                                setSelectedDish(dish.id)
                                                            }}
                                                />
                                            ))
                                        }
                                    </div>
                                </Carousel>
                            </div>
                        }
                    })
                }
                <Popup show={showBookmark} onHide={() => {
                    setShowBookmark(false)
                }} height={"30vh"} title={"Move to"}>
                    <div className="bookmark_menu">
                        <div className="bookmark">
                            <div className="" onClick={async () => {
                                await deleteBookmarkData()
                            }}>
                                <DeleteIcon/>
                            </div>
                            <span className="mt-1" style={{color: "white"}}>create</span>
                        </div>
                        <div className="bookmark">
                            <div className="add-bookmark" onClick={() => {
                                setShowCreateBookmark(true);
                                setShowBookmark(false);
                            }}>
                                <PlusIcon/>
                            </div>
                            <span className="mt-1" style={{color: "white"}}>create</span>
                        </div>

                        {bookmarks?.bookmarks?.filter(d=> d.name !== bookmarkSelected).map((d, index) => (
                            <div className="bookmark" onClick={async () => {
                                setBookmarks({})
                                setLoading(true)
                                setShowBookmark(false);
                                await addItemToBookmark(d.name);
                                await deleteBookmarkData();
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
                {
                    showBookmarkOptions && <Popup show={showBookmarkOptions} onHide={() => {
                        setShowBookmarkOptions(false)
                    }} height={"20vh"} title={""}>
                        <div className="bookmark_menu flex-column">
                            <div className="mb-3" onClick={() => {
                                setShowBookmarkOptions(false);
                                setShowUpdateBookmark(true);
                                setBookmarkName(bookmarkSelected);
                            }}>Edit</div>
                            <div className="" style={{color: "#DD2E44"}} onClick={() => {
                                setShowBookmarkOptions(false);
                                setShowBookmarkDelete(true);
                            }}>Delete</div>
                        </div>
                    </Popup>
                }
                {
                    showBookmarkDelete && <Popup show={showBookmarkDelete} onHide={() => {
                        setShowBookmarkDelete(false)
                    }} height={"30vh"} title={""}>
                        <div className="bookmark_menu flex-column align-items-center">
                            <div className="fw-bold">Are you sure you want to delete?</div>
                            <div className="mt-3" style={{color: "#DD2E44"}} onClick={async () => {
                                await deleteBookmark()
                            }}>Delete</div>
                            <CustomButton className="mt-3 pikky-btn-primary" title={"Cancel"}
                                          onClick={() => {
                                              setShowBookmarkDelete(false)
                                          }}/>
                        </div>
                    </Popup>
                }
                {showUpdateBookmark && <Popup show={showUpdateBookmark} onHide={() => {
                    setShowUpdateBookmark(false)
                }} height={"30vh"} title={""}>
                    <div className="float-img bookmark-img">
                        <img src={getCompressedImgUrl(getImage(0))}/>
                    </div>
                    <h4>{dishes[selectedDish]?.dishName[0].name}</h4>
                    <div className="">
                        <Input
                            name={bookmarkName}
                            placeholder="Name"
                            value={bookmarkName}
                            onChange={(evt) => {
                                setBookmarkName(evt.target.value)
                            }}
                        />
                        <CustomButton className="mt-3" title={"Update"} disabled={bookmarkName === bookmarkSelected}
                                      onClick={async () => {
                                          await updateBookmark()
                                          setShowUpdateBookmark(false)
                                          setBookmarkName("")
                                      }}/>

                    </div>
                </Popup>}
                {showCreateBookmark && <Popup show={showCreateBookmark} onHide={() => {
                    setShowCreateBookmark(false)
                }} height={"30vh"} title={""}>
                    <div className="float-img bookmark-img">
                        <img src={getCompressedImgUrl(getImage(0))}/>
                    </div>
                    <h4>{dishes[selectedDish]?.dishName[0].name}</h4>
                    <div className="">
                        <Input
                            name={bookmarkName}
                            placeholder="Name"
                            value={bookmarkName}
                            onChange={(evt) => {
                                setBookmarkName(evt.target.value)
                            }}
                        />
                        <CustomButton className="mt-3" title={"Create"} disabled={bookmarkName.length === 0}
                                      onClick={async () => {
                                          setLoading(true)
                                          setBookmarks({})
                                          setShowBookmark(false);
                                          setShowCreateBookmark(false)
                                          await addItemToBookmark(bookmarkName);
                                          await deleteBookmarkData();
                                      }}/>

                    </div>
                </Popup>}

            </div>
        </div>
    );
};

export default LibraryView;
