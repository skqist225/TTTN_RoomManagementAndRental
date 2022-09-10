import MaterialTable from "@material-table/core";
import { tableIcons } from "../utils/tableIcon";
import { getImage } from "../helpers";
import MyNumberForMat from "../utils/MyNumberFormat";
import Stack from "@mui/material/Stack";
import TablePagination from "@material-ui/core/TablePagination";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearEditState, fetchRooms } from "../features/room/roomSlice";
import { useEffect, useState } from "react";
import { Box, Slider } from "@material-ui/core";
import { MyButton } from "../components/common";
import $ from "jquery";

import "../css/page/rooms.css";
import "./css/filter_by_line.css";

import { disableRoom, enableRoom } from "../features/user/userSlice";

const RoomsPage = () => {
    const dispatch = useDispatch();
    const [query, setQuery] = useState("");
    const [price, setPrice] = useState(0);
    const [page, setPage] = useState(0);

    const {
        hosting: { rooms, totalRecords, totalPages, loading },
    } = useSelector(state => state.room);

    const handlePageChange = (e, pn) => {
        dispatch(
            fetchRooms({
                page: pn + 1,
                query,
                price,
            })
        );
        setPage(pn);
    };

    useEffect(() => {
        dispatch(clearEditState());
    }, []);

    const handleDisableRoom = roomId => {
        const statuses = $("input.isCompleteSelected");
        let isComplete = [];
        statuses.each(function () {
            if ($(this).prop("checked")) {
                isComplete.push($(this).val());
            }
        });

        dispatch(
            disableRoom({
                id: roomId,
                roomFilter: {
                    page: page + 1,
                    query,
                    price,
                    roomStatus: isComplete,
                },
            })
        );
    };

    const handleEnableRoom = roomId => {
        const statuses = $("input.isCompleteSelected");
        let isComplete = [];
        statuses.each(function () {
            if ($(this).prop("checked")) {
                isComplete.push($(this).val());
            }
        });

        dispatch(
            enableRoom({
                id: roomId,
                roomFilter: {
                    page: page + 1,
                    query,
                    price,
                    roomStatus: isComplete,
                },
            })
        );
    };

    const handlePriceChange = (event, newValue) => {
        setPrice(newValue);
    };

    const roomColumns = [
        {
            title: "Id",
            field: "id",
            render: rowData => <div style={{ maxWidth: "20px" }}>{rowData.id}</div>,
        },
        {
            title: "Name",
            field: "name",
            render: rowData => (
                <div className='normal-flex' style={{ maxWidth: "200px" }}>
                    <img src={getImage(rowData.thumbnail)} className='image' />
                    <span className='listings__room-name'>{rowData.name}</span>
                </div>
            ),
        },
        {
            title: "Status",
            field: "status",
            render: rowData => (
                <>
                    {rowData.status === true ? (
                        <div className='normal-flex'>
                            <div className='mr-10'>
                                <svg
                                    viewBox='0 0 16 16'
                                    xmlns='http://www.w3.org/2000/svg'
                                    style={{
                                        display: "block",
                                        height: "16px",
                                        width: "16px",
                                        fill: "#008a05",
                                    }}
                                    aria-hidden='true'
                                    role='presentation'
                                    focusable='false'
                                >
                                    <path d='M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm3.159 4.869L6.67 9.355 4.42 7.105 3.289 8.236 6.67 11.62 12.291 6z'></path>
                                </svg>
                            </div>
                            <div>Available</div>
                        </div>
                    ) : (
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <img
                                src={getImage("/svg/reddot.svg")}
                                width='10px'
                                height='10px'
                                className='mr-10'
                            />
                            <span>Unavailable</span>
                        </div>
                    )}
                </>
            ),
        },
        {
            title: "Host",
            field: "host",
            render: rowData => <span>{rowData.host.fullName}</span>,
        },
        {
            title: "Price",
            field: "price",
            render: rowData => (
                <div style={{ width: "150px" }}>
                    <MyNumberForMat price={rowData.price} />
                </div>
            ),
        },
        {
            title: "Location",
            field: "location",
            render: rowData => (
                <div
                    style={{ maxWidth: "300px" }}
                    className='listings__td-text listings__room-name'
                >
                    {rowData.location}
                </div>
            ),
        },
        {
            title: "Created",
            field: "createdDate",
            render: rowData => <span className='listings__td-text'>{rowData.createdDate}</span>,
        },
        {
            title: "Action",
            field: "action",
            render: rowData => (
                <div>
                    <Stack spacing={2} direction='row'>
                        <Link to={`/rooms/${rowData.id}/edit`}>
                            <MyButton type='edit' />
                        </Link>
                        {rowData.status ? (
                            <MyButton
                                label='Room'
                                type='disable'
                                onClick={() => {
                                    handleDisableRoom(rowData.id);
                                }}
                            />
                        ) : (
                            <MyButton
                                label='Room'
                                type='enable'
                                onClick={() => {
                                    handleEnableRoom(rowData.id);
                                }}
                            />
                        )}
                    </Stack>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className='flex items-center justify-between'>
                <div className='listings__search-room mb-5 mr-10'>
                    <div className='f1' style={{ marginLeft: "10px" }}>
                        <input
                            type='text'
                            placeholder='id, name, host'
                            id='listings__search-input'
                            value={query}
                            onChange={event => {
                                setQuery(event.currentTarget.value);
                            }}
                        />
                    </div>
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
                                        value='1'
                                    />
                                </div>
                                <div className='normal-flex'>
                                    <div className='mr-10'>
                                        <svg
                                            viewBox='0 0 16 16'
                                            xmlns='http://www.w3.org/2000/svg'
                                            style={{
                                                display: "block",
                                                height: "16px",
                                                width: "16px",
                                                fill: "#008a05",
                                            }}
                                            aria-hidden='true'
                                            role='presentation'
                                            focusable='false'
                                        >
                                            <path d='M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm3.159 4.869L6.67 9.355 4.42 7.105 3.289 8.236 6.67 11.62 12.291 6z'></path>
                                        </svg>
                                    </div>
                                    <div>Available</div>
                                </div>
                            </div>
                            <div
                                className='normal-flex listings__filter-status-row'
                                style={{ marginBottom: "10px" }}
                            >
                                <div style={{ marginRight: "10px" }} className='normal-flex'>
                                    <input
                                        type='checkbox'
                                        className='isCompleteSelected'
                                        value='0'
                                    />
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <img
                                        src={getImage("/svg/reddot.svg")}
                                        width='10px'
                                        height='10px'
                                        className='mr-10'
                                    />
                                    <span>Unavailable</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <Box sx={{ width: 300 }}>
                        <Slider
                            value={price}
                            onChange={handlePriceChange}
                            step={1000000}
                            marks
                            min={0}
                            max={20000000}
                        />
                    </Box>
                    <MyNumberForMat price={price} />
                </div>
                <div className='flex items-center'>
                    <div className='mr-2'>
                        <MyButton
                            type='search'
                            onClick={() => {
                                const statuses = $("input.isCompleteSelected");
                                let isComplete = [];
                                statuses.each(function () {
                                    if ($(this).prop("checked")) {
                                        isComplete.push($(this).val());
                                    }
                                });

                                dispatch(
                                    fetchRooms({
                                        page: page + 1,
                                        query,
                                        price,
                                        roomStatus: isComplete,
                                    })
                                );
                            }}
                        />
                    </div>
                    <MyButton
                        type='clearFilter'
                        onClick={() => {
                            setQuery("");
                            setPrice("");
                            const statuses = $("input.isCompleteSelected");
                            statuses.each(function () {
                                if ($(this).prop("checked")) {
                                    $(this).prop("checked", false);
                                }
                            });

                            dispatch(
                                fetchRooms({
                                    page: 1,
                                    query: "",
                                    price: 0,
                                    roomStatus: "0,1",
                                })
                            );
                        }}
                    />
                </div>
            </div>
            <div>
                <MaterialTable
                    title={
                        <>
                            <div className='h-20 flex items-center'>
                                <div className='mr-5'>
                                    Total Rooms:{" "}
                                    <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                                        {totalRecords}
                                    </span>
                                </div>
                                <Link to={"/add/room"}>
                                    <MyButton type='add' label='Room' />
                                </Link>
                            </div>
                        </>
                    }
                    icons={tableIcons}
                    columns={roomColumns}
                    data={rooms}
                    options={{
                        headerStyle: {
                            borderBottomColor: "red",
                            borderBottomWidth: "3px",
                            fontFamily: "verdana",
                        },
                        actionsColumnIndex: -1,
                        pageSizeOptions: [],
                        pageSize: 10,
                        exportButton: true,
                        search: false,
                    }}
                    components={{
                        Pagination: _ => (
                            <TablePagination
                                onPageChange={handlePageChange}
                                rowsPerPage={10}
                                rowsPerPageOptions={[]}
                                page={page}
                                count={totalRecords}
                            />
                        ),
                    }}
                />
            </div>
        </>
    );
};

export default RoomsPage;
