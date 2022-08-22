// @ts-nocheck
import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { BookingsTable } from "../components/booking";
import Header from "../components/Header";
import { FilterFooter, MyNumberForMat, Pagination } from "../components/utils";
import {
    approveBooking,
    bookingState,
    cancelBooking,
    clearAllFetchData,
    fetchUserBookings,
    setBookingDate,
    setBookingDateMonth,
    setBookingDateYear,
    setPage,
    setQuery,
    setTotalFee,
} from "../features/booking/bookingSlice";
import { Div, Image } from "../globalStyle";
import { getImage, seperateNumber } from "../helpers";

// import "./css/manage_booking_page.css";
// import "../components/hosting/listings/css/filter_by_line.css";
// import "../components/hosting/listings/css/filter_footer.css";
import $ from "jquery";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Stack, TableCell } from "@mui/material";
import { TablePagination } from "@material-ui/core";
import MaterialTable from "material-table";
import { tableIcons } from "./tableIcon";
import { BookingDetail } from "../types/booking/type_Booking";
import Toast from "../components/notify/Toast";
import BookingStatus from "../components/common/BookingStatus";
import { setAutoFreeze } from "immer";

interface IManageBookingPageProps {}

const ManageBookingsPage: FC<IManageBookingPageProps> = () => {
    // setAutoFreeze(false);
    const [page, setPage] = useState(0);

    const dispatch = useDispatch();
    const params = useParams();
    const [query, setLocalQuery] = useState("");

    const { bookings, totalElements, fetchData, totalPages } = useSelector(bookingState);

    useEffect(() => {
        dispatch(fetchUserBookings({ ...fetchData, page: parseInt(params.page!) }));
        // dispatch(setPage(parseInt(params.page!)));
    }, [params.page!]);

    function handleFindBookingByRoomIdAndName(event: any) {
        setLocalQuery(event.currentTarget.value);
        dispatch(
            fetchUserBookings({
                ...fetchData,
                page: parseInt(params.page!),
                query: event.currentTarget.value,
            })
        );
    }

    useEffect(() => {
        $(".listings__filter--option").each(function () {
            $(this)
                .off("click")
                .on("click", function () {
                    const self = $(this);
                    $(".listings__filter--option").each(function () {
                        if (!$(this).is(self))
                            $(this).siblings().filter(".active").removeClass("active");
                    });

                    const filterBox = $(`#${$(this).data("dropdown")}`);

                    filterBox.hasClass("active")
                        ? filterBox.removeClass("active")
                        : filterBox.addClass("active");

                    if ($(this).data("dropdown") === "clearFilter") {
                        dispatch(clearAllFetchData());
                        dispatch(fetchUserBookings({ page: fetchData.page }));
                    }
                });
        });
    }, []);

    function enableDeleteButton(value: string, footerOf: string) {
        const deleteButton = $(`.deleteBtn.${footerOf}`);
        if (value) {
            deleteButton.removeAttr("disabled");
        } else {
            deleteButton.attr("disabled", "true");
        }
    }

    function handleMonthChange(event: any) {
        const { value } = event.currentTarget;
        enableDeleteButton(value, "findByMonthAndYear");
        dispatch(setBookingDateMonth(value));
    }

    function handleYearChange(event: any) {
        const { value } = event.currentTarget;
        enableDeleteButton(value, "findByMonthAndYear");
        dispatch(setBookingDateYear(value));
    }

    function handleBookingDateChange(event: any) {
        const { value } = event.currentTarget;
        enableDeleteButton(value, "bookingDate");
        dispatch(setBookingDate(value));
    }

    function apprBooking(bookingId: string) {
        dispatch(approveBooking({ bookingId: parseInt(bookingId) }));
    }

    function dropoutBooking(bookingId: number) {
        dispatch(cancelBooking({ bookingId: bookingId! }));
    }

    const onChange = (value: number) => {
        if (isNaN(value)) {
            return;
        }

        enableDeleteButton(value.toString(), "totalFee");
        dispatch(setTotalFee(value));
    };

    const handlePageChange = (e: any, pn: any) => {
        // dispatch(
        //     fetchBookings({
        //         page: pn + 1,
        //         type,
        //     })
        // );
        setPage(pn);
    };

    const roomColumns = [
        {
            title: "Id",
            field: "id",
            render: (rowData: any) => <div style={{ maxWidth: "20px" }}>{rowData.id}</div>,
        },
        {
            title: "Customer",
            field: "customerFullName",
            render: (rowData: any) => (
                <span className='inline-flex items-center'>
                    <Image
                        src={getImage(rowData.customerAvatar)}
                        size='40px'
                        className='of-c rounded-full mr-2'
                    />
                    <span> {rowData.customerFullName} </span>
                </span>
            ),
        },
        {
            title: "Status",
            field: "state",
            render: (rowData: any) => <BookingStatus rowData={rowData} />,
        },
        {
            title: "Host",
            field: "",
            render: (rowData: any) => {
                if (rowData.bookingDetails && rowData.bookingDetails.length > 0) {
                    return (
                        <span>
                            <Image
                                src={getImage(rowData.bookingDetails[0].roomHostAvatar)}
                                size='40px'
                                className='of-c rounded-full'
                            />
                            <span> {rowData.bookingDetails[0].roomHostName} </span>
                        </span>
                    );
                } else {
                    return null;
                }
            },
        },
        {
            title: "Total Fee",
            field: "totalFee",
            render: (rowData: any) => (
                <MyNumberForMat currency='đ' price={rowData.totalFee} removeStayType />
            ),
        },
        {
            title: "Action",
            field: "",
            render: (rowData: any) => (
                <div>
                    <Stack spacing={2} direction='row'>
                        <Button
                            variant='outlined'
                            onClick={() => {
                                apprBooking(rowData.id);
                            }}
                        >
                            Phê duyệt
                        </Button>
                        <Button
                            variant='outlined'
                            onClick={() => {
                                apprBooking(rowData.id);
                            }}
                        >
                            Từ chối
                        </Button>
                    </Stack>
                </div>
            ),
        },
    ];

    const copiedBookings = bookings.map(b => ({ ...b }));

    return (
        <>
            <Header includeMiddle={true} excludeBecomeHostAndNavigationHeader={true} />

            <>
                {bookings && bookings.length > 0 && (
                    <MaterialTable
                        title={
                            <>
                                Total Bookings:
                                {/* <span className='text-base font-semibold'> {totalElements}</span> */}
                            </>
                        }
                        icons={tableIcons}
                        columns={roomColumns}
                        data={copiedBookings}
                        options={{
                            headerStyle: {
                                borderBottomColor: "red",
                                borderBottomWidth: "3px",
                                fontFamily: "verdana",
                            },
                            actionsColumnIndex: -1,
                            pageSizeOptions: [10],
                            pageSize: 10,
                            exportButton: true,
                        }}
                        detailPanel={(rowData: any) => {
                            if (rowData.bookingDetails && rowData.bookingDetails.length > 0) {
                                return (
                                    <div className='px-3.5 py-2.5'>
                                        <div>
                                            <div className='w-full p-3'>
                                                <TableContainer component={Paper}>
                                                    <Table
                                                        sx={{ minWidth: 650 }}
                                                        aria-label='simple table'
                                                    >
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Room</TableCell>
                                                                <TableCell>State</TableCell>
                                                                <TableCell>Total Fee</TableCell>
                                                                <TableCell>Checkin Date</TableCell>
                                                                <TableCell>Checkout Date</TableCell>
                                                                <TableCell>Action</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {rowData.bookingDetails.map(
                                                                (bookingDetail: BookingDetail) => {
                                                                    return (
                                                                        <TableRow>
                                                                            <TableCell>
                                                                                <div
                                                                                    className='normal-flex'
                                                                                    style={{
                                                                                        width: "300px",
                                                                                    }}
                                                                                >
                                                                                    <Image
                                                                                        src={getImage(
                                                                                            bookingDetail.roomThumbnail
                                                                                        )}
                                                                                        size='50px'
                                                                                    />
                                                                                    <span className='listings__room-name'>
                                                                                        {
                                                                                            bookingDetail.roomName
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <BookingStatus
                                                                                    rowData={
                                                                                        rowData
                                                                                    }
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {" "}
                                                                                <MyNumberForMat
                                                                                    price={
                                                                                        bookingDetail.totalFee
                                                                                    }
                                                                                    currency='đ'
                                                                                    removeStayType
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {
                                                                                    bookingDetail.checkinDate
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {" "}
                                                                                {
                                                                                    bookingDetail.checkoutDate
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell></TableCell>
                                                                        </TableRow>
                                                                    );
                                                                }
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        }}
                        onRowClick={(event, rowData, togglePanel) => togglePanel()}
                    />
                )}
                <Toast />
            </>
        </>
    );
};

export default ManageBookingsPage;
