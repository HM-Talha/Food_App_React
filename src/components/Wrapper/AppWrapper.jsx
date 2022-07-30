import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { setMenu } from '../../onState/actions'
import { stringToMap } from '../../utils/parseQuery'

const AppWrapper = ({children}) => {
    const location = useLocation()

    const dispatch = useDispatch()
    const { isMenu } = useSelector((state) => state.onState)


    useEffect(() => {
        const query = location.search
        const isPopupOpen = stringToMap(query).get('popup')
        
        if (isPopupOpen && isPopupOpen === 'open') {
            console.log(stringToMap(query).get('popup'))
            if (!isMenu) dispatch(setMenu(true))
        } else {
            if (isMenu) dispatch(setMenu(false))
        }

        
    }, [location.search])
    
  return (
    <>{ children && children }</>
  )
}

export default AppWrapper