import { RightArrowIcon } from '../../assets/icons'
import { MarkerVectorIcon, HomeVectorIcon, BagVectorIcon, PageBackIcon } from '../../assets/IconComponents'


import { useSelector } from "react-redux";
import { useHistory } from 'react-router-dom'
import { useEffect } from 'react';
import { Footnote, Title } from '../Fonts';

const AppHeader = ({ isBack, title, isLeftIcon, isRightIcon, path }) => {
  const history = useHistory()
  const primaryLocation = useSelector(state => state.location.primaryLocation)

  let address =  [
    primaryLocation?.houseNo,
    primaryLocation?.apartmentName,
    primaryLocation?.displayAddress
  ].join(" ") 

  useEffect(() => {
    console.log('address', address)
  }, [primaryLocation])

  if(isBack) {
    return (
      <div className="app__header" style={{border: 'none'}}>
      <div  className="location__title_wrapper" >
          <div className="d-flex" style={{alignItems: 'center'}}>
            {!isLeftIcon && <span onClick={() => path ? history.push(path) : history.goBack()} ><PageBackIcon /></span>}
             <Title level={2}  className="flex-grow-1 mt-0" style={{textIndent: 20, textTransform: 'capitalize', marginBottom: 0}}>{
               title
             }</Title>
          </div>
      </div>
      { isRightIcon && <span>
          <RightArrowIcon />
      </span>}
  </div>   
    )
  }

  return (
    <div style={{height: 'auto', padding: '16px 24px'}} className="app__header" onClick={() => history.push('/change-location')}>
    <div  className="location__title_wrapper" >
        <Title level={'headLine'} className='d-flex align-items-center'>
              {primaryLocation?.referredTo === "other" && <MarkerVectorIcon color={true} />}
              {primaryLocation?.referredTo === "home" && <HomeVectorIcon color={true} />}
              {primaryLocation?.referredTo === "work" && <BagVectorIcon color={true} />}
              <span  className="flex-grow-1" style={{textIndent: 10, textTransform: 'capitalize'}}>{primaryLocation?.referredTo}</span>
        </Title>
        <Footnote className={'mt-4px'}>
            {address && address.slice(0, 37)}
            {address.length > 37 && '...'}
        </Footnote>
    </div>
    <span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M8.29289 5.29289C8.68342 4.90237 9.31658 4.90237 9.70711 5.29289L15.7071 11.2929C16.0976 11.6834 16.0976 12.3166 15.7071 12.7071L9.70711 18.7071C9.31658 19.0976 8.68342 19.0976 8.29289 18.7071C7.90237 18.3166 7.90237 17.6834 8.29289 17.2929L13.5858 12L8.29289 6.70711C7.90237 6.31658 7.90237 5.68342 8.29289 5.29289Z" fill="#292929"/>
      </svg>
    </span>
</div>
  )
}

export default AppHeader