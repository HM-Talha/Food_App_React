import React, {useState} from "react";
import "../styles/index.scss"
import {DishName} from "./DishName";
import {DishType} from "./DishType";
import {ServingSize} from "./ServingSize";
import {MealCourse} from "./MealCourse";
import {PreparationTime} from "./PreparationTime";
import PastFoodHabit, {Ingredients} from "../../onboarding/components/PastFoodHabbit";
import {CustomButton} from "../../../components/formInput/Input";
import {useHistory} from "react-router-dom";

export const CreateDishWrapper = (props) => {
    const history = useHistory();
    const {step} = props.match.params;
    const [dishName, setDishName] = useState("");
    const [mealCourse, setMealCourse] = useState("");
    const [dishType, setDishType] = useState("");
    const [servingSize, setServingSize] = useState(0);
    const [preparationTime, setPreparationTime] = useState({hr: 0, min: 0});
    const [marinationTime, setMarinationTime] = useState({hr: 0, min: 0});
    const [cookingTime, setCookingTime] = useState({hr: 0, min: 0});
    const [mealCoursesOptions, setMealCoursesOptions] = useState(["Beverage", "Breads", "Breakfast"]);
    const [dishTypesOptions, setDishTypesOptions] = useState(["Hot", "Cold", "Others"]);

    function getStep() {

        switch (step) {
            case "1":
                return <DishName dishName={dishName} setDishName={setDishName}/>;
            case "2":
                return <MealCourse mealCoursesOptions={mealCoursesOptions} mealCourse={mealCourse}
                                   setMealCourse={setMealCourse}/>;

            case "3":
                return <DishType dishType={dishType} setDishType={setDishType} dishTypesOptions={dishTypesOptions}/>;
            case "4":
                return <ServingSize servingSize={servingSize} setServingSize={setServingSize}/>;
            case "5":
                return <PreparationTime preparationTime={preparationTime} setPreparationTime={setPreparationTime}
                                        type={"Preparation"} nextStep={6}/>;
            case "6":
                return <PreparationTime preparationTime={marinationTime} setPreparationTime={setMarinationTime}
                                        type={"Marination"} nextStep={7}/>;
            case "7":
                return <PreparationTime preparationTime={cookingTime} setPreparationTime={setCookingTime}
                                        type={"Cooking"} nextStep={8}/>;
            case "8":
                return <div className="cuisine-selection-step">
                    <PastFoodHabit title={"Select Cuisine"} hideNext={true}/>
                    <CustomButton title={"Next"} onClick={() => {
                        history.push("/create/recipe/9")
                    }}/>
                </div>;
            case "9":
                return <div className="cuisine-selection-step">
                    <Ingredients hideNext={true}/>
                    <CustomButton title={"Next"} onClick={() => {
                        history.push("/create/recipe/10")
                    }}/>
                </div>;
            default:
                return <div>Not found</div>
        }
    }

    return (
        <div className="no-scroll">
            {getStep()}
        </div>
    )
}
