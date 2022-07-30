import React, { useEffect, useState, useRef } from "react";
import cx from "classnames";
import { useHistory } from "react-router-dom";
import OnboardingLayout from "../../../components/layout/OnboardingLayout";
import { AlphabetScroll, CuisineItem, getAlphabetScrollMap, getImage } from "./PastFoodHabbit";
import { food_3 } from "../../../assets/images";
import "../styles/userFavorites.scss";
import axios from "axios";
import { baseUrl } from "../../../config/api-config";
import { japanese } from "../../../assets/images/tobeRemoved";
import Loader from "../../../components/loader/Loader";
import { vibrate } from "./FoodtypeSelector";
import { useDispatch, useSelector } from "react-redux";
import { setFavouriteFoodTypes } from "../redux/actions";
import { forEach } from "lodash";
import { setPreferenceIsEdit } from '../../../onState/actions'
import {getCompressedImgUrl} from "../../../config/utils";
import {fetchSwipingDishes} from "../../home/redux/actions";

const UserFavorites = () => {
  const [cuisineList, setCuisineList] = useState([]);
  const [loading, setloading] = useState(true);
  const { favouritesFoodTypes, pastFoodTypes, nationalCuisineList } = useSelector(state => state.onboarding);
  const user = useSelector(state => state.home.userDetails)
  const { preferenceIsEdit } = useSelector(state => state.onState);
  const [selectedCuisine, setSelectedCuisine] = useState(favouritesFoodTypes);
  const history = useHistory();
  const cuisineRefs = useRef([]);

  function nextStep() {
    localStorage.setItem("cuisine", JSON.stringify(selectedCuisine))
    history.push("/step-11");
  }

  function setCuisine(id) {
    vibrate()
    let old = [...selectedCuisine];
    if (old.includes(id)) {
      setSelectedCuisine(old.filter((c) => c !== id));
    } else {
      old.push(id);
      setSelectedCuisine(old);
    }
  }
  function UpdateSelected() {
    for (var p in pastFoodTypes) {
      if (selectedCuisine.includes(p)) {
        var Data = selectedCuisine.filter(x => x !== p);
        setSelectedCuisine(Data)
      }
    }
  }
  async function fetchMainCuisines() {
    if (nationalCuisineList.length === 0) {
      setloading(true)
      const res = await axios.get(`${baseUrl}/cuisine/main`);
      let cuisines = res.data;
      cuisines = cuisines.map(c => ({ ...c, name: c.name[0].name }))
      cuisines = cuisines.sort((a, b) => a.name.localeCompare(b.name))
      setCuisineList(cuisines.map((d, idx) => ({ ...d, idx })))
      setloading(false)
    } else {
      setCuisineList(nationalCuisineList);
      setloading(false)
    }
  }
  useEffect(() => {
    fetchMainCuisines()
  }, []);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFavouriteFoodTypes(selectedCuisine))
  }, [selectedCuisine])

  useEffect(() => {
    if (preferenceIsEdit) {
      setSelectedCuisine(user?.likedCuisine)
    }
  }, [])

  const UpdateFavoritesCuisine = async () => {
    setloading(true)
    try {
      await axios.post(`${baseUrl}/user/editFavouriteCuisine`, {
        likedCuisine : selectedCuisine
      })
        .then(() => {
          setloading(false)
          dispatch(setPreferenceIsEdit(false))
          history.push('/preference')
          dispatch(fetchSwipingDishes());
        })
    } catch (error) {
      setloading(false)
      console.log(error)
    }
  }

  return (
    <OnboardingLayout
      title="Any other favourites?"
      onNextClick={() => preferenceIsEdit ? UpdateFavoritesCuisine() : nextStep()}
      onSearchText={(text) => {
        return cuisineList.filter(item => item.name.toLowerCase().startsWith(text.toLowerCase())).map(i => ({
          name: i.name,
          ...i,
          image: i.image?.imageUrl || getImage(i.idx),
        }));
      }}
      onSearchSelected={(item) => {
        setTimeout(() => {
          cuisineRefs.current[item.idx > 2 ? item.idx - 2 : item.idx].scrollIntoView({ behavior: 'smooth' });
        }, 1);
      }}
      className="cuisine-selector mt-24px"
    >
      {UpdateSelected()}
      {!loading && <div className="vertical-scroll">
        <AlphabetScroll charactersMap={getAlphabetScrollMap(cuisineList.filter(c => !Object.keys(pastFoodTypes).includes(c._id)))} />
      </div>}
      {loading && <Loader loading={loading} isComponent />}
      {
        !loading && <div className="user-favorites">
          {cuisineList.filter(c => !Object.keys(pastFoodTypes).includes(c._id)).map((item, index) => (
            <div ref={element => cuisineRefs.current[item.idx] = element}>
              <CuisineItem
                index={index}
                key={item._id}
                {...item}
                onClick={setCuisine}
                activeNumber={
                  selectedCuisine.indexOf(item._id) >= 0
                    ? selectedCuisine.indexOf(item._id) + 1
                    : null
                }
                showActive={true}
              />
            </div>
          ))}
        </div>
      }
    </OnboardingLayout>
  );
}

const CuisineItem1 = ({ activeNumber, images, mainCuisine, onClick, _id }) => {
  return (
    <div className="cuisine" onClick={() => onClick(_id)}>
      <div
        className={cx("cuisine__image-wrapper", {
          "cuisine__image-wrapper--active": activeNumber,
        })}
      >
        <img src={getCompressedImgUrl(images) || japanese} />
        {activeNumber && <div>{activeNumber}</div>}
        <span className="highlight" />
      </div>
      <h6>{mainCuisine[0]}</h6>
    </div>
  );
};

export default UserFavorites;
