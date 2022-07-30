import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {NavLink, Redirect, Route, Switch, useHistory, useParams, useRouteMatch} from "react-router-dom";
import { getSelectedText } from '../../onboarding/components/UserFoodAllergic';
import '../styles/ambience.scss'
import '../styles/feedback.scss'
import { set_review } from '../redux/actions';
import { Title, Text } from '../../../components/Fonts';
import { getSingleData, navbar } from './template';
import { FeedbackNav } from './feedbackNav';

const Pricing = (props) => {
    const dispatch = useDispatch();
    const params = useParams()
    const type = props.match.url.split('/')[2]
    const [tags, setTags] = useState([])
    const [selectedPrice, setSelectedPrice] = useState('')
    const [checked, setChecked] = useState(false)
    const history = useHistory()
    const submit = () => {
        var obj = {
            type: type,
            tags: [selectedPrice]
        }
        dispatch(set_review(obj))
        skipped();
    }
    const skipped = () => {
        if(type === 'pricing')
            history.push(`/feedback/done/${params.id}`)
        else{
            history.push(`/feedback/${navbar[navbar.indexOf(type.charAt(0).toUpperCase() + type.slice(1)) + 1].toLowerCase()}/${params.id}`)
        }
    }
    
    const goBack = () => {
        history.push('/home')
    }
    function updateSelected(value){
        if(selectedPrice === value){
            setSelectedPrice('')
            setChecked(false)
        }
        else{
            setSelectedPrice(value)
            setChecked(true)
        }
    }
    useEffect(() => {
        getSingleData(type, setTags)
        setChecked(false)
    }, [type])
    return(
        <div className='feedback'>
            <div className='top-bar'>
                <button className='button' onClick={() => goBack()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div className='experience'>
                    Rate Your Experience
                </div>
            </div>
            <div className="feedback__main">
                <FeedbackNav type={type}  />
                <div className="feedback-ambience-active">
                    <div className="text-frame-active mt-56px">
                        <div className='pricing-heading-text'>
                            <Title level={3}>How was the {type.charAt(0).toUpperCase() + type.slice(1)}?</Title>
                        </div>
                        
                        <div className='feeling-tabs'>
                        {tags.map((price, index) => (

                            <button className='feel-button' onClick={() => updateSelected(price)}>
                                <div className={selectedPrice != price ? 'feeling-tab-text': 'feeling-tab-text-active'}>
                                    <Text>{price}</Text>
                                </div>
                            </button>
                            ))
                            }          
                        </div>    
                    </div>
                </div>
                <div class="end-banner">
                    <div className='button-banner'>
                        <button className='skip-next skip-button' onClick={() => skipped()}>
                            <span className='skip-text'><Title level={'headLine'}>Skip</Title></span>
                        </button>
                        {!checked ? <button className='skip-next next-nocolor' onClick={() => console.log('next Clicked')}>
                            <span className='skip-text'><Title level={'headLine'}>Next</Title></span>
                        </button> : 
                        <button className='skip-next next-color' onClick={() => submit()}>
                            <span className='skip-text'><Title level={'headLine'}>{type === 'pricing' ? 'Finish' : 'Next'}</Title></span>
                        </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pricing;