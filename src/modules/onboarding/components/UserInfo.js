import React, {useEffect, useState} from "react";
import cx from "classnames";
import debounce from "lodash/debounce"
import { useHistory } from "react-router-dom";

import OnboardingLayout from "../../../components/layout/OnboardingLayout";
import Input from "../../../components/formInput/Input";

import { PictureIcon } from "../../../assets/icons";

import "../styles/userinfo.scss";
import Tag from "../../../components/tags/Tag";
import CustomSlider from "../../../components/Slider/Slider";
import axios from "axios";
import {baseUrl} from "../../../config/api-config";
import {useSelector} from "react-redux";
import {vibrate} from "./FoodtypeSelector";

const UserInfo = () => {
  const userInfo = JSON.parse(localStorage.getItem("user")).user;

  const [state, setState] = useState({
    // name: userInfo.first_name + " " + userInfo.last_name,
    name: "",
    id: "",
    gender: "male",
    age: 25,
  });
  const [fileUrl, setFileUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [page, setPage] = useState(1);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const { name, id, gender, age } = state;
  const history = useHistory();


  async function fetchUserName(name){
    try {
        const res = await axios.get(`${baseUrl}/user/check-username?name=${name}`);

      setUsernameAvailable(true)
    }catch (e){
      setUsernameAvailable(false)
      console.log(e)
    }
  }


  async function nextStep() {
    if (page < 2) {
      setPage(page + 1);
    } else {
      setTimeout(async () => {
        var bodyFormData = new FormData();
        bodyFormData.append("image", file);
        bodyFormData.append("age", age);
        bodyFormData.append("gender", gender);
        bodyFormData.append("userName", id);
        bodyFormData.append("name", name);
        const res = await axios.put(`${baseUrl}/user/update/users`,
            bodyFormData);
      }, 1)
      history.push("/home");
    }
  }
  function lastStep() {
    if (page !== 1) {
      setPage(page - 1);
    } else {
      history.goBack();
    }
  }
  function handleProfilePic(e) {
    const file = e.target.files[0];
    setFile(file);
    toBase64(file).then((fileUrl) => setFileUrl(fileUrl));
  }
  function handleChange(e) {
    const { name, value } = e.target;
    if(name === "id"){
      debounce(()=>fetchUserName(value),500)()
    }
    setState({
      ...state,
      [name]: value,
    });
  }

  function page1Validation() {
    return !name.length || !id.length || !usernameAvailable;
  }
  function handleSliderChange(value) {
    setState({
      ...state,
      age: value,
    });
  }

  function handleGenderChange(gender) {
    setState({
      ...state,
      gender,
    });
  }
  function page2Validation() {}
  return (
    <OnboardingLayout
      title="I am"
      disableNext={page === 1 ? page1Validation() : page2Validation()}
      onNextClick={nextStep}
      hideSearch={true}
      onBackClick={lastStep}
    >
      <div className="user-info">
        <ProfilePicture fileUrl={fileUrl} handleProfilePic={handleProfilePic} />
        <BasicInfo show={page === 1} {...state} usernameAvailable={usernameAvailable} handleChange={handleChange} />
        <BasicInfo2
          show={page === 2}
          {...state}
          handleSliderChange={handleSliderChange}
          handleGenderChange={handleGenderChange}
        />
      </div>
    </OnboardingLayout>
  );
};

const ProfilePicture = ({ fileUrl, handleProfilePic }) => {
  return (
    <div className="profile-pic">
      <div
        className={cx("profile-pic__empty", {
          "profile-pic__empty--1": !!fileUrl,
        })}
      >
        <label htmlFor="file">
          {fileUrl ? (
            <img
              src={fileUrl}
              alt="profile picture"
              className="profile-pic__uploaded"
            />
          ) : (
            <>
              <PictureIcon />
              <p>Upload Photo here</p>
            </>
          )}
        </label>
        <input
          type="file"
          name="file"
          id="file"
          accept="image/*"
          className="inputfile"
          onChange={handleProfilePic}
        />
      </div>
    </div>
  );
};

const BasicInfo = ({ name, id, handleChange, show, usernameAvailable }) => {
  return (
    <div className={cx("basic-info", { "basic-info--show": show })}>
      <Input
        name="name"
        value={name}
        placeholder="Name"
        onChange={handleChange}
      />
      <Input
        name="id"
        value={id}
        placeholder="Unique Id"
        onChange={handleChange}
        className={!usernameAvailable && "error"}
      />
    </div>
  );
};

const BasicInfo2 = ({
  gender,
  age,
  handleGenderChange,
  show,
  handleSliderChange,
}) => {
  return (
    <div className={cx("basic-info-2", { "basic-info-2--show": show })}>
      <div className="basic-info-2--section">
        <h6>Gender</h6>
        <div className="basic-info-2--section--wrapper">
          <Tag
            name="Male"
            active={gender === "male"}
            onChange={() => handleGenderChange("male")}
          />
          <Tag
            name="Female"
            active={gender === "female"}
            onChange={() => handleGenderChange("female")}
          />
          <Tag
            name="Other"
            active={gender === "other"}
            onChange={() => handleGenderChange("other")}
          />
        </div>
      </div>
      <div className="basic-info-2--section">
        <h6>Age</h6>
        <div >
          <CustomSlider value={age} onChange={(e) => {
            vibrate()
            handleSliderChange(e)
          }} />
        </div>
      </div>
    </div>
  );
};

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default UserInfo;
