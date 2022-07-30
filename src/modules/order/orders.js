import { useState, useEffect } from "react";
import axios from "axios";
import { BackIconVariant } from '../../assets/icons';
import { baseUrl } from "../../config/api-config";
import moment from 'moment'
import Loader from '../../components/loader/Loader';
import OrderStatus from './orderStatus';
import { useHistory } from 'react-router-dom'
import './style/orders.scss';

const Orders = () => {
	const [loader, setLoader] = useState(true);
	const [orders, setOrders] = useState([]);

	const history = useHistory();

	async function fetchOrders() {
		const res = await axios.get(`${baseUrl}/user/orders`);
		console.log(res.data.data);
		setOrders(res.data.data);
		setLoader(false);
	}

	useEffect(() => {
		fetchOrders();
	}, []);

	return (
		<>
			{!loader ?
				<>
					<div className='ordersHeader'>
						<BackIconVariant className='backIcon' onClick={() => { history.goBack() }} />
						<p className='ordersHeading '>Past Orders</p>
					</div>
					<div className='orderList'>
						{
							orders.map((order, index) => (
								<div key={index}>
									<div className='orderCard' onClick={() => history.push({ pathname: `/order-details/${order?.orderDetail.id}`, state: { order: order }})}>
										<div className='d-flex justify-content-between align-items-center w-100'>
											<p className='restaurantName'>{order.restaurant.restaurantName}</p>
											<OrderStatus orderStatus={order?.status} />
										</div>
										<p className='restaurantLocation'>{`${order?.restaurant.contact_details[0].addressLine1} ${order.restaurant.contact_details[0].addressLine2}`}</p>
										<div className="d-flex flex-wrap align-items-baseline w-100">
											{
												order?.itemDetail?.elements.length && order?.itemDetail.elements.map((item, index) =>
													<>
														<p className='orderDescription'>{item.name} x {item.unitQty / 1000}</p>
														{
															(order?.itemDetail?.elements.length - 1) !== index && <p>,&nbsp;</p>
														}
													</>
												)
											}
										</div>
										<div className='d-flex justify-content-between w-100'>
											<p className='orderPrice'>${order.total / 100}</p>
											<p className='orderDate'>{moment(order.date).format('MMMM D, h:mm A')}</p>
										</div>
										{ !order?.review &&
											<button className='rateOrderButton' onClick={(e) => {e.stopPropagation(); history.push(`/feedback/ambience/${order?._id}`)}}><p>Rate Your Order</p></button>
										}
										{/* 
									The above 'rate your order' button is only supposed to show up, 
									if an order has a status of 'delivered.' Currently it is 
									shown for all orders, for the purpose of testing. 
										*/}
									</div>
								</div>
							))
						}
					</div>
				</>
				:  <Loader loading={loader} isComponent/>
			}
		</>
	)
}

export default Orders;