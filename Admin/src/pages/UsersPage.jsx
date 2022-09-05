import MaterialTable from "@material-table/core";
import { tableIcons } from "../utils/tableIcon";
import { callToast, getImage } from "../helpers";
import Stack from "@mui/material/Stack";
import TablePagination from "@material-ui/core/TablePagination";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
    clearUserState,
    disableUser,
    enableUser,
    fetchUsers,
    userState,
} from "../features/user/userSlice";
import { MyButton } from "../components/common";
import Toast from "../components/notify/Toast";

import "../css/page/rooms.css";

const UsersPage = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);

    const {
        listing: { users, totalElements, totalPages, loading },
        deleteUserAction: { successMessage, errorMessage },
    } = useSelector(userState);

    const handleDisableUser = id => {
        dispatch(disableUser(id));
    };

    const handleEnableUser = id => {
        dispatch(enableUser(id));
    };

    const handlePageChange = (e, pn) => {
        dispatch(fetchUsers(pn + 1));
        setPage(pn);
    };

    useEffect(() => {
        dispatch(clearUserState());
    }, []);

    useEffect(() => {
        if (successMessage) {
            callToast("success", successMessage);
            dispatch(fetchUsers(page + 1));
        }
    }, [successMessage]);

    useEffect(() => {
        if (errorMessage) {
            callToast("error", errorMessage);
        }
    }, [errorMessage]);

    const roomColumns = [
        {
            title: "Id",
            field: "id",
            render: rowData => <div style={{ maxWidth: "20px" }}>{rowData.id}</div>,
        },
        {
            title: "Full Name",
            field: "fullName",
            render: rowData => (
                <div className='normal-flex' style={{ width: "300px" }}>
                    <img src={getImage(rowData.avatar)} className='image' />
                    <span className='listings__room-name'>{rowData.fullName}</span>
                </div>
            ),
        },
        {
            title: "Status",
            field: "status",
            render: rowData => (
                <div style={{ maxWidth: "20px" }}>{rowData.status ? "Enable" : "Disabled"}</div>
            ),
        },
        {
            title: "Sex",
            field: "sex",
        },
        {
            title: "Birthday",
            field: "birthday",
        },
        {
            title: "Role",
            field: "role",
        },
        {
            title: "Action",
            field: "action",
            render: rowData => (
                <div>
                    <Stack spacing={2} direction='row'>
                        <Link to={`/edit/user/${rowData.id}`}>
                            <MyButton label='User' type='edit' />
                        </Link>

                        {rowData.status ? (
                            <MyButton
                                label='User'
                                type='disable'
                                onClick={() => {
                                    handleDisableUser(rowData.id);
                                }}
                            />
                        ) : (
                            <MyButton
                                label='User'
                                type='enable'
                                onClick={() => {
                                    handleEnableUser(rowData.id);
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
            <MaterialTable
                title={
                    <div className='h-20 flex items-center'>
                        <div className='mr-5'>
                            Total Records:{" "}
                            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                                {totalElements}
                            </span>
                        </div>
                        <Link to={`/add/user`}>
                            <MyButton label='User' type='add' />
                        </Link>
                    </div>
                }
                icons={tableIcons}
                columns={roomColumns}
                data={users}
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
                            count={totalElements}
                        />
                    ),
                }}
            />
            <Toast />
        </>
    );
};

export default UsersPage;
