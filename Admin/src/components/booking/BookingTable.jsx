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
import { Image } from "../../globalStyle";
import { BookingStatus, MyButton } from "../common";
import MyNumberForMat from "../../utils/MyNumberFormat";
import { Link } from "react-router-dom";
import {
    approveBooking,
    bookingState,
    cancelBooking,
    deleteBooking,
    fetchBookings,
} from "../../features/booking/bookingSlice";
import { useDispatch, useSelector } from "react-redux";
import Toast from "../notify/Toast";

function BookingTable({ type }) {
    const [page, setPage] = useState(0);

    const dispatch = useDispatch();

    const {
        listing: { bookings, totalElements, totalPages, loading },
        deleteBookingAction: { successMessage, errorMessage },
        cancelBookingAction: { successMessage: cbaSuccessMessage, errorMessage: cbaErrorMessage },
        approveBookingAction: { successMessage: abaSuccessMessage, errorMessage: abaErrorMessage },
    } = useSelector(bookingState);

    const handleDelete = bookingid => {
        dispatch(deleteBooking({ bookingid }));
    };

    const handleApprove = bookingid => {
        dispatch(approveBooking({ bookingid }));
    };

    const handleDeny = bookingid => {
        dispatch(cancelBooking({ bookingid }));
    };

    const roomColumns = [
        {
            title: "Id",
            field: "bookingId",
            render: rowData => <div style={{ maxWidth: "20px" }}>{rowData.bookingId}</div>,
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
            field: "totalFee",
            render: rowData => (
                <MyNumberForMat currency='đ' price={rowData.totalFee} removeStayType />
            ),
        },
        {
            title: "Action",
            field: "",
            render: rowData => (
                <div>
                    <Stack spacing={2} direction='row'>
                        <Link to={`/bookings/${rowData.bookingId}`}>
                            <MyButton label='Booking' type='view' />
                        </Link>
                        <MyButton
                            label='Booking'
                            type='approve'
                            onClick={() => {
                                handleApprove(rowData.bookingId);
                            }}
                        />
                        <MyButton
                            label='Booking'
                            type='deny'
                            onClick={() => {
                                console.log("abc");
                                handleDeny(rowData.bookingId);
                            }}
                        />
                        <MyButton
                            label='Booking'
                            type='delete'
                            onClick={() => {
                                handleDelete(rowData.bookingId);
                            }}
                            disabled={rowData.bookingDetails && rowData.bookingDetails.length > 0}
                        />
                    </Stack>
                </div>
            ),
        },
    ];

    const handlePageChange = (e, pn) => {
        dispatch(
            fetchBookings({
                page: pn + 1,
                type,
            })
        );
        setPage(pn);
    };

    useEffect(() => {
        if (type === "ALL") {
            dispatch(
                fetchBookings({
                    page: 1,
                    type,
                })
            );
        } else if (type === "APPROVED") {
            dispatch(
                fetchBookings({
                    page: 1,
                    type,
                })
            );
        } else if (type === "PENDING") {
            dispatch(
                fetchBookings({
                    page: 1,
                    type,
                })
            );
        } else {
            dispatch(
                fetchBookings({
                    page: 1,
                    type,
                })
            );
        }
    }, [type]);

    useEffect(() => {
        if (successMessage) {
            callToast("success", successMessage);
            dispatch(
                fetchBookings({
                    page: page + 1,
                    type,
                })
            );
        }
    }, [successMessage]);

    useEffect(() => {
        if (errorMessage) {
            callToast("error", errorMessage);
        }
    }, [errorMessage]);

    useEffect(() => {
        if (cbaSuccessMessage) {
            callToast("success", cbaSuccessMessage);
            dispatch(
                fetchBookings({
                    page: page + 1,
                    type,
                })
            );
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
                fetchBookings({
                    page: page + 1,
                    type,
                })
            );
        }
    }, [abaSuccessMessage]);

    useEffect(() => {
        if (abaErrorMessage) {
            callToast("error", abaErrorMessage);
        }
    }, [abaErrorMessage]);

    return (
        <>
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
                    pageSizeOptions: [10],
                    pageSize: 10,
                    exportButton: true,
                }}
                components={{
                    Pagination: _ => (
                        <TablePagination
                            onChangePage={handlePageChange}
                            rowsPerPage={10}
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
                                                        <TableCell>Action</TableCell>
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
                                                                <TableCell></TableCell>
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
