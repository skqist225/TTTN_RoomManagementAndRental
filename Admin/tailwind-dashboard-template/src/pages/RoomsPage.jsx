import MaterialTable from "@material-table/core";
import { tableIcons } from "../utils/tableIcon";
import { getImage } from "../helpers";
import MyNumberForMat from "../utils/MyNumberFormat";
import Stack from "@mui/material/Stack";
import TablePagination from "@material-ui/core/TablePagination";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRooms } from "../features/room/roomSlice";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@material-ui/core";
import { MyButton } from "../components/common";

import "../css/page/rooms.css";

const RoomsPage = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);

    const {
        hosting: { rooms, totalRecords, totalPages, loading },
    } = useSelector(state => state.room);

    const handleView = () => {};

    const handleEdit = () => {};

    const handleDelete = () => {};

    const handlePageChange = (e, pn) => {
        dispatch(fetchRooms(pn + 1));
        setPage(pn);
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
                <div className='normal-flex' style={{ width: "300px" }}>
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
            render: rowData => <MyNumberForMat currency={rowData.currency} price={rowData.price} />,
        },
        {
            title: "Location",
            field: "location",
            render: rowData => (
                <div
                    style={{ maxWidth: "200px" }}
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
                        <Link to={`/rooms/${rowData.id}`}>
                            <MyButton type='view' />
                        </Link>
                        <Link to={`/rooms/${rowData.id}/edit`}>
                            <MyButton type='edit' />
                        </Link>
                        <MyButton type='delete' onClick={handleDelete} />
                    </Stack>
                </div>
            ),
        },
    ];

    return (
        <>
            <MaterialTable
                title={
                    <>
                        <div className='h-20 flex items-center'>
                            <div className='mr-5'>
                                Total Records:{" "}
                                <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                                    {totalRecords}
                                </span>
                            </div>
                            <Link to={"/add/room"}>
                                <Fab variant='extended' color='primary' aria-label='add'>
                                    <AddIcon sx={{ mr: 1 }} />
                                    Add Room
                                </Fab>
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
                    pageSizeOptions: [10],
                    pageSize: 10,
                    exportButton: true,
                }}
                components={{
                    Pagination: _ => (
                        <TablePagination
                            onPageChange={handlePageChange}
                            rowsPerPage={10}
                            page={page}
                            count={totalRecords}
                        />
                    ),
                }}
            />
        </>
    );
};

export default RoomsPage;
