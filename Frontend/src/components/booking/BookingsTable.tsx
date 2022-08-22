import { FC } from "react";
import { IBookingOrder } from "../../types/booking/type_Booking";
import BookingDataRow from "./BookingDataRow";
import { ColumnHeader } from "../utils";

interface IBookingsTableProps {
    bookings: IBookingOrder[];
}

const BookingsTable: FC<IBookingsTableProps> = ({ bookings }) => {
    return (
        <>
            {bookings.length ? (
                <>
                    <table id='table'>
                        <thead>
                            <tr>
                                <th style={{ width: "7%" }}>
                                    <ColumnHeader columnName='MÃ ĐẶT PHÒNG' sortField='id' />
                                </th>
                                <th>
                                    <ColumnHeader columnName='TRẠNG THÁI' sortField='isComplete' />
                                </th>
                                <th>
                                    <ColumnHeader
                                        columnName='NHÀ/PHÒNG CHO THUÊ'
                                        sortField='room-name'
                                    />
                                </th>
                                <th>
                                    <ColumnHeader
                                        columnName='NGÀY ĐẶT PHÒNG'
                                        sortField='bookingDate'
                                    />
                                </th>
                                <th>
                                    <ColumnHeader
                                        columnName='NGÀY CHECKIN'
                                        sortField='checkinDate'
                                    />
                                </th>
                                <th>
                                    <ColumnHeader
                                        columnName='NGÀY CHECKOUT'
                                        sortField='checkoutDate'
                                    />
                                </th>
                                <th>
                                    <ColumnHeader
                                        columnName='KHÁCH HÀNG'
                                        sortField='customer-fullName'
                                    />
                                </th>
                                <th>
                                    <ColumnHeader columnName='PHÍ DỊCH VỤ' sortField='siteFee' />
                                </th>
                                <th>
                                    <ColumnHeader
                                        columnName='GIÁ MỖI ĐÊM'
                                        sortField='pricePerDay'
                                    />
                                </th>
                                <th>
                                    <ColumnHeader
                                        columnName='TỔNG SỐ NGÀY'
                                        sortField='numberOfDays'
                                    />
                                </th>
                                <th>
                                    <ColumnHeader columnName='TỔNG CỘNG' sortField='totalFee' />
                                </th>
                                <th>
                                    <ColumnHeader
                                        columnName='PHÍ HOÀN TRẢ'
                                        sortField='refundPaid'
                                    />
                                </th>
                                <th>
                                    <ColumnHeader
                                        columnName='THAO TÁC'
                                        sortField=''
                                        isSortableHeader={false}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <>
                                    <tr>
                                        <td style={{ width: "7%" }}>
                                            <div
                                                style={{
                                                    paddingLeft: "8px",
                                                    textAlign: "center",
                                                    paddingRight: "8px",
                                                }}
                                            >
                                                <span>{booking.id}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='h-100 normal-flex'>
                                                <div>
                                                    {booking.state === "APPROVED" && (
                                                        <div
                                                            style={{
                                                                padding: "1px 6px",
                                                                borderRadius: "4px",
                                                                backgroundColor: "rgb(203 244 201)",
                                                                width: "90px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    color: "rgba(14, 98, 69, 1)",
                                                                }}
                                                            >
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
                                                            <span
                                                                className='booking-status fs-14 inline-block'
                                                                style={{ paddingLeft: "4px" }}
                                                            >
                                                                Approved
                                                            </span>
                                                        </div>
                                                    )}
                                                    {booking.state === "PENDING" && (
                                                        <div
                                                            style={{
                                                                padding: "1px 6px",
                                                                borderRadius: "4px",
                                                                backgroundColor: "rgb(227 232 238)",
                                                                display: "flex",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    color: "rgba(14, 98, 69, 1)",
                                                                }}
                                                            >
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
                                                                    style={{
                                                                        fill: "rgb(105 115 134)",
                                                                    }}
                                                                >
                                                                    <path
                                                                        d='M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm1-8.577V4a1 1 0 1 0-2 0v4a1 1 0 0 0 .517.876l2.581 1.49a1 1 0 0 0 1-1.732z'
                                                                        fillRule='evenodd'
                                                                    ></path>
                                                                </svg>
                                                            </span>
                                                            <span
                                                                className='booking-status fs-14 inline-block'
                                                                style={{ paddingLeft: "4px" }}
                                                            >
                                                                Pending
                                                            </span>
                                                        </div>
                                                    )}
                                                    {booking.state === "CANCELLED" && (
                                                        <div
                                                            style={{
                                                                backgroundColor: "rgb(255, 56, 92)",
                                                                padding: "1px 6px",
                                                                borderRadius: "4px",
                                                                width: "90px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <span className='inline-block mr-5'>
                                                                <svg
                                                                    aria-hidden='true'
                                                                    height='12px'
                                                                    width='12px'
                                                                    viewBox='0 0 16 16'
                                                                    xmlns='http://www.w3.org/2000/svg'
                                                                    style={{ fill: "#fff" }}
                                                                >
                                                                    <path
                                                                        d='M10.5 5a5 5 0 0 1 0 10 1 1 0 0 1 0-2 3 3 0 0 0 0-6l-6.586-.007L6.45 9.528a1 1 0 0 1-1.414 1.414L.793 6.7a.997.997 0 0 1 0-1.414l4.243-4.243A1 1 0 0 1 6.45 2.457L3.914 4.993z'
                                                                        fillRule='evenodd'
                                                                    ></path>
                                                                </svg>
                                                            </span>
                                                            <span
                                                                className='booking-status fs-14 inline-block'
                                                                style={{
                                                                    paddingLeft: "4px",
                                                                    color: "white",
                                                                }}
                                                            >
                                                                Cancelled
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        {booking.bookingDetails.map(bookingDetail => (
                                            <BookingDataRow
                                                bookingRowData={bookingDetail}
                                                key={booking.id}
                                            />
                                        ))}
                                    </tr>
                                </>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <div
                    style={{ fontSize: "18px", lineHeight: "24px" }}
                    className='flex-2 fw-600 flex-center w100-h100'
                >
                    <h3> Không tìm thấy kết quả</h3>
                </div>
            )}
        </>
    );
};

export default BookingsTable;
