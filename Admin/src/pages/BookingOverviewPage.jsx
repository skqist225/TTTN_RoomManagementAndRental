import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import SimpleStatNumber from "../components/booking/SimpleStatNumber";
import { fetchBookings, fetchBookingsCount } from "../features/booking/bookingSlice";

function BookingOverviewPage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            fetchBookings({
                page: 1,
                type: "ALL",
            })
        );
        dispatch(fetchBookingsCount());
    }, []);

    return (
        <div className='flex items-center justify-evenly'>
            <SimpleStatNumber label='All Booking Order' type='All' />
            <SimpleStatNumber label='Approved Booking Order' type='Approved' />
            <SimpleStatNumber label='Pending Booking Order' type='Pending' />
            <SimpleStatNumber label='Cancelled Booking Order' type='Cancelled' />
        </div>
    );
}

export default BookingOverviewPage;
