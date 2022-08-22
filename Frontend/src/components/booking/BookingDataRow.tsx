import React, { FC } from "react";
import { Div, Image } from "../../globalStyle";
import { getImage } from "../../helpers";
import { BookingDetail, IBooking } from "../../types/booking/type_Booking";
import { MyNumberForMat } from "../utils";
import $ from "jquery";
import { useDispatch } from "react-redux";
import { approveBooking, cancelBooking } from "../../features/booking/bookingSlice";
import { Link } from "react-router-dom";

interface IBookingDataRowProps {
    bookingRowData: BookingDetail;
}

const BookingDataRow: FC<IBookingDataRowProps> = ({ bookingRowData }) => {
    let pageNumber = 1;
    const currentUrl = window.location.href;
    if (currentUrl.toString().includes("?")) {
        pageNumber = parseInt(currentUrl.split("?")[0].split("/").pop()!);
    } else {
        pageNumber = parseInt(window.location.href.split("/").pop()!);
    }

    function getMapSize(map: globalThis.Map<string, string>) {
        let len = 0;
        for (let key of Array.from(map.keys())) {
            len++;
        }

        return len;
    }

    const dispatch = useDispatch();

    function viewBooking(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const self = $(event.currentTarget);
        window.location.href = `${window.location.origin}/user/booked-rooms?query=${self.data(
            "booking-id"
        )}`;
    }

    function dropoutBooking(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        dispatch(cancelBooking({ bookingId: $(event.currentTarget).data("booking-id") }));
    }

    const today = new Date().getTime();
    const checkinDate = new Date(bookingRowData!.checkinDate).getTime();

    console.log(bookingRowData.bookingId, today <= checkinDate);

    return (
        <>
            {/* <tr data-room-id={bookingRowData.bookingId}>
                <td style={{ width: "10%" }}>
                    <div className='normal-flex'>
                        <Link
                            to={`/room/${bookingRowData.roomId}`}
                            className='normal-flex'
                            style={{ color: "#222" }}
                        >
                            <Div width='56px' height='40px'>
                                <img
                                    src={getImage(bookingRowData.roomThumbnail)}
                                    alt="Room's thumbnail"
                                    className='listings__room-thumbnail'
                                />
                            </Div>
                            <div
                                className='listings__room-name'
                                style={{
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    maxWidth: "80%",
                                }}
                            >
                                {bookingRowData.roomName}
                            </div>
                        </Link>
                    </div>
                </td>
                <td>
                    <span>{bookingRowData.bookingDate}</span>
                </td>
                <td className='listings__td-text' data-column='BEDROOM'>
                    <span>{bookingRowData.checkinDate}</span>
                </td>
                <td className='listings__td-text' data-column='BED'>
                    <span>{bookingRowData.checkoutDate}</span>
                </td>
                <td className='listings__td-text' data-column='BED'>
                    <Image
                        src={getImage(bookingRowData.customerAvatar)}
                        size='40px'
                        className='of-c rounded-border'
                    />
                    <span> {bookingRowData.customerName} </span>
                </td>
                <td className='listings__td-text' data-column='BATHROOM'>
                    <div>
                        <MyNumberForMat
                            price={bookingRowData.siteFee}
                            isPrefix
                            removeStayType
                            currency={bookingRowData.roomCurrency}
                        />
                    </div>
                </td>
                <td className='listings__td-text'>
                    <div>
                        <MyNumberForMat
                            price={bookingRowData.pricePerDay}
                            isPrefix
                            removeStayType
                            currency={bookingRowData.roomCurrency}
                        />
                    </div>
                </td>
                <td>{bookingRowData.numberOfDays}</td>
                <td className='listings__td-text' data-column='LASTMODIFIED'>
                    <div>
                        <MyNumberForMat
                            price={
                                bookingRowData.numberOfDays * bookingRowData.pricePerDay +
                                bookingRowData.siteFee
                            }
                            isPrefix
                            removeStayType
                            currency={bookingRowData.roomCurrency}
                            priceFontSize='16px'
                            stayTypeFontSize='16px'
                            priceFontWeight='500'
                            color='rgb(255, 56, 92)'
                        />
                    </div>
                </td>
                <td>
                    <MyNumberForMat
                        price={bookingRowData.refundPaid}
                        isPrefix
                        removeStayType
                        currency={bookingRowData.roomCurrency}
                        priceFontSize='16px'
                        stayTypeFontSize='16px'
                        priceFontWeight='500'
                    />
                </td>
                <td>
                    {bookingRowData.state === "PENDING" && today <= checkinDate && (
                        <button
                            className='listings__complete-room-making listings__td-text'
                            data-booking-id={bookingRowData.bookingId}
                            onClick={dropoutBooking}
                        >
                            Hủy bỏ
                        </button>
                    )}
                    {bookingRowData.state === "PENDING" && (
                        <button
                            className='listings__complete-room-making listings__td-text'
                            data-booking-id={bookingRowData.bookingId}
                            onClick={apprBooking}
                        >
                            Phê duyệt
                        </button>
                    )}
                    {bookingRowData.state === "APPROVED" && (
                        <button
                            className='listings__complete-room-making listings__td-text'
                            data-booking-id={bookingRowData.bookingId}
                            onClick={viewBooking}
                        >
                            Xem đơn đặt phòng
                        </button>
                    )}
                </td>
            </tr> */}
        </>
    );
};

export default BookingDataRow;
