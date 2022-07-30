import React, { useEffect, useRef, useState } from "react";
import cx from "classnames";
import axios from "axios";
import _, { map, set } from "lodash";
import OnboardingLayout from "../../../components/layout/OnboardingLayout";
import { CloseIcon } from "../../../assets/icons";
import { useHistory } from "react-router-dom";
import "../styles/pastFoodHabit.scss";
import { baseUrl } from "../../../config/api-config";
import Loader from "../../../components/loader/Loader";
import { vibrate } from "./FoodtypeSelector";
import CustomSlider from "../../../components/Slider/Slider";
import sliderHead from "../../../components/Slider/Vector.svg";
import { useDispatch, useSelector } from "react-redux";
import {
    setNationalCuisineList,
    setPastFoodTypes,
    setRegionalCuisine,
} from "../redux/actions";
import { setPreferenceIsEdit } from "../../../onState/actions";
import {getCompressedImgUrl} from "../../../config/utils";
import {fetchSwipingDishes} from "../../home/redux/actions";
import { Footnote, Text, Title } from "../../../components/Fonts";

const defaultCharactersMap = {
    a: "a",
    b: "b",
    c: "c",
    d: "d",
    e: "e",
    f: "f",
    g: "g",
    h: "h",
    i: "i",
    j: "j",
    k: "k",
    l: "l",
    m: "m",
    n: "n",
    o: "o",
    p: "p",
    q: "q",
    r: "r",
    s: "s",
    t: "t",
    u: "u",
    v: "v",
    w: "w",
    x: "x",
    y: "y",
    z: "z",
};

export function getAlphabetScrollMap(cuisineList) {
    const cuisineCharacters = [
        ...new Set(cuisineList.map((cuisine) => cuisine.name.charAt(0))),
    ];

    let lastKnownCharacterIndex = "a";
    const charactersMap = defaultCharactersMap;
    for (const characterIndex in charactersMap) {
        if (cuisineCharacters.includes(characterIndex)) {
            lastKnownCharacterIndex = characterIndex;
        } else {
            charactersMap[characterIndex] = lastKnownCharacterIndex;
        }
    }

    return charactersMap;
}

const PastFoodHabit = ({
    title = "What feels like home?",
    subTitle = "Select up to 3 cuisines",
    hideNext = false,
    onCuisineSelected = () => { },
    onSubCuisineSelected = () => { },
}) => {
    const [cuisineList, setCuisineList] = useState([]);
    const [loader, setLoader] = useState(true);
    const [cuisineSubList, setCuisineSubList] = useState(null);
    const [selectedCuisine, setSelectedCuisine] = useState(null);
    const {
        pastFoodTypes,
        nationalCuisineList,
        regionalCuisineList,
    } = useSelector((state) => state.onboarding);
    const [selectedCuisineList, setSelectedCuisineList] = useState(
        pastFoodTypes
    );
    const [selectedCuisineIdx, setSelectedCuisineIdx] = useState(-2);
    const [animCuisineList, setAnimCuisineList] = useState([]);
    const user = useSelector((state) => state.home.userDetails);
    const { preferenceIsEdit } = useSelector((state) => state.onState);
    const state = useSelector((state) => state);
    const subRef = useRef();
    const history = useHistory();

    console.log(animCuisineList)

    function filterCuisineList() {
        let filteredCuisineList = selectedCuisineList;
        for (var i = 0; i < Object.values(filteredCuisineList).length; i++) {
            if (Object.values(filteredCuisineList)[i].length === 0) {
                delete filteredCuisineList[Object.keys(filteredCuisineList)[i]];
            }
        }
        setSelectedCuisineList(filteredCuisineList);
    }

    const getAllRegionalCuisine = async () => {
        try {
            const regionalCuisinesResp = await axios.get(`${baseUrl}/cuisine/regional/all`);
            const res = regionalCuisinesResp.data.result.cuisineNameData;
            const filterData = _.filter(res, (o) => _.includes(user?.nativeCuisine, o.parent[0]));
            const filterGroup = _.groupBy(filterData, (o) => o.parent[0]);
            
            let defaultCuisine = {}

            for (const key in filterGroup) {
                defaultCuisine[key] = _.filter(_.map(filterGroup[key], '_id'), (o) =>  _.includes(user?.regionalCuisine, o))
            }
            setSelectedCuisineList(defaultCuisine)
            
        } catch (error) {
            console.log(error.messages);
        }
    };

    useEffect(() => {
        if (preferenceIsEdit) {
            getAllRegionalCuisine();
        }
    }, []);

    function setCuisine(id, index) {
        setSelectedCuisineIdx(-2);
        setTimeout(() => {
            const cuisine = cuisineList.find((c) => c._id === id);
            setCuisineSubList(null);
            setSelectedCuisine(cuisine);
            setSelectedCuisineIdx(index);
        }, 10);
    }

    function resetSelectedCuisine() {
        vibrate();
        filterCuisineList();
        setSelectedCuisine(null);
    }

    function setSubCuisine(id) {
        vibrate();
        let old = [...(selectedCuisineList[selectedCuisine._id] ?? [])];

        if (old.includes(id)) {
            setSelectedCuisineList((s) => ({
                ...s,
                [selectedCuisine._id]: s[selectedCuisine._id].filter(
                    (s) => s !== id
                ),
            }));
        } else {
            old.push(id);
            // setSelectedSubCuisine([id]);
            // setSelectedCuisineList(s => ({
            //     [selectedCuisine._id]: s[selectedCuisine._id] === undefined ? [id] : [id]
            // }))
            setSelectedCuisineList((s) => ({
                ...s,
                [selectedCuisine._id]:
                    s[selectedCuisine._id] === undefined
                        ? [id]
                        : s[selectedCuisine._id].concat(id),
            }));
        }
    }

    function setAll() {
        vibrate();
        if (
            cuisineSubList?.length ===
            selectedCuisineList?.[selectedCuisine._id]?.length + 1
        ) {
            setSelectedCuisineList((s) => {
                return {
                    ...s,
                    [selectedCuisine._id]: [],
                };
            });
        } else {
            const squash = new Set([
                ...(selectedCuisineList?.[selectedCuisine._id] || []),
                ...cuisineSubList
                    .filter((c) => c.name.toLowerCase() !== "all")
                    .map((c) => c._id),
            ]);
            setSelectedCuisineList((s) => ({
                ...s,
                [selectedCuisine._id]: [...squash],
            }));
        }
    }

    function handleCuisineState() {
        setSelectedCuisineIdx(-2);
    }

    function nextStep() {
        const native = [],
            regional = [];
        for (let key in selectedCuisineList) {
            if (selectedCuisineList[key].length > 0) {
                native.push(key);
                regional.push(...selectedCuisineList[key]);
            }
        }
        history.push("/step-9");
    }

    async function fetchMainCuisines() {
        if (nationalCuisineList.length === 0) {
            setLoader(true);
            const res = await axios.get(`${baseUrl}/cuisine/main`);
            let cuisines = res.data;
            cuisines = cuisines.map((c) => ({ ...c, name: c.name[0].name }));
            cuisines = cuisines.sort((a, b) => a.name.localeCompare(b.name));
            const nationalCuisines = cuisines.map((d, idx) => ({ ...d, idx }));
            setCuisineList(nationalCuisines);
            dispatch(setNationalCuisineList(nationalCuisines));
            setLoader(false);
        } else {
            setCuisineList(nationalCuisineList);
            setLoader(false);
        }
    }

    async function fetchSubMainCuisines(name) {
        if (!(name in regionalCuisineList)) {
            const res = await axios({
                url: `${baseUrl}/cuisine/regional?id=${name}`,
                method: "GET",
                data: {
                    name,
                },
            });
            let data = res.data.result.cuisineNameData;
            data = data.map((c) => ({ ...c, name: c.name[0].name }));
            data = data.sort((a, b) => a.name.localeCompare(b.name));
            if (data.length > 0) {
                data = [{ name: "all", _id: "all", image: [] }, ...data];
            }
            setCuisineSubList(data.length ? data : null);
            dispatch(setRegionalCuisine({ [name]: data.length ? data : null }));
        } else {
            setCuisineSubList(regionalCuisineList[name]);
        }
    }

    const dispatch = useDispatch();
    useEffect(() => {
        const native = [],
            regional = [];
        for (let key in selectedCuisineList) {
            if (selectedCuisineList[key].length > 0) {
                native.push(key);
                regional.push(...selectedCuisineList[key]);
            }
        }
        onCuisineSelected(native);
        onSubCuisineSelected(regional);
        dispatch(setPastFoodTypes(selectedCuisineList));
    }, [selectedCuisineList]);

    useEffect(() => {
        if (selectedCuisine) {
            setTimeout(() => {
                fetchSubMainCuisines(selectedCuisine._id);
            }, 1);
            setTimeout(() => {
                scrollWithOffset("selected-cuisine");
            }, 1);
        }
    }, [selectedCuisine]);

    useEffect(() => {
        fetchMainCuisines();
    }, []);

    const updateHomeCuisineData = async () => {
        const native = [],
            regional = [];
        for (let key in selectedCuisineList) {
            if (selectedCuisineList[key].length > 0) {
                native.push(key);
                regional.push(...selectedCuisineList[key]);
            }
        }
        setLoader(true);
        try {
            await axios
                .post(`${baseUrl}/user/editHomeCuisine`, {
                    native: native,
                    regional: regional,
                })
                .then(() => {
                    setLoader(false);
                    dispatch(setPreferenceIsEdit(false));
                    history.push("/preference");
                    dispatch(fetchSwipingDishes());
                });
        } catch (error) {
            setLoader(false);
        }
    };

    return (
        <OnboardingLayout
            title={title}
            subTitle={subTitle}
            disableNext={!Object.values(selectedCuisineList).length}
            hideNext={hideNext}
            onNextClick={() =>
                preferenceIsEdit ? updateHomeCuisineData() : nextStep()
            }
            onSearchText={(text) => {
                return cuisineList
                    .filter((item) =>
                        item.name.toLowerCase().startsWith(text.toLowerCase())
                    )
                    .map((i) => ({
                        name: i.name,
                        ...i,
                        image: i.image?.imageUrl || getImage(i.idx),
                    }));
            }}
            onSearchSelected={(item) => {
                filterCuisineList();
                if (
                    Object.values(selectedCuisineList).length >= 3
                ) {
                    alert("Maximum selection reached");
                } else {
                    setCuisine(item._id, item.idx);
                }
            }}
            className="cuisine-selector"
        >
            {!loader && (
                <div className="vertical-scroll">
                    <AlphabetScroll
                        charactersMap={getAlphabetScrollMap(cuisineList)}
                    />
                </div>
            )}
            {loader && <Loader loading={loader} isComponent />}
            {!loader && (
                <div className="past-food-habit mt-24px">
                    <div className="cuisine-list">
                        {cuisineList
                            .filter(
                                (i, idx) =>
                                    idx <=
                                    (selectedCuisineIdx % 2 === 0
                                        ? selectedCuisineIdx + 1
                                        : selectedCuisineIdx)
                            )
                            .map((item, index) => {
                                return (
                                    <>
                                        {selectedCuisineIdx === index ? (
                                            <div></div>
                                        ) : (
                                            <CuisineItem
                                                index={item.idx}
                                                key={item._id}
                                                {...item}
                                                onClick={(id) => {
                                                    setCuisine(id, index);
                                                    vibrate();
                                                }}
                                                activeNumber={
                                                    selectedCuisineList[
                                                        item._id
                                                    ]?.length ?? 0
                                                }
                                            />
                                        )}
                                    </>
                                );
                            })}
                    </div>
                    {selectedCuisineIdx > -1 && (
                        <div
                            className="selected-cuisine"
                            ref={subRef}
                            id={"selected-cuisine"}
                        >
                            <div className="selected-cuisine__info">
                                <div className="selected-cuisine__info--image">
                                    <img
                                        className="highlight"
                                        src={getCompressedImgUrl(
                                            selectedCuisine.image?.[0] ||
                                            getImage(selectedCuisineIdx))
                                        }
                                    />
                                    <span
                                        className="close"
                                        onClick={resetSelectedCuisine}
                                    >
                                        <CloseIcon
                                            onClick={handleCuisineState}
                                        />
                                    </span>
                                </div>
                                <Title level={'headLine'} className='text-capitalize mt-12px'>
                                    {selectedCuisine.name}
                                </Title>
                                <Footnote className={'mt-4px'}>
                                    {cuisineSubList?.length - 1 || 0} Categories
                                </Footnote>
                            </div>
                        </div>
                    )}
                    {selectedCuisineIdx > -1 && cuisineSubList !== null && (
                        <div className="selected-cuisine__items">
                            {cuisineSubList
                                ?.filter(
                                    (item) => item.name.toLowerCase() === "all"
                                )
                                .map((item) => {
                                    return (
                                        <CuisineSubItem
                                            key={item._id}
                                            id={item._id}
                                            selectedCuisineIdx={
                                                selectedCuisineIdx
                                            }
                                            width={80}
                                            {...item}
                                            onClick={setAll}
                                            active={
                                                cuisineSubList?.length ===
                                                selectedCuisineList?.[
                                                    selectedCuisine._id
                                                ]?.length +
                                                1
                                            }
                                            animCuisineList={animCuisineList}
                                            setAnimCuisineList={setAnimCuisineList}
                                        />
                                    );
                                })}
                            {cuisineSubList
                                ?.filter(
                                    (item) => item.name.toLowerCase() !== "all"
                                )
                                .map((item) => (
                                    <CuisineSubItem
                                        key={item._id}
                                        id={item._id}
                                        selectedCuisineIdx={selectedCuisineIdx}
                                        width={80}
                                        {...item}
                                        onClick={setSubCuisine}
                                        active={selectedCuisineList?.[
                                            selectedCuisine._id
                                        ]?.includes(item._id)}
                                        animCuisineList={animCuisineList}
                                        setAnimCuisineList={setAnimCuisineList}
                                    />
                                ))}
                        </div>
                    )}
                    <div className="cuisine-list">
                        {cuisineList
                            .filter(
                                (i, idx) =>
                                    idx >
                                    (selectedCuisineIdx % 2 === 0
                                        ? selectedCuisineIdx + 1
                                        : selectedCuisineIdx)
                            )
                            .map((item, index) => (
                                <>
                                    <CuisineItem
                                        index={item.idx}
                                        key={item._id}
                                        {...item}
                                        onClick={(id) => {
                                            filterCuisineList();
                                            if (
                                                Object.values(
                                                    selectedCuisineList
                                                ).length >= 3 &&
                                                !Object.keys(
                                                    selectedCuisineList
                                                ).includes(item._id)
                                            ) {
                                                alert(
                                                    "Maximum selection reached"
                                                );
                                            } else {
                                                vibrate();
                                                setCuisine(
                                                    id,
                                                    selectedCuisineIdx > -1
                                                        ? (selectedCuisineIdx %
                                                            2 ===
                                                            0
                                                            ? selectedCuisineIdx +
                                                            1
                                                            : selectedCuisineIdx) +
                                                        index +
                                                        1
                                                        : index
                                                );
                                            }
                                        }}
                                        activeNumber={
                                            selectedCuisineList[item._id]
                                                ?.length ?? 0
                                        }
                                    />
                                </>
                            ))}
                    </div>
                </div>
            )}
        </OnboardingLayout>
    );
};

export const AlphabetScroll = ({
    onChange,
    charactersMap = defaultCharactersMap,
}) => {
    const alphabets = Object.keys(charactersMap);
    console.log(charactersMap);
    const [selectedItem, setSelectedItem] = useState(25);
    const getMarks = () => {
        let obj = {};
        alphabets.reverse().forEach((a, idx) => {
            obj = {
                ...obj,
                [idx]: {
                    style: {
                        color: selectedItem === idx ? "#292929" : "#c7c7c2",
                        transform:
                            selectedItem === idx ? "scale(1.5)" : "scale(1)",
                        textTransform: "uppercase",
                    },
                    label: <strong>{a}</strong>,
                },
            };
        });
        return obj;
    };
    useEffect(() => {
        document.getElementsByClassName("rc-slider-handle")[0].innerText = "A";
    }, []);
    return (
        <CustomSlider
            defaultValue={selectedItem}
            marks={getMarks()}
            max={25}
            dots={false}
            vertical
            handleStyle={{
                width: "25px",
                height: "25px",
                marginTop: "-9px",
                backgroundImage: `url(${sliderHead})`,
                backgroundSize: "contain",
                border: "none",
                "&:after": {
                    content: "21",
                },
                transform: "translateY(45%) !important",
            }}
            onChange={(e) => {
                setSelectedItem(e);
                vibrate();
                scrollWithOffset(charactersMap[alphabets[e]]);
            }}
            onStepChange={(e) => {
                document.getElementsByClassName(
                    "rc-slider-handle"
                )[0].innerText = alphabets[e].toUpperCase();
                vibrate();
                scrollWithOffset(charactersMap[alphabets[e]]);
            }}
        />
    );
};

const scrollWithOffset = (id) => {
    let element = document.getElementById(id);
    const scroller = document.getElementById("scroll-viewer");
    if (element !== null) {
        scroller.scrollTop = element.offsetTop - 79;
    }
};

export const Ingredients = ({
    title = "Ingredients",
    hideNext = false,
    onCuisineSelected = () => { },
    onSubCuisineSelected = () => { },
}) => {
    const [cuisineList, setCuisineList] = useState([]);
    const [loader, setLoader] = useState(true);
    const [cuisineSubList, setCuisineSubList] = useState([]);
    const [selectedCuisine, setSelectedCuisine] = useState(null);
    const [selectedSubCuisine, setSelectedSubCuisine] = useState([]);
    const [selectedCuisineList, setSelectedCuisineList] = useState({});
    const [selectedCuisineIdx, setSelectedCuisineIdx] = useState(-2);
    const subRef = useRef();
    const history = useHistory();

    function setCuisine(id, index) {
        const cuisine = cuisineList.find((c) => c._id === id);
        setCuisineSubList([]);
        setSelectedCuisine(cuisine);
        setSelectedCuisineIdx(index);
    }

    function resetSelectedCuisine() {
        vibrate();
        setSelectedCuisine(null);
    }

    function setSubCuisine(id) {
        vibrate();
        let old = [...selectedSubCuisine];
        if (old.includes(id)) {
            setSelectedSubCuisine(old.filter((c) => c !== id));
            setSelectedCuisineList((s) => ({
                ...s,
                [selectedCuisine._id]: s[selectedCuisine._id].filter(
                    (s) => s !== id
                ),
            }));
        } else {
            old.push(id);
            // setSelectedSubCuisine([id]);
            // setSelectedCuisineList(s => ({
            //     [selectedCuisine._id]: s[selectedCuisine._id] === undefined ? [id] : [id]
            // }))
            setSelectedSubCuisine(old);
            setSelectedCuisineList((s) => ({
                ...s,
                [selectedCuisine._id]:
                    s[selectedCuisine._id] === undefined
                        ? [id]
                        : s[selectedCuisine._id].concat(id),
            }));
        }
    }

    function setAll() {
        vibrate();
        if (
            selectedSubCuisine.filter((ssc) =>
                map(cuisineSubList, "_id").includes(ssc)
            ).length > 0 &&
            cuisineSubList?.length ===
            selectedSubCuisine.filter((ssc) =>
                map(cuisineSubList, "_id").includes(ssc)
            ).length +
            1
        ) {
            setSelectedSubCuisine(
                selectedSubCuisine.filter(
                    (ssc) => !map(cuisineSubList, "_id").includes(ssc)
                )
            );
            setSelectedCuisineList((s) => {
                return {
                    ...s,
                    [selectedCuisine._id]: [],
                };
            });
        } else {
            const squash = [
                ...selectedSubCuisine,
                ...cuisineSubList
                    .filter((c) => c.name.toLowerCase() !== "all")
                    .map((c) => c._id),
            ];

            setSelectedSubCuisine([...new Set(squash)]);
            setSelectedCuisineList((s) => ({
                ...s,
                [selectedCuisine._id]: squash,
            }));
        }
    }

    function handleCuisineState() {
        if (
            selectedSubCuisine.filter((ssc) =>
                map(cuisineSubList, "_id").includes(ssc)
            ).length
        ) {
            // setSelectedCuisineList(s => ({
            //     ...s,
            //     [selectedCuisine.name]: selectedSubCuisine.filter((ssc) =>
            //         map(cuisineSubList, "_id").includes(ssc)
            //     ).length
            // }))
        }
        setSelectedCuisineIdx(-2);
    }

    function nextStep() {
        const native = [],
            regional = [];
        for (let key in selectedCuisineList) {
            if (selectedCuisineList[key].length > 0) {
                native.push(key);
                regional.push(...selectedCuisineList[key]);
            }
        }
        history.push("/step-3", {
            ...history.location.state,
            native,
            regional,
        });
    }

    async function fetchMainCuisines() {
        setLoader(true);
        const res = await axios.get(`${baseUrl}/cuisine/main`);
        const { withImages, withoutImages } = res.data.data[0];
        const data = withImages.concat(withoutImages);
        const withImage = data.filter((d) => "image" in d);
        const withoutImage = data.filter((d) => !("image" in d));
        let cuisines = withImage.concat(withoutImage);
        cuisines = cuisines.sort((a, b) => a.name.localeCompare(b.name));
        setCuisineList(cuisines.map((d, idx) => ({ ...d, idx })));
        setLoader(false);
    }

    async function fetchSubMainCuisines(name) {
        const res = await axios({
            url: `${baseUrl}/cuisine/regional?name=${name}`,
            method: "GET",
            data: {
                name,
            },
        });
        const { data } = res.data;
        const withImage = data.filter((d) => "image" in d);
        const withoutImage = data.filter((d) => !"image" in d);
        let cuisines = withImage.concat(withoutImage);
        cuisines = cuisines.sort((a, b) => a.name.localeCompare(b.name));
        setCuisineSubList(cuisines);
        setTimeout(() => {
            subRef?.current?.scrollIntoView({ behavior: "smooth" });
        }, 1);
    }

    useEffect(() => {
        const native = [],
            regional = [];
        for (let key in selectedCuisineList) {
            if (selectedCuisineList[key].length > 0) {
                native.push(key);
                regional.push(...selectedCuisineList[key]);
            }
        }
        onCuisineSelected(native);
        onSubCuisineSelected(regional);
    }, [selectedCuisineList]);

    useEffect(() => {
        if (selectedCuisine) {
            fetchSubMainCuisines(selectedCuisine.name);
        }
    }, [selectedCuisine]);

    useEffect(() => {
        fetchMainCuisines();
    }, []);
    console.log(selectedCuisineIdx);
    return (
        <OnboardingLayout
            title={title}
            hideNext={hideNext}
            disableNext={!selectedSubCuisine.length}
            onNextClick={nextStep}
            onSearchText={(text) => {
                return cuisineList
                    .filter((item) =>
                        item.name.toLowerCase().startsWith(text.toLowerCase())
                    )
                    .map((i) => ({
                        name: i.name,
                        ...i,
                        image: i.image?.imageUrl || getImage(i.idx),
                    }));
            }}
            onSearchSelected={(item) => {
                setCuisine(item._id, item.idx);
            }}
        >
            {loader && <Loader loading={loader} isComponent />}
            {!loader && (
                <div className="past-food-habit">
                    <div className="cuisine-list">
                        {cuisineList
                            .filter(
                                (i, idx) =>
                                    idx <=
                                    (selectedCuisineIdx % 2 === 0
                                        ? selectedCuisineIdx + 1
                                        : selectedCuisineIdx)
                            )
                            .map((item, index) => (
                                <>
                                    {selectedCuisineIdx === index ? (
                                        <div></div>
                                    ) : (
                                        <CuisineItem
                                            index={item.idx}
                                            key={item._id}
                                            {...item}
                                            onClick={(id) => {
                                                vibrate();
                                            }}
                                            activeNumber={
                                                selectedCuisineList[item._id]
                                                    ?.length ?? 0
                                            }
                                        />
                                    )}
                                </>
                            ))}
                    </div>
                    {selectedCuisineIdx > -1 && (
                        <div className="selected-cuisine" ref={subRef}>
                            <div className="selected-cuisine__info">
                                <div className="selected-cuisine__info--image">
                                    <img
                                        src={getCompressedImgUrl(
                                            selectedCuisine.image?.imageUrl ||
                                            getImage(selectedCuisineIdx))
                                        }
                                    />
                                    <span
                                        className="close"
                                        onClick={resetSelectedCuisine}
                                    >
                                        <CloseIcon
                                            onClick={handleCuisineState}
                                        />
                                    </span>
                                    <span className="highlight" />
                                </div>
                                <h4 style={{ textAlign: "center" }}>
                                    {selectedCuisine.name}
                                </h4>
                                <p>
                                    {cuisineSubList?.length - 1 || 0} Categories
                                </p>
                            </div>
                        </div>
                    )}
                    {selectedCuisineIdx > -1 && (
                        <div className="selected-cuisine__items">
                            {cuisineSubList
                                ?.filter(
                                    (item) => item.name.toLowerCase() === "all"
                                )
                                .map((item) => (
                                    <CuisineSubItem
                                        key={item._id}
                                        selectedCuisineIdx={selectedCuisineIdx}
                                        width={80}
                                        {...item}
                                        onClick={setAll}
                                        active={
                                            selectedSubCuisine.filter((ssc) =>
                                                map(
                                                    cuisineSubList,
                                                    "_id"
                                                ).includes(ssc)
                                            ).length > 0 &&
                                            cuisineSubList?.length ===
                                            selectedSubCuisine.filter(
                                                (ssc) =>
                                                    map(
                                                        cuisineSubList,
                                                        "_id"
                                                    ).includes(ssc)
                                            ).length +
                                            1
                                        }
                                    />
                                ))}
                            {cuisineSubList
                                .filter(
                                    (item) => item.name.toLowerCase() !== "all"
                                )
                                .map((item) => (
                                    <CuisineSubItem
                                        key={item._id}
                                        selectedCuisineIdx={selectedCuisineIdx}
                                        width={80}
                                        {...item}
                                        onClick={setSubCuisine}
                                        active={selectedSubCuisine.includes(
                                            item._id
                                        )}
                                    />
                                ))}
                        </div>
                    )}
                    <div className="cuisine-list">
                        {cuisineList
                            .filter(
                                (i, idx) =>
                                    idx >
                                    (selectedCuisineIdx % 2 === 0
                                        ? selectedCuisineIdx + 1
                                        : selectedCuisineIdx)
                            )
                            .map((item, index) => (
                                <>
                                    <CuisineItem
                                        index={item.idx}
                                        key={item._id}
                                        {...item}
                                        onClick={(id) => {
                                            vibrate();
                                            setCuisine(
                                                id,
                                                selectedCuisineIdx > -1
                                                    ? (selectedCuisineIdx %
                                                        2 ===
                                                        0
                                                        ? selectedCuisineIdx +
                                                        1
                                                        : selectedCuisineIdx) +
                                                    index +
                                                    1
                                                    : index
                                            );
                                        }}
                                        activeNumber={
                                            selectedCuisineList[item._id]
                                                ?.length ?? 0
                                        }
                                    />
                                </>
                            ))}
                    </div>
                </div>
            )}
        </OnboardingLayout>
    );
};
export const CuisineItem = ({
    index,
    activeNumber,
    image,
    name,
    onClick,
    _id,
    showActive = true,
}) => {
    return (
        <div
            className="cuisine mb-36px"
            onClick={() => onClick(_id)}
            id={name.substr(0, 1)}
        >
            <div
                className={cx("cuisine__image-wrapper", {
                    "cuisine__image-wrapper--active": activeNumber,
                })}
            >
                <img
                    className="highlight"
                    src={getCompressedImgUrl(image?.[0] || getImage(index), 100, 100)}
                />
                {!!activeNumber && showActive && <div>{activeNumber}</div>}
            </div>
            <Text className='mt-12px text-capitalize'>{name}</Text>
        </div>
    );
};

export const getImage = (index = 0) => {
    const images = [
        "https://pikky.s3.amazonaws.com/patterns/Property 1=Checkers, Type=1.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=Checkers, Type=2.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=Checkers, Type=3.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=Circle, Type=1.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=Circle, Type=3.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=CirclePlay, Type=1.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=CirclePlay, Type=2.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=CirclePlay, Type=3.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=ConcentricCircles, Type=1.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=ConcentricCircles, Type=2.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=ConcentricCircles, Type=3.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=Diamond, Type=1.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=Diamond, Type=2.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=Diamond, Type=3.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=Pie, Type=1.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=Pie, Type=2.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=Pie, Type=3.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=SemicirclesHorizontal, Type=1.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=SemicirclesHorizontal, Type=2.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=SemicirclesHorizontal, Type=3.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=SemicirclesVertical, Type=1.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=SemicirclesVertical, Type=2.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=SemicirclesVertical, Type=3.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=Stripes, Type=1.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=Stripes, Type=2.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=Stripes, Type=3.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=TriangleDuo, Type=1.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=TriangleDuo, Type=2.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=TriangleDuo, Type=3.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=Triangles, Type=1.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=Triangles, Type=2.png",
        "https://pikky.s3.amazonaws.com/patterns/Property 1=Triangles, Type=3.png",
    ];
    return images[index % images.length];
};
const CuisineSubItem = ({
    image,
    name,
    onClick,
    id,
    _id,
    active,
    selectedCuisineIdx,
    animCuisineList,
    setAnimCuisineList
}) => {
    const isEllipsisActive = (e) => (e.offsetWidth < e.scrollWidth)

    return (
        <div
            className={cx("cuisine-sub", { "cuisine-sub--active": active })}
            onClick={(e) => {
                onClick(_id)

                if (animCuisineList.includes(id)) {
                    setAnimCuisineList(p => p.filter(e => e !== id))
                }

                if (isEllipsisActive(e.currentTarget.childNodes[1])) {
                    setAnimCuisineList(p => [...(new Set([...p, id]))])
                }
            }}
        >
            <img src={getCompressedImgUrl(image?.[0] || getImage(selectedCuisineIdx))} />
            <Text className={'text-center mt-12px text-capitalize'}>{animCuisineList.includes(id) && active ? <marquee scrollamount="3">{name}</marquee> : name}</Text>
            <span className="highlight" />
        </div>
    );
};

export default PastFoodHabit;

export const SearchItem = () => {
    return <div></div>;
};
