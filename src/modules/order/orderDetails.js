import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './style/orderDetails.scss';
import axios from "axios";
import { baseUrl } from "../../config/api-config";
import { BackIconVariant } from '../../assets/icons';
import Button from "../../components/buttons";
import RestaurantIcon from '../../assets/icons/restaurantIcon.svg';
import HomeIcon from '../../assets/icons/homeIcon.svg';
import DashedLine from '../../assets/icons/dashedLine.svg';
import DishIcon from '../../assets/icons/dishIcon.svg';
import Loader from '../../components/loader/Loader';
import OrderStatus from './orderStatus';

const OrderDetails = () => {
	const [loader, setLoader] = useState(true);
	const [order, setOrder] = useState('');
	const [userLocation, setUserLocation] = useState('');
	const [orderDataFetched, setOrderDataFetched] = useState(false);

	const [itemTotal, setItemTotal] = useState(0);
	// Ideally the item total calculation should be coming from the backend, this is just a temporary solution.^

	const history = useHistory();
	const location = useLocation();

	useEffect(() => {
		if (location?.state?.order && !orderDataFetched) {
			setOrder(location.state.order);
			fetchUserLocation();
			setOrderDataFetched(true);
		}
		else {
			tabulateItemTotal();
			setLoader(false);
		}
		console.log(location?.state.order);
	}, [orderDataFetched])

	async function fetchUserLocation() {
		const res = await axios.get(`${baseUrl}/user/get/one`);
		setUserLocation((_.find(res.data.data.locations, ['_id', res.data.data.primaryLocation])).displayAddress);
	}

	function tabulateItemTotal() {
		const total = order?.itemDetail?.elements.reduce((partialTotal, item) => partialTotal + (item.price / 100 * item.unitQty / 1000), 0);
		setItemTotal(total);
	}

	return (
		<>
			{
				!loader ?
					<>
						<div className='ordersHeader'>
							<BackIconVariant className='backIcon' onClick={() => { history.push('/orders') }} />
							<p className='ordersHeading'>Order #{order?.orderDetail?.id}</p>
						</div>
						<div className='orderBody'>
							<div className='d-flex flex-row restaurantDetailsContainer mt-2 mb-4'>
								<img className='icon' src={RestaurantIcon}></img>
								<div className='restaurantDetails'>
									<p className='locationName'>{order?.restaurant?.restaurantName}</p>
									<p className='address'>`${order?.restaurant?.contact_details[0].addressLine1} ${order?.restaurant_detail?.contact_details[0].addressLine2}`</p>
								</div>
							</div>
							<div className='d-flex flex-row homeDetailsContainer'>
								<img className='icon' src={HomeIcon}></img>
								<div className='homeDetails'>
									<p className='locationName'>Home</p>
									<p className="address">{userLocation}</p>
								</div>
							</div>
							{
								order?.status &&
								<div className='deliveryDetails my-3'>
									<p>Order deliverd on -</p>
									<OrderStatus orderStatus={order?.status} />
								</div>
							}
							<p className='billHeading mb-3'>Bill details</p>
							{
								order?.itemDetail?.elements.map((item, index) =>
									<div className='orderItem mb-3' key={index}>
										<div className='d-flex flex-row justify-content-between w-100'>
											<p>{item.name} x {item.unitQty / 1000}</p>
											<p>${item.price / 100 * (item.unitQty / 1000)}</p>
										</div>
										{
											/*
												<p className='orderAddition'>Addition #1</p>
												<p className='orderAddition'>Addition #2</p>
											*/
											// The above commented out code is to be used for any order additions, such as extra cheese, extra mayo, etc.
											// At present (23 June, 2022) the end point does not return any order addition details. 
											// But when it does, all the styling work has been done to support it.
										}
									</div>
								)
							}
							<img className="w-100 mb-3" src={DashedLine} />
							<div className='d-flex flex-row justify-content-between w-100 mb-1 billDetail'>
								<p>Item Total</p>
								<p>${itemTotal}</p>
							</div>
							<div className='d-flex flex-row justify-content-between w-100 mb-1 billDetail'>
								<p>Delivery partner fee</p>
								<p>-</p>
							</div>
							<div className='d-flex flex-row justify-content-between w-100 mb-1 billDetail'>
								<p>Discount applied (MAPS65MS)</p>
								<p>-</p>
							</div>
							<div className='d-flex flex-row justify-content-between w-100 mb-1 billDetail'>
								<p>Taxes</p>
								<p>${order.total / 100 - itemTotal}</p>
							</div>
							<img className="w-100 mt-2 mb-3" src={DashedLine} />
							<div className='d-flex flex-row justify-content-between w-100 billTotal'>
								<p>Bill Total</p>
								<p>${order.total / 100}</p>
							</div>
							{ !order?.review &&
								<div className='reviewFoodContainer my-3' onClick={() => history.push(`/feedback/ambience/${order._id}`)}>
									<div className='d-flex flex-row w-100'>
										<img src={DishIcon} className="mb-auto" />
										<div className='d-flex flex-column ml-1'>
											{
												order?.restaurant_detail && <p>Review food from {(order?.restaurant_detail?.name).split(/\s+/)[0]}’s</p>
											}
											<p>Give feedback for better recommendations</p>
										</div>
									</div>
								</div>
							}
							<Button variant="primary" caption="Reorder" onClick={() => { console.log("Reordered!") }} />
						</div>
					</> : <Loader loading={loader} isComponent />
			}
		</>
	)
}

export default OrderDetails;