import MaterialTable from "@material-table/core";
import React, { useEffect, useState } from "react";
import { tableIcons } from "../../utils/tableIcon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Stack, TableCell } from "@mui/material";
import { TablePagination } from "@material-ui/core";
import { callToast, getImage } from "../../helpers";
import { Div, Image } from "../../globalStyle";
import { BookingStatus, MyButton } from "../common";
import MyNumberForMat from "../../utils/MyNumberFormat";
import {
    approveBooking,
    bookingState,
    cancelBooking,
    fetchAdminUserBookings,
    fetchBookingsCount,
    clearApproveAndDenyState,
} from "../../features/booking/bookingSlice";
import { useDispatch, useSelector } from "react-redux";
import Toast from "../notify/Toast";
import SimpleStatNumber from "./SimpleStatNumber";
import $ from "jquery";

function BookingTable() {
    const [page, setPage] = useState(0);
    const [localQuery, setLocalQuery] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

    const dispatch = useDispatch();

    const {
        listing: { bookings, totalElements },
        fetchData,
        cancelBookingAction: { successMessage: cbaSuccessMessage, errorMessage: cbaErrorMessage },
        approveBookingAction: { successMessage: abaSuccessMessage, errorMessage: abaErrorMessage },
        countBookingAction: {
            numberOfApproved,
            numberOfPending,
            numberOfCancelled,
            numberOfAllBookings,
        },
    } = useSelector(bookingState);

    useEffect(() => {
        dispatch(fetchBookingsCount());
    }, []);

    const handleApprove = bookingid => {
        dispatch(approveBooking({ bookingid }));
    };

    const handleDeny = bookingid => {
        dispatch(cancelBooking({ bookingid }));
    };

    const roomColumns = [
        {
            title: "Id",
            field: "id",
            render: rowData => <div style={{ maxWidth: "20px" }}>{rowData.id}</div>,
        },
        {
            title: "Customer",
            field: "customerFullName",
            render: rowData => (
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
            render: rowData => <BookingStatus rowData={rowData} />,
        },
        {
            title: "Booking Date",
            field: "bookingDate",
        },
        {
            title: "Cancel Date",
            field: "cancelDate",
        },
        {
            title: "Host",
            field: "",
            render: rowData => {
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
            field: "totalPrice",
            render: rowData => <MyNumberForMat price={rowData.totalPrice} />,
        },
        {
            title: "Action",
            field: "",
            render: rowData => (
                <div>
                    <Stack spacing={2} direction='row'>
                        <MyButton
                            label='Booking'
                            type='approve'
                            onClick={() => {
                                handleApprove(rowData.id);
                            }}
                            disabled={!rowData.canDoAction || rowData.state == "APPROVED"}
                        />
                        <MyButton
                            label='Booking'
                            type='deny'
                            onClick={() => {
                                handleDeny(rowData.id);
                            }}
                            disabled={!rowData.canDoAction || rowData.state == "CANCELLED"}
                        />
                    </Stack>
                </div>
            ),
        },
    ];

    const handlePageChange = (e, pn) => {
        setPage(pn);

        dispatch(
            fetchAdminUserBookings({
                page: pn + 1,
                query: localQuery,
                bookingDateMonth: selectedMonth,
                bookingDateYear: selectedYear,
                isComplete:
                    getSelectedState().length > 0
                        ? getSelectedState().join(",")
                        : "APPROVED,PENDING,CANCELLED",
            })
        );
    };

    useEffect(() => {
        dispatch(
            fetchAdminUserBookings({
                page: 1,
            })
        );
    }, []);

    useEffect(() => {
        if (cbaSuccessMessage) {
            callToast("success", cbaSuccessMessage);
            dispatch(
                fetchAdminUserBookings({
                    page: page + 1,
                    query: localQuery,
                    bookingDateMonth: selectedMonth,
                    bookingDateYear: selectedYear,
                    isComplete:
                        getSelectedState().length > 0
                            ? getSelectedState().join(",")
                            : "APPROVED,PENDING,CANCELLED",
                })
            );
            dispatch(fetchBookingsCount());
        }
    }, [cbaSuccessMessage]);

    useEffect(() => {
        if (cbaErrorMessage) {
            callToast("error", cbaErrorMessage);
        }
    }, [cbaErrorMessage]);

    useEffect(() => {
        if (abaSuccessMessage) {
            callToast("success", abaSuccessMessage);
            dispatch(
                fetchAdminUserBookings({
                    page: page + 1,
                    query: localQuery,
                    bookingDateMonth: selectedMonth,
                    bookingDateYear: selectedYear,
                    isComplete:
                        getSelectedState().length > 0
                            ? getSelectedState().join(",")
                            : "APPROVED,PENDING,CANCELLED",
                })
            );
            dispatch(fetchBookingsCount());
        }
    }, [abaSuccessMessage]);

    useEffect(() => {
        if (abaErrorMessage) {
            callToast("error", abaErrorMessage);
        }
    }, [abaErrorMessage]);

    useEffect(() => {
        return () => {
            dispatch(clearApproveAndDenyState());
        };
    }, []);

    function handleMonthChange(event) {
        const { value } = event.currentTarget;
        setSelectedMonth(value);
    }

    function handleYearChange(event) {
        const { value } = event.currentTarget;
        setSelectedYear(value);
    }

    function getSelectedState() {
        const statuses = $("input.isCompleteSelected");
        let isComplete = [];
        statuses.each(function () {
            if ($(this).prop("checked")) {
                isComplete.push($(this).val());
            }
        });

        return isComplete;
    }

    return (
        <>
            <div className='flex items-center justify-between w-full'>
                <SimpleStatNumber
                    label='Total Bookings'
                    type='All'
                    backgroundColor={`bg-violet-500`}
                    number={numberOfAllBookings}
                />
                <SimpleStatNumber
                    label='Approved Bookings'
                    type='Approved'
                    backgroundColor={`bg-green-500`}
                    number={numberOfApproved}
                />
                <SimpleStatNumber
                    label='Pending Bookings'
                    type='Pending'
                    backgroundColor={`bg-amber-500`}
                    number={numberOfCancelled}
                />
                <SimpleStatNumber
                    label='Cancelled Bookings'
                    type='Cancelled'
                    backgroundColor={`bg-rose-500`}
                    number={numberOfPending}
                />
            </div>
            <div className='normal-flex my-5 items-center justify-between'>
                <div className='listings__search-room'>
                    <div className='f1' style={{ marginLeft: "10px" }}>
                        <input
                            type='text'
                            placeholder='id, customer'
                            id='listings__search-input'
                            value={localQuery}
                            onChange={event => {
                                setLocalQuery(event.target.value);
                            }}
                        />
                    </div>
                </div>
                <div>
                    <Div className='filter-box' height='80%' padding='24px'>
                        <div>
                            <input
                                type='text'
                                placeholder='Tháng'
                                className='form-control mb-5'
                                id='bookingDateMonthInput'
                                pattern='^[1-12]{1,2}$'
                                minLength={1}
                                maxLength={2}
                                value={selectedMonth}
                                onChange={handleMonthChange}
                            />
                        </div>
                        <div>
                            <input
                                type='text'
                                placeholder='Năm'
                                className='form-control'
                                id='bookingDateYearInput'
                                pattern='^[0-9]+'
                                minLength={4}
                                maxLength={4}
                                value={selectedYear}
                                onChange={handleYearChange}
                            />
                        </div>
                    </Div>
                </div>
                <div>
                    <div className='listings__filter-wrapper'>
                        <div style={{ padding: "24px" }} className='f1'>
                            <div
                                className='normal-flex listings__filter-status-row'
                                style={{ marginBottom: "10px" }}
                            >
                                <div style={{ marginRight: "10px" }} className='normal-flex'>
                                    <input
                                        type='checkbox'
                                        className='isCompleteSelected'
                                        value='APPROVED'
                                    />
                                </div>
                                <BookingStatus
                                    rowData={{
                                        state: "APPROVED",
                                    }}
                                />
                            </div>
                            <div
                                className='normal-flex listings__filter-status-row'
                                style={{ marginBottom: "10px" }}
                            >
                                <div style={{ marginRight: "10px" }} className='normal-flex'>
                                    <input
                                        type='checkbox'
                                        className='isCompleteSelected'
                                        value='PENDING'
                                    />
                                </div>
                                <BookingStatus
                                    rowData={{
                                        state: "PENDING",
                                    }}
                                />
                            </div>
                            <div
                                className='normal-flex listings__filter-status-row'
                                style={{ marginBottom: "10px" }}
                            >
                                <div style={{ marginRight: "10px" }} className='normal-flex'>
                                    <input
                                        type='checkbox'
                                        className='isCompleteSelected'
                                        value='CANCELLED'
                                    />
                                </div>
                                <BookingStatus
                                    rowData={{
                                        state: "CANCELLED",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex items-center'>
                    <div className='mr-2'>
                        <MyButton
                            type='search'
                            onClick={() => {
                                dispatch(
                                    fetchAdminUserBookings({
                                        page: page + 1,
                                        query: localQuery,
                                        bookingDateMonth: selectedMonth,
                                        bookingDateYear: selectedYear,
                                        isComplete:
                                            getSelectedState().length > 0
                                                ? getSelectedState().join(",")
                                                : "APPROVED,PENDING,CANCELLED",
                                    })
                                );
                            }}
                        />
                    </div>
                    <MyButton
                        type='clearFilter'
                        onClick={() => {
                            setLocalQuery("");
                            setPage(0);
                            setSelectedMonth("");
                            setSelectedYear("");

                            const statuses = $("input.isCompleteSelected");
                            statuses.each(function () {
                                if ($(this).prop("checked")) {
                                    $(this).prop("checked", false);
                                }
                            });

                            dispatch(
                                fetchAdminUserBookings({
                                    page: page + 1,
                                })
                            );
                        }}
                    />
                </div>
            </div>
            <MaterialTable
                title={
                    <>
                        Total Bookings:
                        <span className='text-base font-semibold'> {totalElements}</span>
                    </>
                }
                icons={tableIcons}
                columns={roomColumns}
                data={bookings}
                options={{
                    headerStyle: {
                        borderBottomColor: "red",
                        borderBottomWidth: "3px",
                        fontFamily: "verdana",
                    },
                    actionsColumnIndex: -1,
                    pageSize: 10,
                    exportButton: {
                        pdf: true,
                        csv: false,
                    },
                    search: false,
                    exportAllData: true, // optional
                    toolbar: true,
                }}
                components={{
                    Pagination: _ => (
                        <TablePagination
                            onChangePage={handlePageChange}
                            rowsPerPage={10}
                            rowsPerPageOptions={[]}
                            page={page}
                            count={totalElements}
                        />
                    ),
                }}
                detailPanel={({ rowData }) => {
                    if (rowData.bookingDetails && rowData.bookingDetails.length > 0) {
                        return (
                            <div className='px-3.5 py-2.5'>
                                <div>
                                    <div className='w-full p-3'>
                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Room</TableCell>
                                                        <TableCell>State</TableCell>
                                                        <TableCell>Total Fee</TableCell>
                                                        <TableCell>Checkin Date</TableCell>
                                                        <TableCell>Checkout Date</TableCell>
                                                        <TableCell>Review</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {rowData.bookingDetails.map(bookingDetail => {
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
                                                                            {bookingDetail.roomName}
                                                                        </span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <BookingStatus
                                                                        rowData={rowData}
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
                                                                    {bookingDetail.checkinDate}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {" "}
                                                                    {bookingDetail.checkoutDate}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {bookingDetail.review && (
                                                                        <span>
                                                                            {
                                                                                bookingDetail.review
                                                                                    .comment
                                                                            }
                                                                            &nbsp; (
                                                                            {Math.floor(
                                                                                bookingDetail.review
                                                                                    .finalRating
                                                                            )}
                                                                            <Image
                                                                                src={getImage(
                                                                                    "/svg/yellowstar.svg"
                                                                                )}
                                                                                size='20px'
                                                                            />
                                                                            )
                                                                        </span>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
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
            <Toast />
        </>
    );
}

export default BookingTable;
