import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { HeaderBackArrow, HeaderHomeIcon, BagIcon, PopUpIcon } from "../../assets/icons"
import BackIcon from '../../assets/icons/back.svg'
import { PrimaryButton } from '../../components/primaryButton'
import Input from "../../components/formInput/Input"
import Button from "../../components/buttons"
import { useSelector } from "react-redux";
import axios from "axios"
import { baseUrl } from "../../config/api-config";
import Loader from "../../components/loader/Loader"
import { setPrimaryLocation } from './redux/actions'
import { useDispatch } from "react-redux"
import { setIsLocationEdit } from './redux/actions'
import _, { set } from 'lodash'
import { Title } from "../../components/Fonts"



const initialAddressDetail = {
  latitude: '',
  longitude: '',
  displayAddress: "",
  referenceName: "home",
  displayTitle: "",
  displaySubTitle: "",
  houseNumber: "",
  buildingName: "",
  contactNumber: "",
  referredTo: "home"
}

const AddressDetails = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const locationData = useSelector(state => state.location.location)
  // const pop = useSelector(state => console.log(state))
  const primaryLocation = useSelector(state => state.location.primaryLocation)
  const {isLocationEdit, prvPath, restaurant, dishQuantity} = useSelector(state => state.location.isLocationEdit)
  const [activePlaceBtn, setActivePlaceBtn] = useState('home')
  const [addressDetail, setAddressDetail] = useState(initialAddressDetail)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({});

  const handelActivePlace = (name) => {
    setActivePlaceBtn(name)
    setAddressDetail({ ...addressDetail, referredTo: name.toLowerCase(), referenceName: name.toLowerCase() !== 'other' ? name.toLowerCase() : '' })
  }

  const handelInputOnchange = (e) => {
    setAddressDetail({ ...addressDetail, [e.target.name]: e.target.value.toLowerCase() })
  }

  async function getUserDetails() {
    try {
      const res = await axios.get(`${baseUrl}/user/get/one`)
      setUser(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserDetails();
  }, [])

  useEffect(() => {
    if (locationData && !user.primaryLocation) {
      const { latitude, longitude, value: { description } } = locationData
      console.log('description', description)
      setAddressDetail({
        ...addressDetail,
        latitude: latitude,
        longitude: longitude,
        displayAddress: description,
        displayTitle: "",
        displaySubTitle: ""
      })
    }
  }, [user])


  const onSaveLocation = async () => {
    setLoading(true)
    try {
      const res = await axios.post(`${baseUrl}/user/location`, addressDetail)
        .then(() => {
          dispatch(setPrimaryLocation(addressDetail))
          history.push('/home')
        })

    } catch (error) {
      console.log('Address detail', error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const onEditSaveLocation = async () => {
    const locationDataSchema = {...primaryLocation, ...addressDetail}
    console.log('locationDataSchema', locationDataSchema)
    setLoading(true)
    try {
        await axios.put(`${baseUrl}/user/location/${primaryLocation._id}`, locationDataSchema)
        .then(() => {
          dispatch(setPrimaryLocation(locationDataSchema))
          isLocationEdit ? history.push(prvPath, {restaurant, dishQuantity}) : history.push('/home')
          isLocationEdit && dispatch(setIsLocationEdit({
            isLocationEdit: false,
            prvPath: ''
          }))
        })
    } catch (error) {
      console.log('Address detail', error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='change__location_wrapper'>
      <div className='change__location_header'>
        <button onClick={() => history.goBack()} className='text-btn'>
        <img width={'24px'} height={'24px'} src={BackIcon} />
        </button>
        <Title level={2} className='pl-16px' >Address details</Title>
      </div>
      {loading ?
        <div className="search__loader"
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            alignItems: 'center',
            alignContent: 'center',
            height: 'calc(100vh - 71.19px)'
          }}>
          <Loader loading={loading} isComponent />
        </div>
        :
        <div className="form__wrapper without-header-full__height">
          <div>
            <Input className={'capitalize-text'}
              value={
                addressDetail?.houseNo}
              autoComplete='off'
              onChange={handelInputOnchange}
              name='houseNo' label='House, Flat no'
              placeholder='Enter here...'
            />
            <Input className={'capitalize-text'}
              value={addressDetail?.apartmentName}
              autoComplete='off'
              onChange={handelInputOnchange}
              containerStyle={{ marginTop: 24 }}
              name='apartmentName'
              label='Apartment / Building Name'
              placeholder='Enter here...' />
            <Input className={'capitalize-text'}
              value={addressDetail?.contactNumber}
              autoComplete='off' type="number"
              pattern="[0-9]*" inputMode="numeric"
              onChange={handelInputOnchange}
              containerStyle={{ marginTop: 24 }}
              name='contactNumber' label='Contact Number'
              placeholder='Enter here...'
            />
            <div className="mt-24px">
              <Title level={'subHeading'}>Save this address as</Title>
              <span className="d-flex justify-content-between mt-8px">
                <Button
                  level="subHeading"
                  onClick={() => handelActivePlace('home')}
                  style={{
                    background: activePlaceBtn === 'home' ? '#DBEF064D' : '#fff',
                    height: '48px',
                    borderColor: '#DBEF06',
                  }}
                  icon={<HeaderHomeIcon />}
                  variant={'secondary'}
                  caption={'Home'}
                />
                <Button
                  level="subHeading"
                  onClick={() => handelActivePlace('work')}
                  style={{
                    background: activePlaceBtn === 'work' ? '#DBEF064D' : '#fff',
                    height: '48px',
                    borderColor: '#DBEF06',
                    marginLeft: 16
                  }}
                  icon={<BagIcon />}
                  variant={'secondary'}
                  caption={'Work'}
                />
                <Button
                  level="subHeading"
                  onClick={() => handelActivePlace('other')}
                  style={{
                    background: activePlaceBtn === 'other' ? '#DBEF064D' : '#fff',
                    height: '48px',
                    borderColor: '#DBEF06',
                    marginLeft: 16
                  }}
                  icon={<PopUpIcon />}
                  variant={'secondary'}
                  caption={'Other'}
                />
                {console.log("here", addressDetail)}
              </span>
            </div>
            {
              addressDetail?.referredTo === 'other' &&
              <Input
                value={addressDetail?.referenceName}
                onChange={handelInputOnchange} name='referenceName'
                containerStyle={{ marginTop: 16 }}
                placeholder='eg : Parents home, Ronnie’s home' />
            }
          </div>
          <div>
            <Button variant={'primary'} onClick={isLocationEdit ? onEditSaveLocation : onSaveLocation} caption='Save Address' />
          </div>
        </div>}
    </div>
  )
}

export default AddressDetails