import React from 'react'
import './style.scss'
import { MarkerVectorIcon, HomeVectorIcon, BagVectorIcon, PageBackIcon } from '../../assets/IconComponents'


import { useSelector } from "react-redux";

const LocationCard = ({onEditClick}) => {
    const primaryLocation = useSelector(state => state.location.primaryLocation)

    let address =  [
        primaryLocation?.houseNo,
        primaryLocation?.apartmentName,
        primaryLocation?.displayAddress
      ].join(" ") 

  return (
    <div className='location__card_wrapper'>
        <div className='location__info'>
            <span className='place'>
            <h5>
            {primaryLocation?.referredTo === "other" && <MarkerVectorIcon color={true} />}
            {primaryLocation?.referredTo === "home" && <HomeVectorIcon color={true} />}
            {primaryLocation?.referredTo === "work" && <BagVectorIcon color={true} />}
            <span style={{marginLeft: 6, textTransform: 'capitalize'}}>{primaryLocation?.referredTo}</span>
            </h5>
            </span>
            <p className='description' style={{textTransform: 'capitalize'}}>
            {address && address.slice(0, 80)}
            {address.length > 80 && '...'}
            </p>
        </div>
        <span className='action-btn'>
            <button onClick={onEditClick}>Edit</button>
        </span>
    </div>
  )
}

export default LocationCard