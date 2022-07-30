import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom"
import "../styles/dishes.scss";
import axios from "axios";
import {baseUrl} from "../../../config/api-config";
import {BackIcon, SmallBackIcon} from "../../../assets/icons";
import {getSelectedText} from "../../onboarding/components/UserFoodAllergic";
import Loader from "../../../components/loader/Loader";
import {getCompressedImgUrl} from "../../../config/utils";

const ViewRecipe = ({}) => {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState("");
    const [dishe2s, setDishes2] = useState([]);
    const {dish} = history.location.state;
    useEffect(() => {
        async function a() {
            try {
                const res = await axios.get(`${baseUrl}/recipe/sentence/${dish.dishId}`, {timeout: 10000});
                setRecipe(res.data.recipeSentencesData[0])
            } catch (e) {

            } finally {
                setLoading(false)
            }
        }

        a()
    }, [])

    console.log(dish)
    return (
        <div className="comfort view-recipe">
            <div className="comfort__header--back" onClick={() => {
                history.goBack()
            }}>
                <SmallBackIcon/>
            </div>
            <img src={getCompressedImgUrl(dish.dishImgUrl)} style={{width: "100vw", height: "462px"}}/>
            {loading && <Loader loading={loading} isComponent/>}
            {!loading && <div className="view-recipe-title" style={{padding: "2rem 1rem"}}>
                <h1 style={{position: "relative", fontSize: "60px", textTransform: "capitalize"}}>
                    {
                        getSelectedText({parentAllergy: dish.dishName[0].name}, true)
                    }
                </h1>
                <div style={{paddingLeft: "10px"}}>
                    <h2>Ingredients</h2>
                    <ul style={{marginLeft: "1.5rem"}}>
                        {
                            recipe.Ingredient.replaceAll("[", "").replaceAll("]", "").replaceAll("'", "").split(",").map(d =>
                                <li style={{marginTop: ".5rem", marginBottom: "1rem"}}>{d}</li>)
                        }
                    </ul>
                    <h2>Cooking Instructions</h2>
                    <ol style={{marginLeft: "1.5rem"}}>
                        {
                            recipe.directions.replaceAll("[", "").replaceAll("]", "").replaceAll("'", "").split(",").map(d =>
                                <li style={{marginTop: "1rem", marginBottom: "2rem"}}>{d}</li>)
                        }
                    </ol>
                </div>
            </div>}
        </div>
    );
};

export default ViewRecipe;
