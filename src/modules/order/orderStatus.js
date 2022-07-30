import './style/orderStatus.scss';

const OrderStatus = (props) => {
    // According to spec order status needs to be: Ongoing, Picked, Cancelled
    // According to spec order text needs to be: "Ongoing pickup", "Picked-Up", "Cancelled" respectively

	const orderStatusEnum = {
		'on going': { orderStatus: 'Ongoing', orderText: 'Ongoing pickup' },
		'picked': { orderStatus: 'Picked', orderText: 'Picked-up' },
		'cancelled': { orderStatus: 'Cancelled', orderText: 'Cancelled' }
	};

	return (
		<div className={`orderStatus${orderStatusEnum[props.orderStatus].orderStatus}`}>
			<p>{orderStatusEnum[props.orderStatus].orderText}</p>
		</div>
	)
}

export default OrderStatus;