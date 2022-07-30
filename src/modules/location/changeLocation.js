import { useEffect, useState } from 'react';
import { HeaderBackArrow, SendIcon } from '../../assets/icons'
import { MarkerVectorIcon, HomeVectorIcon, BagVectorIcon } from '../../assets/IconComponents'
import { useHistory } from 'react-router-dom'
import axios from "axios";
import { baseUrl } from "../../config/api-config";
import { setLocation } from './redux/actions'
import { useDispatch, useSelector } from "react-redux";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { geocodeByPlaceId, geocodeByAddress, getLatLng,geocodeByLatLng  } from 'react-google-places-autocomplete';
import { setPrimaryLocation } from "./redux/actions";
import { setIsLocationEdit } from './redux/actions'
import Loader from "../../components/loader/Loader"
import CurrentLocation from 'react-current-location-address'
import _ from 'lodash'
import { resetRestaurantsByDish } from '../home/redux/actions';
import BackIcon from '../../assets/icons/back.svg'
import { Footnote, Text, Title } from '../../components/Fonts';

const LocationOption = ({ innerProps, innerRef, data }) => {
  return (
    <div ref={innerRef} {...innerProps} style={{flexDirection: 'column'}} className='place__wrapper'>
      <Text>{data.label.split(',')[0]}</Text>
      <Title level={'subHeading'} className='mt-4px' color={'#8A8A87'}>{data.value.description}</Title>
    </div>
  )
}


const ChangeLocation = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const {isLocationEdit, prvPath, restaurant, dishQuantity } = useSelector(state => state.location.isLocationEdit)
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const getUserDetails = async () => {
    try {
      const res = await axios.get(`${baseUrl}/user/get/one`)
      setUser(res.data.data)
      const primaryLocation = _.find(res.data.data.locations, [ '_id', res.data.data.primaryLocation])
      dispatch(setPrimaryLocation(primaryLocation))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserDetails()
  }, [])


  const onHandelLocation = (v) => {
      // console.log("V" , v)
      geocodeByPlaceId(v.value.place_id)
          .then(results => {
              const latitude = results[0].geometry.location.lat();
              const longitude = results[0].geometry.location.lng();
              dispatch(setLocation({ ...v, latitude, longitude }));
              history.push('/location')
          })
          .catch(error => console.error(error));
  }

  const deleteLocation = async (id) => {
    await axios.delete(`${baseUrl}/user/location/${id}`);
  }

    const getPrimaryLocation = async (id, location) => {
        try {
            await axios.post(`${baseUrl}/user/location/${id}/primary`)
            .then(() => {
              getUserDetails()
              dispatch(resetRestaurantsByDish())
            })
            .then(() => {
              isLocationEdit ? history.push(prvPath, {restaurant, dishQuantity}) : history.push('/home')
              isLocationEdit && dispatch(setIsLocationEdit({
                      isLocationEdit: false,
                      prvPath: ''
                    }))
            })
        } catch(error) {
            console.log('getPrimaryLocation', error)
        }
    }
    
    function currentLocation(loading){
      setLoading(true)
      navigator.geolocation.getCurrentPosition(position => {
        const {latitude,longitude} = position.coords
        geocodeByLatLng({ lat: latitude, lng: longitude })
          .then(results => {
            dispatch(setLocation({ ...results[0],label : results[0].formatted_address ,value : {description : results[0].formatted_address, structured_formatting : {main_text : results[0].formatted_address.split(",")[0]}},latitude, longitude }));

            history.push('/location')
            // console.log("Working")
          })
          .catch(error => {console.error(error) ; setLoading(false)});
      }, error => {
          console.error(error)
      })
    }
  return (
    <div className='change__location_wrapper'>
      <div className='change__location_header'>
        {user.primaryLocation && <button onClick={() => history.goBack()} className='text-btn'>
          <img width={'24px'} height={'24px'} src={BackIcon} />
        </button>}
        <Title className={`ml-16px`} level={2}>Enter your location</Title>
      </div>
      <div className='input-search-wrap'>
        <GooglePlacesAutocomplete
          minLengthAutocomplete={3}
          apiKey='AIzaSyCnJymfyIpprLsoWSONduHQ6_RBtSPn82g'
          selectProps={{
            onChange: (v) => onHandelLocation(v),
            className: 'mt-1',
            components: {
              IndicatorSeparator: () => null,
              DropdownIndicator: () => null,
              Option: (props) => <LocationOption {...props} />,
            },
            placeholder: 'Search for area, street name',
            styles: {
              input: (provided, state) => ({
                ...provided,
                border: state.isFocused ? 0 : 0,
                width: '100%',
                fontSize: 22,
                textIndent: 4
              }),
              control: (provided, state) => ({
                ...provided,
                border: state.isFocused ? 0 : 0,
                boxShadow: state.isFocused ? 'none' : 'none',
                width: '100%'
              }),
              placeholder: (provided, state) => ({
                ...provided,
                color: '#CCCCC8',
                fontSize: 22,
                textIndent: 8
              }),
              menu: (provided, state) => ({
                ...provided,
                marginTop: 74,
                border: 'none',
                boxShadow: 'none',
                height: 'calc(100vh - 184px )'
              }),

              menuList: (provided, state) => ({
                ...provided,
                maxHeight: 'calc(100vh - 184px )',
                "::-webkit-scrollbar": {
                  display: 'none'
                },
              }),

            }
          }}
        />
        <button className='text-btn mt-24px' onClick={currentLocation} style={{ display: 'flex', alignItems: 'center' }}>
          <SendIcon /> <Title level='subHeading' color={'#748000'} className='ml-8px'>Use current location</Title>
        </button>
        {/* <CurrentLocation
            onFetchAddress={(results) => {console.log(results)}}
            onError={(type, status) => {}}
          >
            {({ getCurrentLocation, loading }) => (
              <button onClick={getCurrentLocation}>
                Get Current Location
              </button>
            )}
        </CurrentLocation> */}
      </div>
      {/* {user?.locations?.length > 0 && <h6 className='mt-2' style={{fontWeight: 600}}>Saved address</h6>} */}
      <div className='search-autocomplete_wrapper'>
        {user.primaryLocation && <Title level={'headLine'} className='title-save-address'>Saved address</Title>}
        {
          loading ?
            <Loader loading={loading} isComponent />
            :
            user?.locations?.map((location, index) => {
              return (
                <div onClick={() => user?.primaryLocation !== location?._id ? getPrimaryLocation(location?._id, location) : null} key={location?._id} className='place__wrapper'>
                  <span className='mr-12px'>
                    {location?.referredTo === "other" && <MarkerVectorIcon color={user?.primaryLocation === location?._id} />}
                    {location?.referredTo === "home" && <HomeVectorIcon color={user?.primaryLocation === location?._id} />}
                    {location?.referredTo === "work" && <BagVectorIcon color={user?.primaryLocation === location?._id} />}
                  </span>
                  <div style={{flexGrow: 1}}>
                    <Title level={'subHeading'}>
                      <span>
                      {location?.houseNo || location?.referredTo} {" "}
                      {location?.apartmentName || ""}
                      </span>
                      {/* user?.primaryLocation !== location?._id && <span onClick={() => deleteLocation(location?._id)} className='delete-btn'>delete</span> */}
                    </Title>
                    <Footnote color={'#8A8A87'}>{location?.displayAddress}</Footnote>
                  </div>
                </div>
              )
            })
        }

      </div>
    </div>
  )
}

export default ChangeLocation