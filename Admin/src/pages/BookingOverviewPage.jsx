import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import SimpleStatNumber from "../components/booking/SimpleStatNumber";
import {
    bookingState,
    fetchBookings,
    fetchBookingsCount,
    fetchBookingsCountByMonthAndYear,
    getBookingsRevenueByYear,
} from "../features/booking/bookingSlice";
import StackedBarChart from "../partials/dashboard/DashboardCard09";
import LineChart from "../partials/dashboard/LineChart";

function BookingOverviewPage() {
    const dispatch = useDispatch();

    const {
        countBookingAction: {
            numberOfApproved,
            numberOfPending,
            numberOfCancelled,
            numberOfAllBookings,
        },
        fetchBookingsCountByMonthAndYearAction: {
            loading,
            numberOfApproved: numberOfApprovedArr,
            numberOfPending: numberOfPendingArr,
            numberOfCancelled: numberOfCancelledArr,
        },
        getBookingsRevenueByYearAction: { loading: gbrLoading, revenue, refund },
    } = useSelector(bookingState);

    useEffect(() => {
        dispatch(fetchBookingsCount());
        dispatch(fetchBookingsCountByMonthAndYear(new Date().getFullYear()));
        dispatch(getBookingsRevenueByYear(new Date().getFullYear()));
    }, []);

    const dataSet1 = Array.from({ length: 12 }).fill(0);
    const dataSet2 = Array.from({ length: 12 }).fill(0);
    const dataSet3 = Array.from({ length: 12 }).fill(0);
    numberOfApprovedArr.forEach(({ number, month }) => {
        dataSet1[month] = number;
    });
    numberOfPendingArr.forEach(({ number, month }) => {
        dataSet2[month] = number;
    });
    numberOfCancelledArr.forEach(({ number, month }) => {
        dataSet3[month] = number;
    });

    const lcdataSet1 = Array.from({ length: 12 }).fill(0);
    const lcdataSet2 = Array.from({ length: 12 }).fill(0);

    revenue.forEach(({ number, month }) => {
        lcdataSet1[month] = number;
    });
    refund.forEach(({ number, month }) => {
        lcdataSet2[month] = number;
    });

    return (
        <div>
            <div className='flex items-center justify-evenly'>
                <SimpleStatNumber
                    label='All Booking Order'
                    type='All'
                    backgroundColor={`bg-violet-500`}
                    number={numberOfAllBookings}
                />
                <SimpleStatNumber
                    label='Approved Booking Order'
                    type='Approved'
                    backgroundColor={`bg-green-500`}
                    number={numberOfApproved}
                />
                <SimpleStatNumber
                    label='Pending Booking Order'
                    type='Pending'
                    backgroundColor={`bg-blue-500`}
                    number={numberOfPending}
                />
                <SimpleStatNumber
                    label='Cancelled Booking Order'
                    type='Cancelled'
                    backgroundColor={`bg-rose-500`}
                    number={numberOfCancelled}
                />
            </div>
            <div className='my-10'>
                {!loading && <StackedBarChart data={[dataSet1, dataSet2, dataSet3]} />}
            </div>
            <div className='my-10'>
                {!gbrLoading && <LineChart data={[lcdataSet1, lcdataSet2]} />}
            </div>
        </div>
    );
}

export default BookingOverviewPage;
