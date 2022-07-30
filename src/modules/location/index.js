import './style/location.scss'
import {useHistory} from 'react-router-dom'
import MapComponent from '../../components/map'
import BackIcon from '../../assets/icons/back.svg'
import "./style/location.scss";
import {useSelector} from "react-redux";
import Loader from "../../components/loader/Loader";
import {useEffect, useState} from "react";
// import { setIsLocation } from "../../onState/actions";
import {Text, Title} from '../../components/Fonts'
import Button from '../../components/buttons'

const Location = () => {
    const history = useHistory();
    // const dispatch = useDispatch();
    const primaryLocation = useSelector(
        (state) => state.location.primaryLocation
    );
    const locationData = useSelector((state) => state.location);
    const [loading, setLoading] = useState(true);
    const [locationEmpty, setLocationEmpty] = useState(true);

    useEffect(() => {
        setLoading(false);
    });

    return (
        <>
            {loading ? (
                <Loader loading={loading} isComponent/>
            ) : (
                <div className="location__wrapper">
                    <button onClick={() => {
                        locationEmpty ? history.replace("/change-location") : history.push("/home")
                    }} className="back-btn">
                        <img width={'16px'} height={'16px'} src={BackIcon}/>
                    </button>
                    <div className="location-info">
                        <div>
                            <div className='w-100 d-flex justify-content-between'>
                                <Text className='capitalize-text' color='#292929'>
                                    {locationData?.location?.value?.structured_formatting?.main_text}
                                </Text>
                                <button onClick={() => history.push('/change-location')} className='text-btn'>
                                    <Title level={'subHeading'} color="#748000">Change</Title>
                                </button>
                            </div>
                            <Title color={'#8A8A87'} level={'subHeading'} className='capitalize-text mt-4px'>
                                {locationData?.location?.label && locationData?.location?.label.slice(0, 40) + '...'}
                            </Title>
                        </div>
                        <Button variant={'primary'} onClick={() => {
                            setLocationEmpty(false);
                            history.push('/address-details');
                        }} caption='Confirm Location'/>
                    </div>
                    <div
                        style={{
                            height: "100vh",
                            width: "100%",
                            position: "absolute",
                            zIndex: -1,
                        }}
                    >
                        <MapComponent location={locationData}/>
                    </div>
                </div>
            )}
        </>
    );
};

export default Location;
