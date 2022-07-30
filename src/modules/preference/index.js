import { useState, useEffect } from "react"
import { AllergiesIcon, CuisineIcon, DishIcon, HomeVectorIcon } from "../../assets/IconComponents"
import { RightArrowIcon } from "../../assets/icons"
import AppHeader from "../../components/appHeader"
import axios from "axios";
import AllergiesModal from "./AllergiesModal"
import FoodPreferenceModal from "./FoodPreferenceModal"
import { useSelector, useDispatch } from "react-redux"
import "./styles/preference.scss"
import { baseUrl } from "../../config/api-config"
import Loader from "../../components/loader/Loader"
import _ from "lodash"
import { useHistory } from "react-router-dom"
import { setPreferenceIsEdit } from "../../onState/actions";
import { setUserDetails } from "../home/redux/actions";
import { Text, Title } from "../../components/Fonts";

const PreferenceEvent = ({ heading, title, dis, marginTop = 37, icon, onClick }) => {
  return (
    <div onClick={onClick} style={{ marginTop: marginTop }}>
      <Text>{heading}</Text>
      <div className="d-flex justify-content-between align-items-center event-wrapper">
        <div>{icon}</div>
        <div className="event-dis-and-title">
          <Title level={'subHeading'} className='text-capitalize'>{title}</Title>
          <Title level={'subHeading'} className='text-capitalize mt-4px' color={'#8A8A87'}>{dis}</Title>
        </div>
        <div className="open-edit-btn">
          <RightArrowIcon />
        </div>
      </div>
    </div>
  )
}

const Preference = () => {

  const history = useHistory()
  const dispatch = useDispatch()

  const [modal, setModal] = useState('')
  const [allergyList, setAllergyList] = useState([])
  const [filteredAllergies, setFilteredAllergies] = useState([])
  const [useInfo, setUseInfo] = useState([])
  const [loading, setLoading] = useState(true)
  const [subCategory, setSubCategory] = useState('')
  const [mainCategory, setMainCategory] = useState('')
  const [userDefaultAllergies, setUserDefaultAllergies] = useState('')
  const [homeCuisines, setHomeCuisines] = useState('')
  const [likeCuisine, setLikeCuisine] = useState('')
  const state = useSelector(state => state)

  const fetchAllergies = async () => {
    if (allergyList.length === 0) {
      const res = await axios.get(`${baseUrl}/cuisine/get-allergies`);
      setAllergyList(res.data.data)
    }
  }

  const getUserDetails = async () => {
    try {
      const res = await axios.get(`${baseUrl}/user/get/one`)
      setUseInfo(res.data.data)
     await dispatch(setUserDetails(res.data.data))
     await setSubCategory(res.data.data.subCategory)
     await setMainCategory(res.data.data.mainCategory)
    } finally {
      setLoading(false)
    }
  }

  const getHomeCuisines = async () => {
    try {
      const homeCuisines = await axios.post(`${baseUrl}/cuisine/getAllCuisineByIds/`, {
        data: useInfo?.nativeCuisine,
        cuisineType: 0
      })
      const homeCuisineData = _.map(homeCuisines.data.data, (o) => _.capitalize(o.name[0].name)).join(', ')
      setHomeCuisines(homeCuisineData)
    } catch (error) {
      console.log(error)
    }
  }

  const getLikesCuisines = async () => {
    try {
      const homeCuisines = await axios.post(`${baseUrl}/cuisine/getAllCuisineByIds/`, {
        data: useInfo?.likedCuisine,
        cuisineType: 0
      })
      const likeCuisineData = _.map(homeCuisines.data.data, (o) => _.capitalize(o.name[0].name)).join(', ')
      setLikeCuisine(likeCuisineData)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getHomeCuisines()
    getLikesCuisines()
  }, [useInfo?.nativeCuisine])

  useEffect(() => {
    fetchAllergies()
    getUserDetails();
  }, []);


  useEffect(() => {
    const filterListAllergies = _.filter(allergyList, (o) => _.includes(useInfo?.parentAllergies, o._id))
    const allergies = filterListAllergies.map((allergies) => _.capitalize(allergies?.parentAllergy)).join(', ')

    setUserDefaultAllergies(allergies)
  }, [allergyList, useInfo])

  const handleHomeCuisineEdit = async () => {
    await dispatch(setPreferenceIsEdit(true))
    history.replace('/step-8')
  }

  const handleFavoriteCuisineEdit = async () => {
    await dispatch(setPreferenceIsEdit(true))
    history.replace('/step-10')
  }


  const allergiesFiltered = async () => {
    if(subCategory == 'eat all') return setAllergyList(allergyList)
    const filterAllergies = _.filter(allergyList, (o) => _.includes(o.subCategory, useInfo?.subCategory))
    setFilteredAllergies(filterAllergies)
  }
  
  useEffect(() => {
    allergiesFiltered()
  }, [allergyList,  useInfo.subCategory])

  useEffect(() => {
    document.getElementById('backdrop').addEventListener('click', () => {setModal('')})
    return () => {
      document.getElementById('backdrop').addEventListener('click', () => null)
    }
  }, [])

  return (
    <>
      <div className="preference-wrapper">
        <div className="position-fixed" style={{ width: '100%', zIndex: 2, backgroundColor: '#fff' }}>
          <AppHeader isBack={true} title='Preference' />
        </div>
        {loading ?
          <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Loader loading={loading} />
          </div>
          :

          <div className="preference-body">

            <PreferenceEvent
              marginTop={0}
              onClick={handleHomeCuisineEdit}
              heading={'Feels like home'}
              title={'Home cuisines'}
              dis={homeCuisines || ''}
              icon={<HomeVectorIcon size={32} color={'#DBEF06'} />}
            />
            <PreferenceEvent
              onClick={handleFavoriteCuisineEdit}
              heading={'Other favourite cuisines'}
              title={'Favourite cuisine'}
              dis={likeCuisine.length ? likeCuisine : 'No cuisines selected'}
              icon={<CuisineIcon />}
            />
            <PreferenceEvent
              onClick={() => setModal('food-preference')}
              heading={'Your food preference'}
              title={'Food preference'}
              dis={useInfo?.subCategory}
              icon={<DishIcon />}
            />
            <PreferenceEvent
              onClick={() => setModal('allergies')}
              heading={'Your allergies'}
              title={'Allergies'}
              dis={userDefaultAllergies.length ? userDefaultAllergies : 'None'  }
              icon={<AllergiesIcon />}
            />
          </div>}
      </div>
      <div className="preference-popup-wrapper">
        <FoodPreferenceModal
         allergiesFiltered={allergiesFiltered}
          getUserDetails={getUserDetails}
          mainCategory={mainCategory}
          setMainCategory={setMainCategory}
          setSubCategory={setSubCategory}
          subCategory={subCategory}
          modal={modal}
          onClick={() => setModal('')} />
        <AllergiesModal getUserDetails={getUserDetails}
          useInfo={useInfo}
          allergyList={filteredAllergies}
          modal={modal}
          onClick={() => setModal('')} />
      </div>
    </>
  )
}

export default Preference