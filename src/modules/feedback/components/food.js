import React, { useState, Fragment} from 'react';
import {NavLink, Redirect, Route, Switch, useHistory, useParams, useRouteMatch} from "react-router-dom";
// import '../styles/ambience.scss'
import '../styles/feedback.scss'
import '../styles/food.scss'
import Lottie from 'lottie-react'
import meh from '../animoji/1_meh.json';
import smile from '../animoji/2_smile.json';
import love from '../animoji/3_love.json';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { useDispatch, useSelector } from 'react-redux'
import { set_review } from '../redux/actions';
import {getCompressedImgUrl} from "../../../config/utils";
import { Title, Text } from '../../../components/Fonts';
import { navbar } from './template';
import { FeedbackNav } from './feedbackNav'; 

const Food = () => {
    const params = useParams()
    var perpage = 3
    var count = 0
    const dishes = useSelector(state => state.feedback.dishes)
    console.log(dishes, 'dishes')
    if(dishes?.length === 1)
        perpage = 1
    const dispatch = useDispatch();
    const [dish, setDish] = useState(0);
    const [bad, setBad] = useState(false)
    const [good, setGood] = useState(false)
    const [excellent, setExcellent] = useState(false)
    const [feelBad, setFeelBad] = useState(['Undercooked', 'Overcooked', 'Under-seasond', 'Over-seasoned', 'Cross-contaminated', 'Unhygienic', 'Stale', 'Inedible', 'Mediocre', 'Poor'])
    const [feelGood, setFeelGood] = useState(['Decent', 'Fresh', 'Value For Money', 'Thoughtful'])
    const [feelExcellent, setFeelExcellent] = useState(['Perfection', 'Flavourful', 'Nutritious', 'Authentic', 'Unique', 'Artistic', 'Colorful'])
    const [selectedFeeling, setSelectedFeeling] = useState([])
    const history = useHistory();
    const goBack = () => {
        history.push('/home')
    }
    const submit = () => {
        var experience = ""
        if(bad)
            experience = 'bad'
        else if(good)
            experience = 'good'
        else if(excellent)
            experience = 'excellent'
        
        const id = dishes[dish]?.id
        var obj = {
            type: 'food',
            emoji: experience,
            dish_id: id,
            tags: selectedFeeling
        }
        setBad(false)
        setGood(false)
        setExcellent(false)
        setSelectedFeeling([])
        dispatch(set_review(obj))
        count++;
        if(count === dishes?.length){
            history.push(`/feedback/${navbar[navbar.indexOf(type.charAt(0).toUpperCase() + type.slice(1)) + 1].toLowerCase()}/${params.id}`)
        }
    }
    function skipped() {
        history.push(`/feedback/${navbar[navbar.indexOf(type.charAt(0).toUpperCase() + type.slice(1)) + 1].toLowerCase()}/${params.id}`)
    }

    const returnAnimoji = () => {
        if(bad)
            return 'Bad'
        else if(good)
            return 'Good'
        else if(excellent)
            return 'Excellent'
    }

    function updateSelected(value){
        let arr = [...selectedFeeling]
        if(arr.includes(value)){
            const index = arr.indexOf(value)
            arr.splice(index, 1)
        }
        else
            arr.push(value)
        setSelectedFeeling(arr)
    }
    const countTrue = () => {
        if(selectedFeeling.length > 0)
            return true
        else
            return false
    }
    const returnBool = () => {
        if(bad || good || excellent)
            return true
        else
            return false
    }
    const setAutoPlay1 = () => {
        if(bad){
            setBad(false)
        }
        else{
            setBad(true)
            setGood(false)
            setExcellent(false)
        }
        setSelectedFeeling([])
    }
    const setAutoPlay2 = () => {
        if(good){
            setGood(false)
        }
        else{
            setGood(true)
            setBad(false)
            setExcellent(false)
        }
        setSelectedFeeling([])
    }
    const setAutoPlay3 = (val) => {
        if(excellent){
            setExcellent(false)
        }
        else{
            setExcellent(true)
            setGood(false)
            setBad(false) 
        }
        setSelectedFeeling([])
    }
    return(
        <div className='feedback'>
            <div className='top-bar'>
                <button className='button' onClick={() => goBack()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div className='experience'>
                    <Title level={2}>Rate Your Experience</Title>
                </div>
            </div>
            <div className="feedback__main">
                <FeedbackNav type={'food'} />
                <div className='swiper'>
                    <Splide
                        options={{
                            type: 'loop',
                            perPage: perpage,
                            height: "20rem",
                            focus: 'center',
                            gap: '30vw',
                            arrows: false,
                            pagination: false
                        }}
                        onMoved={(ele, newIndex, prevIndex, destIndex) => {
                            setDish(newIndex);
                            console.log(newIndex, 'new');
                        }}
                    >
                        {dishes?.map((d, currentIdx) => {
                            return (
                                <Fragment key={d.id}>
                                    <SplideSlide>
                                        <img className={"slide-img"} src={getCompressedImgUrl(d.imageUrl || getDishImage(currentIdx))} />
                                        <div style={{ fontSize: '15px', width: "102px", display: 'flex', justifyContent: "center", textAlign: 'center' }}>{d.name}</div>
                                    </SplideSlide>
                                </Fragment>
                            )
                        })}
                    </Splide>
                </div>
                <div className={bad || good || excellent ? "feedback-food-active" : "feedback-food"}>
                    <div className={bad || good || excellent ? "food-text-frame-active" : "text-frame"}>
                        { !returnBool() && <div className="food">
                            <Title level={3}>How was the Food?</Title>
                        </div>}
                        <div className="fresh">
                            <div className='animojis' style={{background: bad ? '#dbef06' : '#FAFAF5'}}>
                                <button className='animoji-button' onClick={setAutoPlay1}>
                                    {!bad ? <svg width="48" height="46" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M47.9163 23.2565C47.9163 35.4988 37.992 45.4232 25.7497 45.4232C13.5074 45.4232 3.58301 35.4988 3.58301 23.2565C3.58301 11.0142 13.5074 1.08984 25.7497 1.08984C37.992 1.08984 47.9163 11.0142 47.9163 23.2565Z" fill="#F2F2ED"/>
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M22.2497 43.2537C33.5899 43.2537 42.783 34.0606 42.783 22.7204C42.783 11.3801 33.5899 2.18704 22.2497 2.18704C10.9094 2.18704 1.71634 11.3801 1.71634 22.7204C1.71634 34.0606 10.9094 43.2537 22.2497 43.2537ZM22.2497 44.887C34.492 44.887 44.4163 34.9627 44.4163 22.7204C44.4163 10.4781 34.492 0.553711 22.2497 0.553711C10.0074 0.553711 0.0830078 10.4781 0.0830078 22.7204C0.0830078 34.9627 10.0074 44.887 22.2497 44.887Z" fill="#8A8A87"/>
                                                    <path d="M5.495 18.502C5.28832 18.502 5.10938 18.6542 5.10938 18.8609Lnan nanL5.10938 18.8609C5.10938 20.2487 6.2344 21.3737 7.62218 21.3737C9.00997 21.3737 10.135 20.2487 10.135 18.8609Lnan nanL10.135 18.8609C10.135 18.6542 9.95604 18.502 9.74937 18.502H5.495Z" fill="#8A8A87"/>
                                                    <path d="M16.9813 18.502C16.7747 18.502 16.5957 18.6542 16.5957 18.8609Lnan nanL16.5957 18.8609C16.5957 20.2487 17.7207 21.3737 19.1085 21.3737C20.4963 21.3737 21.6213 20.2487 21.6213 18.8609Lnan nanL21.6213 18.8609C21.6213 18.6542 21.4424 18.502 21.2357 18.502H16.9813Z" fill="#8A8A87"/>
                                                    <path d="M13.7239 30.1716C16.0881 30.1716 17.6575 30.3915 19.5977 30.6921C20.0417 30.7595 20.9033 30.6921 20.9033 29.651C20.9033 27.5695 17.9038 24.9674 13.7239 24.9674C9.5439 24.9674 6.54443 27.5695 6.54443 29.651C6.54443 30.6921 7.40688 30.7601 7.85007 30.6921C9.7902 30.3915 11.3589 30.1716 13.7239 30.1716Z" fill="#8A8A87"/>
                                                </svg>
                                        : <Lottie 
                                        className={(!bad) ? 'lottie-animoji' : 'active-lottie'}
                                        animationData={meh}
                                        loop={bad}
                                        autoPlay={bad}
                                        />
                                    }
                                </button>
                            </div>
                            {/* <div className='animojis-text'>Bad</div> */}
                            <div className='animojis' style={{background: (good) ? '#FAFAF5' : 'rgba(219, 239, 6, 0.2)'}}>
                                <button className='animoji-button' onClick={setAutoPlay2}>
                                    {!good ? <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M50.5433 29.4469C50.5433 41.6893 40.6189 51.6136 28.3766 51.6136C16.1343 51.6136 6.20996 41.6893 6.20996 29.4469C6.20996 17.2046 16.1343 7.28027 28.3766 7.28027C40.6189 7.28027 50.5433 17.2046 50.5433 29.4469Z" fill="#F2F2ED"/>
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M27.6501 47.2091C38.9853 47.2091 48.1834 37.9884 48.1834 26.6029C48.1834 15.2173 38.9853 5.99661 27.6501 5.99661C16.3149 5.99661 7.11673 15.2173 7.11673 26.6029C7.11673 37.9884 16.3149 47.2091 27.6501 47.2091ZM27.6501 48.8425C39.8924 48.8425 49.8167 38.8854 49.8167 26.6029C49.8167 14.3203 39.8924 4.36328 27.6501 4.36328C15.4078 4.36328 5.4834 14.3203 5.4834 26.6029C5.4834 38.8854 15.4078 48.8425 27.6501 48.8425Z" fill="#8A8A87"/>
                                                    <path d="M23.6731 21.1341C23.9549 21.1341 24.2207 20.9737 24.2933 20.7014C24.3495 20.4906 24.3794 20.269 24.3794 20.0404C24.3794 18.6309 23.2406 17.4883 21.8357 17.4883C20.4309 17.4883 19.292 18.6309 19.292 20.0404C19.292 20.269 19.322 20.4906 19.3781 20.7014C19.4507 20.9737 19.7165 21.1341 19.9983 21.1341H23.6731Z" fill="#8A8A87"/>
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M23.6141 20.4049C23.6378 20.2877 23.6503 20.1658 23.6503 20.0404C23.6503 19.0313 22.8356 18.2174 21.8357 18.2174C20.8358 18.2174 20.0212 19.0313 20.0212 20.0404C20.0212 20.1658 20.0337 20.2877 20.0573 20.4049H23.6141ZM24.2933 20.7014C24.2207 20.9737 23.9549 21.1341 23.6731 21.1341H19.9983C19.7165 21.1341 19.4507 20.9737 19.3781 20.7014C19.322 20.4906 19.292 20.269 19.292 20.0404C19.292 18.6309 20.4309 17.4883 21.8357 17.4883C23.2406 17.4883 24.3794 18.6309 24.3794 20.0404C24.3794 20.269 24.3495 20.4906 24.2933 20.7014Z" fill="#8A8A87"/>
                                                    <path d="M34.5755 21.1341C34.8573 21.1341 35.123 20.9737 35.1956 20.7014C35.2518 20.4906 35.2818 20.269 35.2818 20.0404C35.2818 18.6309 34.1429 17.4883 32.7381 17.4883C31.3332 17.4883 30.1943 18.6309 30.1943 20.0404C30.1943 20.269 30.2243 20.4906 30.2805 20.7014C30.3531 20.9737 30.6188 21.1341 30.9006 21.1341H34.5755Z" fill="#8A8A87"/>
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M34.5164 20.4049C34.5401 20.2877 34.5526 20.1658 34.5526 20.0404C34.5526 19.0313 33.7379 18.2174 32.7381 18.2174C31.7382 18.2174 30.9235 19.0313 30.9235 20.0404C30.9235 20.1658 30.936 20.2877 30.9597 20.4049H34.5164ZM35.1956 20.7014C35.123 20.9737 34.8573 21.1341 34.5755 21.1341H30.9006C30.6188 21.1341 30.3531 20.9737 30.2805 20.7014C30.2243 20.4906 30.1943 20.269 30.1943 20.0404C30.1943 18.6309 31.3332 17.4883 32.7381 17.4883C34.1429 17.4883 35.2818 18.6309 35.2818 20.0404C35.2818 20.269 35.2518 20.4906 35.1956 20.7014Z" fill="#8A8A87"/>
                                                    <path d="M27.2863 26.7861C24.893 26.7861 23.3043 26.5627 21.3403 26.2574C20.8908 26.1889 20.0186 26.2574 20.0186 27.3147C20.0186 29.4288 23.0549 32.0716 27.2863 32.0716C31.5177 32.0716 34.5541 29.4288 34.5541 27.3147C34.5541 26.2574 33.681 26.1883 33.2324 26.2574C31.2684 26.5627 29.6804 26.7861 27.2863 26.7861Z" fill="#8A8A87"/>
                                                </svg>
                                    : <Lottie 
                                        className={(!good) ? 'lottie-animoji' : 'active-lottie'}
                                        animationData={smile}
                                        loop={good}
                                        autoPlay={good}
                                        // height={100}
                                    />}
                                </button>
                            </div>
                            <div className='animojis' style={{background: (excellent) ? '#FAFAF5' : 'rgba(219, 239, 6, 0.2)'}}>
                                <button className='animoji-button' onClick={setAutoPlay3}>
                                    {!excellent ? <svg width="73" height="65" viewBox="0 0 73 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="73" height="65" fill="white"/>
                                                    <path d="M57.0462 33.7331C57.0462 45.9754 47.1219 55.8997 34.8796 55.8997C22.6372 55.8997 12.7129 45.9754 12.7129 33.7331C12.7129 21.4908 22.6372 11.5664 34.8796 11.5664C47.1219 11.5664 57.0462 21.4908 57.0462 33.7331Z" fill="#F2F2ED"/>
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M37.1022 52.7869C48.4425 52.7869 57.6355 43.5938 57.6355 32.2536C57.6355 20.9133 48.4425 11.7202 37.1022 11.7202C25.762 11.7202 16.5689 20.9133 16.5689 32.2536C16.5689 43.5938 25.762 52.7869 37.1022 52.7869ZM37.1022 54.4202C49.3445 54.4202 59.2689 44.4959 59.2689 32.2536C59.2689 20.0113 49.3445 10.0869 37.1022 10.0869C24.8599 10.0869 14.9355 20.0113 14.9355 32.2536C14.9355 44.4959 24.8599 54.4202 37.1022 54.4202Z" fill="#8A8A87"/>
                                                    <path d="M33.8862 22.9855C33.5922 23.0592 33.3145 23.1749 33.0525 23.3329L33.0076 23.3619C32.8934 23.4356 32.7847 23.5169 32.6809 23.6076L32.632 23.6392C32.5199 23.7341 32.4164 23.8414 32.3244 23.9585C31.1242 25.4388 31.6481 27.4407 33.041 28.587C33.7783 29.1563 34.6308 29.5541 35.5325 29.7515C36.205 29.8927 37.6508 30.1272 38.8577 30.1285C39.316 30.129 39.7285 29.8655 39.9183 29.4484C40.4206 28.3446 40.7857 26.9408 40.9228 26.2775C41.1178 25.3722 41.1031 24.4276 40.8838 23.524C40.4049 21.7877 38.7961 20.4861 36.9749 20.9685C36.6776 21.0442 36.3972 21.1737 36.1399 21.3399C35.5704 21.7018 35.1413 22.2446 34.9117 22.8834C34.8569 22.8789 34.7959 22.883 34.7396 22.8853C34.6828 22.8867 34.5701 22.8734 34.4879 22.8802L34.2882 22.9109C34.1776 22.9187 34.0713 22.9411 33.9625 22.9704C33.9493 22.9679 33.9316 22.9672 33.9103 22.97L33.8862 22.9855Z" fill="#8A8A87"/>
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M33.8862 22.9855C33.5922 23.0592 33.3145 23.1749 33.0525 23.3329L33.0076 23.3619C32.8934 23.4356 32.7847 23.5169 32.6809 23.6076L32.632 23.6392C32.5199 23.7341 32.4164 23.8414 32.3244 23.9585C31.1242 25.4388 31.6481 27.4407 33.041 28.587C33.7783 29.1563 34.6308 29.5541 35.5325 29.7515C36.205 29.8927 37.6508 30.1272 38.8577 30.1285C39.316 30.129 39.7285 29.8655 39.9183 29.4484C40.4206 28.3446 40.7857 26.9408 40.9228 26.2775C41.1178 25.3722 41.1031 24.4276 40.8838 23.524C40.4049 21.7877 38.7961 20.4861 36.9749 20.9685C36.6776 21.0442 36.3972 21.1737 36.1399 21.3399C35.5704 21.7018 35.1413 22.2446 34.9117 22.8834C34.8658 22.8797 34.8157 22.8819 34.7675 22.8841C34.7581 22.8845 34.7488 22.8849 34.7396 22.8853C34.7176 22.8858 34.6871 22.8842 34.6533 22.8823C34.6 22.8794 34.5382 22.876 34.4879 22.8802L34.2882 22.9109C34.1776 22.9187 34.0713 22.9411 33.9625 22.9704C33.9493 22.9679 33.9316 22.9672 33.9103 22.97L33.8862 22.9855ZM33.9688 23.4655C33.7373 23.527 33.518 23.6198 33.3093 23.745L33.2709 23.7698C33.1755 23.8313 33.0856 23.8986 33.0003 23.9732L32.9738 23.9963L32.9233 24.0289C32.8448 24.0978 32.7718 24.1748 32.7063 24.2582L32.7039 24.2612L32.7015 24.2642C31.7172 25.4782 32.0994 27.1792 33.3437 28.2074C34.0225 28.7301 34.8063 29.0953 35.6343 29.2768C36.2917 29.4147 37.6994 29.6418 38.8582 29.6431C39.1273 29.6434 39.366 29.49 39.4765 29.2473C39.9579 28.1894 40.3141 26.8245 40.4473 26.1793L40.4482 26.1753C40.627 25.3449 40.6145 24.4772 40.4139 23.6459C39.981 22.0889 38.5864 21.0439 37.0991 21.4378L37.0947 21.4389C36.855 21.5 36.6225 21.6061 36.4032 21.7477L36.4003 21.7496C35.9237 22.0525 35.5625 22.5079 35.3686 23.0476L35.2429 23.3972L34.8725 23.3672C34.8592 23.3661 34.8447 23.3668 34.8006 23.3686C34.789 23.3691 34.7754 23.3697 34.7591 23.3703L34.7556 23.3705L34.752 23.3706C34.7188 23.3714 34.686 23.37 34.6648 23.369C34.6543 23.3685 34.6367 23.3676 34.6217 23.3668C34.6122 23.3663 34.6037 23.3658 34.5987 23.3655C34.5783 23.3645 34.562 23.3639 34.5483 23.3637C34.544 23.3637 34.5405 23.3637 34.5377 23.3637L34.3422 23.3938L34.3223 23.3952C34.2548 23.3999 34.1817 23.4141 34.0884 23.4392L33.9814 23.4679L33.9688 23.4655Z" fill="#8A8A87"/>
                                                    <path d="M47.3174 16.1194C46.9647 15.9468 46.5929 15.8295 46.2014 15.7672L46.1327 15.7584C45.958 15.7361 45.7824 15.7257 45.6038 15.7289L45.529 15.7193C45.3387 15.7197 45.1465 15.7395 44.9576 15.7787C42.5323 16.2426 41.3791 18.6632 41.8014 20.9621C42.0563 22.1418 42.5685 23.248 43.2968 24.1967C43.845 24.8982 45.0813 26.3381 46.2757 27.3476C46.7293 27.7309 47.3579 27.8144 47.8944 27.5597C49.3139 26.8859 50.8482 25.8003 51.5379 25.2578C52.4873 24.5238 53.2617 23.576 53.7993 22.4976C54.7751 20.3777 54.2687 17.7447 52.0617 16.7012C51.704 16.528 51.3181 16.4221 50.9244 16.3717C50.0579 16.2546 49.1795 16.4338 48.4186 16.8748C48.3679 16.8246 48.3042 16.7777 48.2465 16.7329C48.189 16.6869 48.0886 16.5796 48.0014 16.5177L47.7779 16.3813C47.6619 16.2967 47.5378 16.2301 47.4056 16.1681C47.3947 16.1547 47.3776 16.1392 47.3542 16.1241L47.3174 16.1194Z" fill="#8A8A87"/>
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M47.3174 16.1194C46.9647 15.9468 46.5929 15.8295 46.2014 15.7672L46.1327 15.7584C45.958 15.7361 45.7824 15.7257 45.6038 15.7289L45.529 15.7193C45.3387 15.7197 45.1465 15.7395 44.9576 15.7787C42.5323 16.2426 41.3791 18.6632 41.8014 20.9621C42.0563 22.1418 42.5685 23.248 43.2968 24.1967C43.845 24.8982 45.0813 26.3381 46.2757 27.3476C46.7293 27.7309 47.3579 27.8144 47.8944 27.5597C49.3139 26.8859 50.8482 25.8003 51.5379 25.2578C52.4873 24.5238 53.2617 23.576 53.7993 22.4976C54.7751 20.3777 54.2687 17.7447 52.0617 16.7012C51.704 16.528 51.3181 16.4221 50.9244 16.3717C50.0579 16.2546 49.1795 16.4338 48.4186 16.8748C48.3762 16.8328 48.3246 16.7931 48.2751 16.755C48.2655 16.7476 48.2559 16.7402 48.2465 16.7329C48.2242 16.7151 48.1954 16.688 48.1635 16.6579C48.1131 16.6105 48.0547 16.5556 48.0014 16.5177L47.7779 16.3813C47.6619 16.2967 47.5378 16.2301 47.4056 16.1681C47.3947 16.1547 47.3776 16.1392 47.3542 16.1241L47.3174 16.1194ZM46.9982 16.6639C46.7176 16.5314 46.4229 16.4402 46.1116 16.3898L46.0529 16.3823C45.9069 16.3636 45.7617 16.3552 45.6149 16.3578L45.5693 16.3586L45.4921 16.3487C45.3568 16.3513 45.2201 16.3666 45.0855 16.3946L45.0807 16.3956L45.0758 16.3965C43.0867 16.7769 42.0446 18.781 42.4184 20.8389C42.6542 21.9237 43.1256 22.9401 43.7941 23.8115C44.3301 24.4972 45.5349 25.8979 46.6817 26.8671C46.948 27.0922 47.3126 27.1397 47.6247 26.9915C48.9852 26.3457 50.4781 25.2911 51.149 24.7634L51.1532 24.7601C52.024 24.0869 52.7363 23.2169 53.2319 22.2259C54.1036 20.322 53.595 18.1219 51.7928 17.2699L51.7875 17.2674C51.4989 17.1276 51.18 17.0385 50.8445 16.9956L50.8401 16.995C50.1151 16.897 49.3769 17.0464 48.734 17.419L48.3174 17.6604L47.9756 17.3214C47.9632 17.3091 47.9484 17.2976 47.9032 17.2627C47.8913 17.2535 47.8773 17.2426 47.8607 17.2297L47.857 17.2269L47.8534 17.224C47.8198 17.1971 47.7885 17.1684 47.7683 17.1497C47.7583 17.1403 47.7417 17.1247 47.7275 17.1114C47.7185 17.1029 47.7105 17.0954 47.7058 17.091C47.6864 17.0729 47.6708 17.0587 47.6574 17.0471C47.6532 17.0435 47.6497 17.0405 47.6468 17.0382L47.4281 16.9047L47.4072 16.8895C47.3364 16.8378 47.2521 16.7908 47.1388 16.7377L47.0087 16.6768L46.9982 16.6639Z" fill="#8A8A87"/>
                                                    <path d="M46.8862 30.7813L42.8333 32.4577C42.3777 32.6462 42.2308 33.2178 42.5567 33.5878C43.8893 35.1007 46.0077 37.1043 47.1989 36.8103C48.4194 36.5092 48.2195 33.4209 47.874 31.3171C47.7988 30.8594 47.3148 30.604 46.8862 30.7813Z" fill="#8A8A87"/>
                                                </svg>
                                    : <Lottie 
                                        className={(!excellent) ? 'lottie-animoji' : 'active-lottie'}
                                        animationData={love}
                                        loop={excellent}
                                        autoPlay={excellent}
                                    />}
                                </button>
                            </div>
                        </div>
                        {!bad && !good && !excellent && <div className="fresh mt-8px">
                            <div className='animojis-text bad'>
                                <Text>Bad</Text>
                            </div>
                            {/* <div className='animojis-text'>Bad</div> */}
                            <div className='animojis-text good'>
                                <Text>Good</Text>
                            </div>
                            <div className='animojis-text excellent'>
                                <Text>Excellent</Text>
                            </div>
                        </div>}
                        {returnBool() && <div className="fresh-heading">
                            <div className='animojis-heading'>
                                {returnAnimoji()}
                            </div>
                        </div>}
                        {returnBool() && <div className='animojis-heading-text'>
                            Select What You Feel!
                        </div>}
                            {bad && <div className='feeling-tabs-food'>
                                {feelBad.map((feel, index) => (

                                        <button className='feel-button' onClick={() => updateSelected(feel)}>
                                            <div className={!selectedFeeling.includes(feel) ? 'feeling-tab-text': 'feeling-tab-text-active'}>
                                                {feel}
                                            </div>
                                        </button>
                                ))
                                }
                                </div>
                            }
                            {good && <div className='feeling-tabs-food'>
                                {feelGood.map((feel, index) => (

                                        <button className='feel-button' onClick={() => updateSelected(feel)}>
                                            <div className={!selectedFeeling.includes(feel) ? 'feeling-tab-text': 'feeling-tab-text-active'}>
                                                {feel}
                                            </div>
                                        </button>
                                ))
                                }
                                </div>
                            }
                            {excellent && <div className='feeling-tabs-food'>
                                {feelExcellent.map((feel, index) => (

                                        <button className='feel-button' onClick={() => updateSelected(feel)}>
                                            <div className={!selectedFeeling.includes(feel) ? 'feeling-tab-text': 'feeling-tab-text-active'}>
                                                {feel}
                                            </div>
                                        </button>
                                ))
                                }
                                </div>
                            }
                    </div>
                </div>
            </div>
                    <div class="end-banner-food">
                        <div className='button-banner'>
                            <button className='skip-next skip-button' onClick={() => skipped()}>
                                <span className='skip-text'>Skip</span>
                            </button>
                            {!countTrue() ? <button className='skip-next next-nocolor' onClick={() => console.log('next Clicked')}>
                                <span className='skip-text'>Next</span>
                            </button> : 
                            <button className='skip-next next-color' onClick={() => submit()}>
                                <span className='skip-text'>Next</span>
                            </button>
                            }
                        </div>
                    </div>
        </div>
    );
}

const getDishImage = (index = 0) => {
    const images = [
        "https://pikky.s3.amazonaws.com/patterns/dish1.svg",
        "https://pikky.s3.amazonaws.com/patterns/dish2.svg",
        "https://pikky.s3.amazonaws.com/patterns/dish3.svg",
        "https://pikky.s3.amazonaws.com/patterns/dish4.svg",
        "https://pikky.s3.amazonaws.com/patterns/dish5.svg",
    ];
    return images[index % images.length]
};

export default Food;