import React, { useEffect } from 'react';
import '../styles/feedbackDone.scss';
import dude from '../animoji/4_dude.json'
import Lottie from 'lottie-react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { baseUrl } from '../../../config/api-config';
import { Title, Text } from '../../../components/Fonts';

const FeedbackDone = () => {
    const params = useParams();
    const feedback = useSelector(state => state.feedback)
    console.log(feedback.order_id, 'order')
    const history = useHistory()
    const submit = async () => {
        await axios.put(`${baseUrl}/user/orderChange/${feedback.order_id}`, {review: true})
        .then((res) => {
            console.log(res, 'res')
        }).catch((err) => {
            console.log(err, 'err')
        })
        await axios.post(`${baseUrl}/restaurant/review`, {restaurantId: feedback.restaurant_id, orderId: params.id, reviews: feedback.review}).then((res) => {
            console.log(res, 'res')
        }).catch((err) => {
            console.log(err, 'err')
        })
    }
    useEffect(() => {
        submit();
    }, [])
    return(
        <>
            <div className='feedback-done'>
                <Lottie
                    className='dude-lottie'
                    animationData={dude}
                    loop={true}
                    autoPlay={true}
                />
                <div className='feedback-thanks'>
                    <div className='thanks-head'>
                        <Title level={'largTile'}>Thanks For Your Feedback</Title>
                    </div>
                    <div className='thanks-body'>
                        <Text>Thank you for sharing your feedbacks. We appreciate your feedback. </Text>
                    </div>
                </div>
            </div>  
            <div class="end-banner">
                <div className='done-button'>
                    <button className='done' onClick={() => history.push('/home')}>
                        <span> <Title level={'headLine'}>Done</Title> </span>
                    </button>
                </div>
            </div>  
        </>
    );
}

export default FeedbackDone;