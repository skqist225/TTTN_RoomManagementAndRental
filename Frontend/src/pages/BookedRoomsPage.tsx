import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import BookedRoom from "../components/booked_rooms/BookedRooms";
import Header from "../components/Header";
import {
    fetchBookedRooms,
    fetchWishlistsIDsOfCurrentUser,
    userState,
} from "../features/user/userSlice";
import { Image } from "../globalStyle";
import { callToast, getImage } from "../helpers";
import $ from "jquery";

import "./css/booked_rooms.css";
import {
    bookingState,
    cancelUserBooking,
    clearCreateReviewSuccessState,
    fetchUserBookedOrders,
} from "../features/booking/bookingSlice";
import Toast from "../components/notify/Toast";
import { MyNumberForMat } from "../components/utils";
import { PreviewBookingInfo, RoomAndPricePreview } from "../components/progress_booking";
import { getFormattedCheckinAndCheckoutDate } from "./script/progress_booking";
import ReviewRoom from "../components/booked_rooms/ReviewRoom";

interface IBookedRoomsPageProps {}

const BookedRoomsPage: FC<IBookedRoomsPageProps> = () => {
    const dispatch = useDispatch();
    const { search } = useLocation();
    const { bookedRooms } = useSelector(userState);
    const {
        createReviewSuccess,
        cancelledBookingId,
        userCancelBookingAction: { successMessage, errorMessage },
    } = useSelector(bookingState);

    const {
        fetchUserBookedOrdersAction: { loading, bookings },
    } = useSelector(bookingState);

    useEffect(() => {
        let query = "";
        if (search!.includes("?")) {
            query = search!.split("=").pop()!;
        }

        dispatch(fetchBookedRooms({ query }));
        dispatch(fetchWishlistsIDsOfCurrentUser());
    }, []);

    function handleResetQuery() {
        $("#user-bookings__search-input").val("");
        dispatch(fetchBookedRooms({ query: "" }));
        dispatch(fetchWishlistsIDsOfCurrentUser());
    }

    function filterBookings() {
        const searchValue = $("#user-bookings__search-input").val()!.toString();
        dispatch(fetchBookedRooms({ query: searchValue }));
    }

    useEffect(() => {
        if (successMessage) {
            callToast("success", successMessage);
            $(`.button[data-booking-id="${cancelledBookingId}"]`).css("display", "none");
            $(`.button[data-booking-id="${cancelledBookingId}"]`).remove();
            $(`.button[data-booking-id="${cancelledBookingId}"]`).empty();
            dispatch(fetchUserBookedOrders());
        }
    }, [successMessage]);

    useEffect(() => {
        if (errorMessage) {
            callToast("error", errorMessage);
        }
    }, [errorMessage]);

    useEffect(() => {
        if (createReviewSuccess) callToast("success", "Đánh giá phòng thành công");
    }, [createReviewSuccess]);

    useEffect(() => {
        return () => {
            dispatch(clearCreateReviewSuccessState());
        };
    }, []);

    useEffect(() => {
        dispatch(fetchUserBookedOrders());
    }, []);

    function userCancelBooking(event: any) {
        dispatch(cancelUserBooking($(event.currentTarget).data("booking-id")));
    }

    return (
        <>
            <Header includeMiddle={true} excludeBecomeHostAndNavigationHeader={true} />
            <div
                style={{ minHeight: "100vh" }}
                className='p-relative'
                id='user-bookings__mainContainer'
            >
                <div></div>
                <div>
                    <div id='user-bookings__container'>
                        <div style={{ textAlign: "center" }}></div>
                        {/* <div className='normal-flex f1' id='user-bookings__search-container'>
                            <div
                                style={{ cursor: "pointer", marginRight: "10px" }}
                                onClick={filterBookings}
                            >
                                <Image src={getImage("/svg/search.svg")} size='20px' />
                            </div>
                            <input
                                type='text'
                                className='w-100'
                                placeholder='Tìm kiếm theo tên phòng, trạng thái'
                                id='user-bookings__search-input'
                            />
                            <div>
                                <button
                                    style={{ width: "100px" }}
                                    className='fs-14 fw-600 transparent__btn'
                                    onClick={handleResetQuery}
                                >
                                    Xóa tìm kiếm
                                </button>
                            </div>
                        </div> */}
                        {bookings.map(booking => {
                            const hostAvatar = booking.bookingDetails[0].roomHostAvatar;
                            const hostName = booking.bookingDetails[0].roomHostName;

                            return (
                                <div
                                    style={{
                                        border: "1px solid rgb(221, 221, 221)",
                                        borderRadius: "12px",
                                        padding: "20px",
                                        marginBottom: "12px",
                                    }}
                                >
                                    <div>
                                        <div className='host_info'>
                                            <div>
                                                <img
                                                    src={getImage(hostAvatar)}
                                                    className='rdt__host--avatar'
                                                    alt={hostAvatar}
                                                />
                                            </div>
                                            <div style={{ marginLeft: "20px" }}>
                                                <h2 className='room-hostName'>{hostName}</h2>
                                            </div>
                                        </div>
                                        <div>
                                            {booking.state === "APPROVED" && (
                                                <div
                                                    style={{
                                                        padding: "1px 6px",
                                                        borderRadius: "4px",
                                                        backgroundColor: "rgb(203 244 201)",
                                                    }}
                                                >
                                                    <span style={{ color: "rgba(14, 98, 69, 1)" }}>
                                                        <svg
                                                            aria-hidden='true'
                                                            className='
                                                        SVGInline-svg SVGInline--cleaned-svg
                                                        SVG-svg
                                                        Icon-svg Icon--check-svg Icon-color-svg
                                                        Icon-color--green500-svg
                                                    '
                                                            height='12'
                                                            width='12'
                                                            viewBox='0 0 16 16'
                                                            xmlns='http://www.w3.org/2000/svg'
                                                        >
                                                            <path
                                                                d='M5.297 13.213L.293 8.255c-.39-.394-.39-1.033 0-1.426s1.024-.394 1.414 0l4.294 4.224 8.288-8.258c.39-.393 1.024-.393 1.414 0s.39 1.033 0 1.426L6.7 13.208a.994.994 0 0 1-1.402.005z'
                                                                fillRule='evenodd'
                                                            ></path>
                                                        </svg>
                                                    </span>
                                                    <span className='booking-status'>
                                                        {" "}
                                                        Hoàn tất{" "}
                                                    </span>
                                                </div>
                                            )}{" "}
                                            {booking.state === "PENDING" && (
                                                <div
                                                    style={{
                                                        padding: "1px 6px",
                                                        borderRadius: "4px",
                                                        backgroundColor: "rgb(203 213 225)",
                                                    }}
                                                >
                                                    <span style={{ color: "white" }}>
                                                        <svg
                                                            aria-hidden='true'
                                                            className='
                                                        SVGInline-svg SVGInline--cleaned-svg
                                                        SVG-svg
                                                        Icon-svg Icon--clock-svg Icon-color-svg
                                                        Icon-color--gray500-svg
                                                    '
                                                            height='12'
                                                            width='12'
                                                            viewBox='0 0 16 16'
                                                            xmlns='http://www.w3.org/2000/svg'
                                                            style={{ fill: "#222" }}
                                                        >
                                                            <path
                                                                d='M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm1-8.577V4a1 1 0 1 0-2 0v4a1 1 0 0 0 .517.876l2.581 1.49a1 1 0 0 0 1-1.732z'
                                                                fillRule='evenodd'
                                                            ></path>
                                                        </svg>
                                                    </span>
                                                    &nbsp;
                                                    <span
                                                        className='booking-status'
                                                        style={{ color: "#222" }}
                                                    >
                                                        Đang phê duyệt
                                                    </span>
                                                </div>
                                            )}
                                            {booking.state === "OUTOFDATE" && (
                                                <div
                                                    style={{
                                                        padding: "1px 6px",
                                                        borderRadius: "4px",
                                                        backgroundColor: "rgb(139 92 246)",
                                                    }}
                                                >
                                                    <span style={{ color: "white" }}>
                                                        <svg
                                                            aria-hidden='true'
                                                            className='
                                                        SVGInline-svg SVGInline--cleaned-svg
                                                        SVG-svg
                                                        Icon-svg Icon--clock-svg Icon-color-svg
                                                        Icon-color--gray500-svg
                                                    '
                                                            height='12'
                                                            width='12'
                                                            viewBox='0 0 16 16'
                                                            xmlns='http://www.w3.org/2000/svg'
                                                            style={{ fill: "#fff" }}
                                                        >
                                                            <path
                                                                d='M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm1-8.577V4a1 1 0 1 0-2 0v4a1 1 0 0 0 .517.876l2.581 1.49a1 1 0 0 0 1-1.732z'
                                                                fillRule='evenodd'
                                                            ></path>
                                                        </svg>
                                                    </span>
                                                    &nbsp;
                                                    <span
                                                        className='booking-status'
                                                        style={{ color: "#fff" }}
                                                    >
                                                        Quá thời hạn phê duyệt
                                                    </span>
                                                </div>
                                            )}
                                            {booking.state === "CANCELLED" && (
                                                <div
                                                    style={{
                                                        backgroundColor: "#dc3545",
                                                        padding: "1px 6px",
                                                        borderRadius: "4px",
                                                    }}
                                                >
                                                    <span style={{ color: "rgba(14, 98, 69, 1)" }}>
                                                        <svg
                                                            aria-hidden='true'
                                                            className='
                                                        SVGInline-svg SVGInline--cleaned-svg
                                                        SVG-svg
                                                        Icon-svg Icon--refund-svg Icon-color-svg
                                                        Icon-color--gray500-svg
                                                    '
                                                            height='12'
                                                            width='12'
                                                            viewBox='0 0 16 16'
                                                            xmlns='http://www.w3.org/2000/svg'
                                                            style={{ fill: "white" }}
                                                        >
                                                            <path
                                                                d='M10.5 5a5 5 0 0 1 0 10 1 1 0 0 1 0-2 3 3 0 0 0 0-6l-6.586-.007L6.45 9.528a1 1 0 0 1-1.414 1.414L.793 6.7a.997.997 0 0 1 0-1.414l4.243-4.243A1 1 0 0 1 6.45 2.457L3.914 4.993z'
                                                                fillRule='evenodd'
                                                            ></path>
                                                        </svg>
                                                    </span>
                                                    <span
                                                        className='booking-status fs-14'
                                                        style={{ color: "white" }}
                                                    >
                                                        {" "}
                                                        Đã hủy
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {booking.bookingDetails.map(bookingDetail => {
                                        const room = {
                                            id: bookingDetail.roomId,
                                            name: bookingDetail.roomName,
                                            thumbnail: bookingDetail.roomThumbnail,
                                            category: bookingDetail.roomCategory,
                                            numberOfReviews: bookingDetail.numberOfReviews,
                                            cleanFee: bookingDetail.cleanFee,
                                            siteFee: bookingDetail.siteFee,
                                            currencySymbol: bookingDetail.roomCurrency,
                                            price: bookingDetail.pricePerDay,
                                            averageRating: bookingDetail.averageRating,
                                            totalFee: bookingDetail.totalFee,
                                            checkinDate: bookingDetail.checkinDate,
                                            checkoutDate: bookingDetail.checkoutDate,
                                        };

                                        return (
                                            <div
                                                style={{
                                                    marginTop: "12px",
                                                    borderTop: "1px solid rgb(221, 221, 221)",
                                                    paddingTop: "12px",
                                                    paddingBottom: "12px",
                                                }}
                                            >
                                                <RoomAndPricePreview
                                                    room={room}
                                                    numberOfNights={bookingDetail.numberOfDays}
                                                />
                                                {booking.state === "APPROVED" && (
                                                    <ReviewRoom bookingDetail={bookingDetail} />
                                                )}
                                            </div>
                                        );
                                    })}
                                    <div style={{ borderTop: "1px dashed rgb(6 182 212)" }}>
                                        {" "}
                                        <div id='boxPreview-footer' className='flex-space'>
                                            <div className='fs-16 fw-600'>Tổng &nbsp;</div>
                                            <div>
                                                <MyNumberForMat
                                                    price={booking.totalPrice}
                                                    priceFontSize='16px'
                                                    priceFontWeight='600'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='normal-flex'>
                                        <Link to={"/"}>
                                            <div className='mr-10'>
                                                <button className='button bg-normal'>
                                                    Tiếp tục đặt phòng
                                                </button>
                                            </div>
                                        </Link>
                                        {booking.state === "PENDING" && (
                                            <div className='cancelBookingBtn mr-10'>
                                                <button
                                                    className='button bg-normal'
                                                    onClick={userCancelBooking}
                                                    data-booking-id={booking.id}
                                                >
                                                    Hủy đặt phòng
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <Toast />
        </>
    );
};

export default BookedRoomsPage;
