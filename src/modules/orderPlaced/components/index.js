import React from "react";
import { useHistory } from "react-router-dom";
import '../styles/orderPlaced.scss'

const OrderPlaced = (props) => {
    const history = useHistory()
    const restaurant = props.history.location.state.restaurant
    const navigate = () => {
        history.push('/home', {order: true})
    }
    return(
        <div className="main">
            <div className="top-bar">
                    <button className="back-button" onClick={() => navigate()}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 10.9998H7.14L10.77 6.63979C10.9397 6.43557 11.0214 6.17229 10.997 5.90786C10.9726 5.64344 10.8442 5.39953 10.64 5.22979C10.4358 5.06005 10.1725 4.97839 9.90808 5.00277C9.64365 5.02715 9.39974 5.15557 9.23 5.35979L4.23 11.3598C4.19636 11.4075 4.16628 11.4576 4.14 11.5098C4.14 11.5598 4.14 11.5898 4.07 11.6398C4.02467 11.7544 4.00094 11.8765 4 11.9998C4.00094 12.1231 4.02467 12.2451 4.07 12.3598C4.07 12.4098 4.07 12.4398 4.14 12.4898C4.16628 12.5419 4.19636 12.5921 4.23 12.6398L9.23 18.6398C9.32402 18.7527 9.44176 18.8434 9.57485 18.9057C9.70793 18.9679 9.85309 19 10 18.9998C10.2337 19.0002 10.4601 18.9189 10.64 18.7698C10.7413 18.6858 10.825 18.5827 10.8863 18.4664C10.9477 18.35 10.9855 18.2227 10.9975 18.0918C11.0096 17.9608 10.9957 17.8287 10.9567 17.7031C10.9176 17.5775 10.8542 17.4608 10.77 17.3598L7.14 12.9998H19C19.2652 12.9998 19.5196 12.8944 19.7071 12.7069C19.8946 12.5194 20 12.265 20 11.9998C20 11.7346 19.8946 11.4802 19.7071 11.2927C19.5196 11.1051 19.2652 10.9998 19 10.9998Z" fill="#292929"/>
                        </svg>
                    </button>
                <div className="top-help">
                    <div className="detail">
                        <div className="experience">
                            Ready for pick up
                        </div>
                        <div className="placement">
                            Your Order is Ready
                        </div>
                    </div>
                    <div className="button-help">
                        <button className="help">
                            <span className="button-span">Help</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="circles">
                <div className="circle-detail">
                    <div className="small-circle">
                        <div className="circle-item">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="7" cy="23" r="3" fill="#292929"/>
                                <circle cx="23.0264" cy="23" r="3" fill="#292929"/>
                                <circle cx="39.0508" cy="23" r="3" fill="#292929"/>
                            </svg>
                        </div>
                    </div>
                    <div className="second-circle">
                        <div className="circle-item">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.5793 22.1739C15.5793 24.4791 13.6941 26.3478 11.3687 26.3478C9.04332 26.3478 7.1582 24.4791 7.1582 22.1739C7.1582 19.8687 9.04332 18 11.3687 18C13.6941 18 15.5793 19.8687 15.5793 22.1739Z" fill="#292929"/>
                                <path d="M21.8939 23.2173C21.8939 24.9462 20.4801 26.3478 18.736 26.3478C16.992 26.3478 15.5781 24.9462 15.5781 23.2173C15.5781 21.4885 16.992 20.0869 18.736 20.0869C20.4801 20.0869 21.8939 21.4885 21.8939 23.2173Z" fill="#292929"/>
                                <path d="M2 22H34V24C34 27.3137 31.3137 30 28 30H8C4.68629 30 2 27.3137 2 24V22Z" fill="#DBEF06"/>
                                <path d="M34 22H46C46 23.1046 45.1046 24 44 24H34V22Z" fill="#292929"/>
                            </svg>
                        </div>
                    </div>
                    <div className="third-circle">
                        <div className="circle-item">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.75258 9.51339C9.87602 8.51091 10.7275 7.75781 11.7376 7.75781H36.1999C37.21 7.75781 38.0615 8.51093 38.1849 9.51341L39.9688 24.0016V41.7578C39.9688 42.8624 39.0733 43.7578 37.9688 43.7578H9.96875C8.86418 43.7578 7.96875 42.8624 7.96875 41.7578V24L9.75258 9.51339Z" fill="#DBEF06"/>
                                <path d="M8 5C8 4.44772 8.44772 4 9 4H39C39.5523 4 40 4.44772 40 5V11C40 11.5523 39.5523 12 39 12H9C8.44772 12 8 11.5523 8 11V5Z" fill="#DBEF06"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M8 10V11C8 11.5523 8.44772 12 9 12H39C39.5523 12 40 11.5523 40 11V10H8Z" fill="#DBEF06"/>
                                <path d="M30 30C30 28.4087 29.3679 26.8826 28.2426 25.7574C27.1174 24.6321 25.5913 24 24 24C22.4087 24 20.8826 24.6321 19.7574 25.7574C18.6321 26.8826 18 28.4087 18 30L24 30H30Z" fill="#292929"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M9.20007 14L9.44635 12H38.491L38.7373 14H9.20007Z" fill="#292929"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer">
                <div className="drawer">
                    <button className="bottom-button">
                        <svg width="38" height="3" viewBox="0 0 38 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="38" height="3" rx="1.5" fill="#C4C4C4"/>
                        </svg>
                    </button>
                </div>
                <div className="bottom-bottom">
                    <div className="order-det">
                        <div className="order-number">
                            Order #177777
                        </div>
                        <div className="order-msg">
                            Order is prepared
                        </div>
                    </div>
                    <div className="order-contact">
                        <div className="buttons">
                            <button className="call-button" onClick={() => navigate()}>
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="20" cy="20" r="19.5" stroke="#292929"/>
                                    <path d="M24 22L29 17L24 12" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M13 28V21C13 19.9391 13.4214 18.9217 14.1716 18.1716C14.9217 17.4214 15.9391 17 17 17H29" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                        <a href={"tel:" + '+1-' + restaurant?.contact_details?.[0].areaCode + '-' + restaurant?.contact_details?.[0].contactNo}>
                            <button className="call-button">        
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="20" cy="20" r="20" fill="#4ED021"/>
                                    <path d="M27.12 23.0044C26.0267 23.0044 24.9689 22.8267 23.9822 22.5067C23.6711 22.4 23.3244 22.48 23.0844 22.72L21.6889 24.4711C19.1733 23.2711 16.8178 21.0044 15.5644 18.4L17.2978 16.9244C17.5378 16.6756 17.6089 16.3289 17.5111 16.0178C17.1822 15.0311 17.0133 13.9733 17.0133 12.88C17.0133 12.4 16.6133 12 16.1333 12H13.0578C12.5778 12 12 12.2133 12 12.88C12 21.1378 18.8711 28 27.12 28C27.7511 28 28 27.44 28 26.9511V23.8844C28 23.4044 27.6 23.0044 27.12 23.0044Z" fill="white"/>
                                </svg>
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderPlaced;