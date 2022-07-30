import React, {useEffect} from "react";
import {useHistory} from "react-router-dom";

export const PaymentStatus = (props) => {
    const history = useHistory();

    useEffect(() => {
        setTimeout(() => {
            history.push(`/restaurant-view/${props.match.params.id}/popular`)
        }, 10000)
    }, []);

    const {id, order_id, ref_number, status} = props.match.params;
    return (
        <div className="p-1">
            <b>Payment Status</b>
            <br/>
            <br/>
            <br/>
            <div className="d-flex flex-column">
                <div className="d-flex justify-content-between">
                    <b>Order ID:</b>
                    <span>{order_id}</span>
                </div>
                <div className="d-flex justify-content-between">
                    <b>Reference Number:</b>
                    <span>{ref_number}</span>
                </div>
                <div className="d-flex justify-content-between">
                    <b>Status</b>
                    <span>{status}</span>
                </div>
            </div>
        </div>
    )
}