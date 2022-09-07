import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import {
    AcceptPolicy,
    CancelPolicy,
    ContactHost,
    PaymentError,
    PaymentInfo,
    PBRoomInfo,
    PBTitleSection,
    PreviewBookingInfo,
    ProgressBookingContainer,
    RoomAndPricePreview,
} from "../components/progress_booking";
import { fetchRoomById, roomState } from "../features/room/roomSlice";
import { Div, Image } from "../globalStyle";
import { callToast, getImage, useURLParams } from "../helpers";
import { loadStripe } from "@stripe/stripe-js";
import {
    bookingState,
    createBooking,
    fetchUserOrders,
    fetchUserSelectedOrders,
    getStripeClientSecret,
    transferToPendingBooking,
} from "../features/booking/bookingSlice";
import { Elements } from "@stripe/react-stripe-js";
import {
    calculateBeforeCheckinDateDateAndMonth,
    getFormattedCheckinAndCheckoutDate,
} from "./script/progress_booking";

import $ from "jquery";
import "./css/progress_booking.css";
import { Box } from "@material-ui/core";
import { MyNumberForMat } from "../components/utils";

interface IProgressBookingPageProps {}

const stripePromise = loadStripe(
    "pk_test_51I0IBMJc966wyBI6MIJecSCfMv7UPan6N0DVxro4nTDYIAQKJOiANIUQotSTu0NP99C5tuKPHdaWCrei9iR2ASsH00gRiN3lVe"
);

const ProgressBookingPage: FC<IProgressBookingPageProps> = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname, search } = useLocation();
    const { clientSecret, newlyCreatedBooking } = useSelector(bookingState);
    const { room } = useSelector(roomState);
    const params = useURLParams(search);

    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [siteFee, setSiteFee] = useState<number>(0);
    const [cleanFee, setCleanFee] = useState<number>(0);

    const {
        fetchUserSelectedOrdersAction: { loading, bookings },
        updateBookingStatusAction: { successMessage: ubsaSuccessMessage },
    } = useSelector(bookingState);

    useEffect(() => {
        dispatch(fetchUserSelectedOrders());
        dispatch(
            getStripeClientSecret({
                currency: "VND",
                price: 1000000,
            })
        );
    }, []);

    function trfToPendingBooking() {
        let bookingIds: number[] = bookings.map(({ id }) => id);

        dispatch(
            transferToPendingBooking({
                postData: bookingIds.map(id => {
                    if ($(`#clientMessage${id}`).text()) {
                        return {
                            id: id,
                            clientMessage: $(`#clientMessage${id}`).text()!,
                        };
                    }

                    return {
                        id: id,
                    };
                }),
            })
        );
    }

    useEffect(() => {
        let timeout: any = null;
        if (ubsaSuccessMessage) {
            callToast("success", "Tạo đơn đặt phòng thành công");
            timeout = setTimeout(() => {
                navigate("/user/booked-rooms");
            }, 3000);

            return () => timeout;
        }
    }, [ubsaSuccessMessage]);

    return (
        <div className='p-relative' id='progress--booking'>
            <Header includeMiddle={false} excludeBecomeHostAndNavigationHeader={true} />

            <div id='main'>
                <ProgressBookingContainer>
                    <PBTitleSection>
                        <Link to={`/bookings`} className='progress--booking__transparentBtn'>
                            <Image src={getImage("/svg/close3.svg")} size='16px' />
                        </Link>
                        <h1>Yêu cầu đặt nhà/phòng • AirTn</h1>
                    </PBTitleSection>
                    <PBRoomInfo>
                        <div className='f1' style={{ maxWidth: "90%", margin: "0 auto" }}>
                            <PaymentError />
                            <section className='progress--booking__infoSection'>
                                <div>Chuyến đi của bạn</div>
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
                                                        <h2 className='room-hostName'>
                                                            {hostName}
                                                        </h2>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <ContactHost id={booking.id} /> */}
                                            {booking.bookingDetails.map(bookingDetail => {
                                                const fromDateToDate =
                                                    getFormattedCheckinAndCheckoutDate(
                                                        bookingDetail.checkinDate,
                                                        bookingDetail.checkoutDate
                                                    );

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
                                                };

                                                return (
                                                    <div
                                                        style={{
                                                            borderTop:
                                                                "1px solid rgb(221, 221, 221)",
                                                            marginBottom: "12px",
                                                        }}
                                                    >
                                                        <PreviewBookingInfo
                                                            title='Ngày'
                                                            text={fromDateToDate}
                                                            componentName='calendar'
                                                        />
                                                        <div
                                                            style={{
                                                                width: "100%",
                                                                borderBottom:
                                                                    "1px solid rgb(221, 221, 221)",
                                                                marginBottom: "12px",
                                                            }}
                                                        ></div>
                                                        <RoomAndPricePreview
                                                            room={room}
                                                            numberOfNights={
                                                                bookingDetail.numberOfDays
                                                            }
                                                        />
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
                                        </div>
                                    );
                                })}
                            </section>
                            <section className='progress--booking__infoSection'>
                                <div style={{ paddingBottom: "0px !important" }}>
                                    Thanh toán bằng
                                </div>
                                <div>
                                    {clientSecret && (
                                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                                            <PaymentInfo />
                                        </Elements>
                                    )}
                                </div>
                            </section>
                            <CancelPolicy />
                            <AcceptPolicy />

                            <Div>
                                <button
                                    type='submit'
                                    className='rdt_booking_button'
                                    id='submit'
                                    onClick={trfToPendingBooking}
                                >
                                    <div className='spinner hidden' id='spinner'></div>
                                    <span>
                                        <span></span>
                                    </span>
                                    <span id='button-text'>Yêu cầu đặt nhà/phòng • AirTn</span>
                                </button>
                            </Div>
                        </div>
                    </PBRoomInfo>
                </ProgressBookingContainer>
            </div>
        </div>
    );
};

export default ProgressBookingPage;
