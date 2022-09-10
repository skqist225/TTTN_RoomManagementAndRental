// @ts-nocheck
import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import { MyNumberForMat } from "../components/utils";
import {
    approveBooking,
    bookingState,
    cancelBooking,
    clearAllFetchData,
    clearApproveAndDenyState,
    fetchBookingsCount,
    fetchUserBookings,
    setBookingDate,
    setBookingDateMonth,
    setBookingDateYear,
    setTotalFee,
} from "../features/booking/bookingSlice";
import { Div, Image } from "../globalStyle";
import { callToast, getImage } from "../helpers";
import "./css/manage_booking_page.css";

import $ from "jquery";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Stack, TableCell } from "@mui/material";
import { TablePagination } from "@material-ui/core";
import MaterialTable from "material-table";
import { tableIcons } from "./tableIcon";
import { BookingDetail } from "../types/booking/type_Booking";
import Toast from "../components/notify/Toast";
import BookingStatus from "../components/common/BookingStatus";
import { FilterButton } from "../components/hosting/listings/components";
import { Button } from "antd";
import SimpleStatNumber from "../components/booking/SimpleStatNumber";

interface IManageBookingPageProps {}

const ManageBookingsPage: FC<IManageBookingPageProps> = () => {
    const [page, setPage] = useState(0);

    const dispatch = useDispatch();
    const params = useParams();
    const [localQuery, setLocalQuery] = useState("");

    const {
        bookings,
        totalElements,
        fetchData,
        approveBookingAction: { successMessage, errorMessage },
        cancelBookingAction: { successMessage: cbaSuccessMessage, errorMessage: cbaErrorMessage },
        countBookingAction: {
            numberOfApproved,
            numberOfPending,
            numberOfCancelled,
            numberOfAllBookings,
        },
    } = useSelector(bookingState);

    console.log(numberOfApproved, numberOfPending, numberOfCancelled, numberOfAllBookings);

    useEffect(() => {
        dispatch(fetchUserBookings({ ...fetchData, page: parseInt(params.page!) }));
    }, [params.page!]);

    useEffect(() => {
        dispatch(fetchBookingsCount());
    }, []);

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
        if (successMessage) {
            callToast("success", "Duyệt đơn đặt phòng thành công");
            dispatch(fetchUserBookings({ ...fetchData, page: parseInt(params.page!) }));
            dispatch(fetchBookingsCount());
        }
    }, [successMessage]);

    useEffect(() => {
        return () => {
            dispatch(clearApproveAndDenyState());
        };
    }, []);

    useEffect(() => {
        if (errorMessage) {
            callToast("error", "Duyệt đơn đặt phòng thất bại");
        }
    }, [errorMessage]);

    useEffect(() => {
        if (cbaSuccessMessage) {
            callToast("success", "Hủy đơn đặt phòng thành công");
            dispatch(fetchUserBookings({ ...fetchData, page: parseInt(params.page!) }));
            dispatch(fetchBookingsCount());
        }
    }, [cbaSuccessMessage]);

    useEffect(() => {
        if (cbaErrorMessage) {
            callToast("error", "Hủy đơn đặt phòng thất bại");
        }
    }, [cbaErrorMessage]);

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
    }, [bookings.length]);

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

    function apprBooking(bookingId: string) {
        dispatch(approveBooking({ bookingId: parseInt(bookingId) }));
    }

    function dropoutBooking(bookingId: number) {
        dispatch(cancelBooking({ bookingId: bookingId! }));
        dispatch(fetchBookingsCount());
    }

    const onChange = (value: number) => {
        if (isNaN(value)) {
            return;
        }

        enableDeleteButton(value.toString(), "totalFee");
        dispatch(setTotalFee(value));
    };

    const handlePageChange = (e: any, pn: any) => {
        dispatch(fetchUserBookings({ ...fetchData, page: pn + 1 }));

        setPage(pn);
    };

    const roomColumns = [
        {
            title: "Mã nhà/phòng",
            field: "id",
            render: (rowData: any) => <div style={{ maxWidth: "20px" }}>{rowData.id}</div>,
        },
        {
            title: "Khách hàng",
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
            title: "Trạng thái",
            field: "state",
            render: (rowData: any) => <BookingStatus rowData={rowData} />,
        },
        {
            title: "Ngày đặt phòng",
            field: "bookingDate",
        },
        {
            title: "Ngày hủy phòng",
            field: "cancelDate",
        },
        {
            title: "Phí hoàn trả",
            field: "refundPaid",
            render: (rowData: any) => {
                return <MyNumberForMat price={rowData.refundPaid} />;
            },
        },
        {
            title: "Tổng phí",
            field: "totalPrice",
            render: (rowData: any) => {
                return <MyNumberForMat price={rowData.totalPrice} />;
            },
        },
        {
            title: "Thao tác",
            field: "",
            render: (rowData: any) => {
                return (
                    <div style={{ width: "255px" }}>
                        <Stack spacing={2} direction='row'>
                            <Button
                                variant='outlined'
                                onClick={() => {
                                    apprBooking(rowData.id);
                                }}
                                disabled={!rowData.canDoAction || rowData.state == "APPROVED"}
                            >
                                Phê duyệt
                            </Button>
                            <Button
                                variant='outlined'
                                onClick={() => {
                                    dropoutBooking(rowData.id);
                                }}
                                disabled={!rowData.canDoAction || rowData.state == "CANCELLED"}
                            >
                                Từ chối
                            </Button>
                        </Stack>
                    </div>
                );
            },
        },
    ];

    const copiedBookings = bookings.map(b => ({ ...b }));

    return (
        <>
            <Header includeMiddle={true} excludeBecomeHostAndNavigationHeader={true} />

            <div style={{ marginTop: "100px" }}>
                <div
                    className='flex items-center justify-between w-full'
                    style={{ maxWidth: "1200px", margin: "0 auto" }}
                >
                    <SimpleStatNumber
                        label='Tổng đơn đặt phòng'
                        type='All'
                        backgroundColor={`rgb(139 92 246)`}
                        number={numberOfAllBookings}
                    />
                    <SimpleStatNumber
                        label='Tổng đơn đặt phòng thành công'
                        type='Approved'
                        backgroundColor={`rgb(34 197 94)`}
                        number={numberOfApproved}
                    />
                    <SimpleStatNumber
                        label='Tổng đơn đặt phòng đã hủy'
                        type='Cancelled'
                        backgroundColor={`rgb(244 63 94)`}
                        number={numberOfCancelled}
                    />
                    <SimpleStatNumber
                        label='Tổng đơn đặt phòng chờ duyệt'
                        type='Pending'
                        backgroundColor={`rgb(245 158 11)`}
                        number={numberOfPending}
                    />
                </div>
                <div className='normal-flex'>
                    <div className='listings__search-room'>
                        <div className='listings__search-icon-container'>
                            <Image src={getImage("/svg/search.svg")} size='12px' />
                        </div>
                        <div className='f1' style={{ marginLeft: "10px" }}>
                            <input
                                type='text'
                                placeholder='Tìm kiếm theo mã đơn, tên khách hàng'
                                id='listings__search-input'
                                value={localQuery}
                                onChange={handleFindBookingByRoomIdAndName}
                            />
                        </div>
                    </div>
                    <div>
                        <FilterButton
                            dataDropDown='listings__filter-findByMonthAndYear'
                            title='Tìm kiếm theo tháng và năm'
                            width='200px'
                            height='300px'
                            content={
                                <>
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
                                                value={fetchData.bookingDateMonth}
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
                                                value={fetchData.bookingDateYear}
                                                onChange={handleYearChange}
                                            />
                                        </div>
                                    </Div>
                                </>
                            }
                            footerOf='findByMonthAndYear'
                        />
                    </div>
                    <div>
                        <FilterButton
                            dataDropDown='listings__filter-bookingStatus'
                            title='Trạng thái đặt phòng'
                            width='300px'
                            height='300px'
                            content={
                                <>
                                    <div className='listings__filter-wrapper'>
                                        <div style={{ padding: "24px" }} className='f1'>
                                            <div
                                                className='normal-flex listings__filter-status-row'
                                                style={{ marginBottom: "10px" }}
                                            >
                                                <div
                                                    style={{ marginRight: "10px" }}
                                                    className='normal-flex'
                                                >
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
                                                <div
                                                    style={{ marginRight: "10px" }}
                                                    className='normal-flex'
                                                >
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
                                                <div
                                                    style={{ marginRight: "10px" }}
                                                    className='normal-flex'
                                                >
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
                                </>
                            }
                            footerOf='bookingStatus'
                        />
                    </div>
                    <div>
                        <FilterButton
                            dataDropDown='clearFilter'
                            title='Xóa toàn bộ bộ lọc'
                            width=''
                            height=''
                            content={<></>}
                            footerOf=''
                            haveBox={false}
                        />
                    </div>
                </div>
            </div>
            <>
                {bookings && bookings.length > 0 && (
                    <div style={{ marginTop: "0px" }}>
                        <MaterialTable
                            title={
                                <div>
                                    <span style={{ fontSize: "16px", fontWeight: "600" }}>
                                        Tổng đơn đặt phòng: &nbsp;
                                    </span>
                                    <span
                                        className='text-base font-semibold'
                                        style={{ fontSize: "16px", fontWeight: "600" }}
                                    >
                                        {totalElements}
                                    </span>
                                </div>
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
                                search: false,
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
                                                                    <TableCell>Nhà/phòng</TableCell>
                                                                    <TableCell>Tổng phí</TableCell>
                                                                    <TableCell>
                                                                        Ngày nhận phòng
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        Ngày trả phòng
                                                                    </TableCell>
                                                                    <TableCell>Đánh giá</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {rowData.bookingDetails.map(
                                                                    (
                                                                        bookingDetail: BookingDetail
                                                                    ) => {
                                                                        return (
                                                                            <TableRow
                                                                                key={
                                                                                    bookingDetail.bookingDetailId
                                                                                }
                                                                            >
                                                                                <TableCell>
                                                                                    <Link
                                                                                        to={`/room/${bookingDetail.roomId}`}
                                                                                    >
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
                                                                                    </Link>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    {" "}
                                                                                    <MyNumberForMat
                                                                                        price={
                                                                                            bookingDetail.totalFee
                                                                                        }
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
                                                                                <TableCell>
                                                                                    {bookingDetail.review && (
                                                                                        <span>
                                                                                            {
                                                                                                bookingDetail
                                                                                                    .review
                                                                                                    .comment
                                                                                            }
                                                                                            &nbsp; (
                                                                                            {Math.floor(
                                                                                                bookingDetail
                                                                                                    .review
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
                        />
                    </div>
                )}
                <Toast />
            </>
        </>
    );
};

export default ManageBookingsPage;
