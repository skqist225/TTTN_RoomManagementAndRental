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
    fetchUser,
    fetchUsers,
    userState,
} from "../features/user/userSlice";
import { MyButton } from "../components/common";
import Toast from "../components/notify/Toast";

import $ from "jquery";
import "../css/page/rooms.css";

const UsersPage = () => {
    const dispatch = useDispatch();
    const [localQuery, setLocalQuery] = useState("");
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
        dispatch(
            fetchUsers({
                page: pn + 1,
                query: localQuery,
                roles:
                    getSelectedRoles().length > 0
                        ? getSelectedRoles().join(",")
                        : "User,Host,Admin",
                statuses:
                    getSelectedStatuses().length > 0 ? getSelectedStatuses().join(",") : "1,0",
            })
        );
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
                <div style={{ maxWidth: "20px" }}>
                    <div className='normal-flex'>
                        <div className='mr-10'>
                            {rowData.status === true ? (
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
                            ) : (
                                <img
                                    src={getImage("/svg/reddot.svg")}
                                    width='10px'
                                    height='10px'
                                    className='mr-10'
                                />
                            )}
                        </div>
                        <div>{rowData.status === true ? "Enabled" : "Disabled"}</div>
                    </div>
                </div>
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

    function getSelectedRoles() {
        const roles = $("input.isRoleSelected");
        let isComplete = [];
        roles.each(function () {
            if ($(this).prop("checked")) {
                isComplete.push($(this).val());
            }
        });

        return isComplete;
    }

    function getSelectedStatuses() {
        const statuses = $("input.isStatusSelected");
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
            <div className='normal-flex my-5 items-center justify-between'>
                <div className='listings__search-room'>
                    <div className='f1' style={{ marginLeft: "10px" }}>
                        <input
                            type='text'
                            placeholder='id, name, sex'
                            id='listings__search-input'
                            value={localQuery}
                            onChange={event => {
                                setLocalQuery(event.target.value);
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
                                    <input type='checkbox' className='isStatusSelected' value='1' />
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
                                    <div>Enabled</div>
                                </div>
                            </div>
                            <div
                                className='normal-flex listings__filter-status-row'
                                style={{ marginBottom: "10px" }}
                            >
                                <div style={{ marginRight: "10px" }} className='normal-flex'>
                                    <input type='checkbox' className='isStatusSelected' value='0' />
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
                                    <span>Disabled</span>
                                </div>
                            </div>
                        </div>
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
                                        className='isRoleSelected'
                                        value='User'
                                    />
                                </div>{" "}
                                <span>User</span>
                            </div>
                            <div
                                className='normal-flex listings__filter-status-row'
                                style={{ marginBottom: "10px" }}
                            >
                                <div style={{ marginRight: "10px" }} className='normal-flex'>
                                    <input
                                        type='checkbox'
                                        className='isRoleSelected'
                                        value='Host'
                                    />
                                </div>
                                <span>Host</span>
                            </div>
                            <div
                                className='normal-flex listings__filter-status-row'
                                style={{ marginBottom: "10px" }}
                            >
                                <div style={{ marginRight: "10px" }} className='normal-flex'>
                                    <input
                                        type='checkbox'
                                        className='isRoleSelected'
                                        value='Admin'
                                    />
                                </div>
                                <span>Admin</span>
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
                                    fetchUsers({
                                        page: page + 1,
                                        query: localQuery,
                                        roles:
                                            getSelectedRoles().length > 0
                                                ? getSelectedRoles().join(",")
                                                : "User,Host,Admin",
                                        statuses:
                                            getSelectedStatuses().length > 0
                                                ? getSelectedStatuses().join(",")
                                                : "1,0",
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

                            const roles = $("input.isRoleSelected");
                            roles.each(function () {
                                $(this).prop("checked", false);
                            });

                            const statuses = $("input.isStatusSelected");
                            statuses.each(function () {
                                $(this).prop("checked", false);
                            });

                            dispatch(
                                fetchUsers({
                                    page: page + 1,
                                })
                            );
                        }}
                    />
                </div>
            </div>
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
                    search: false,
                    exportButton: true,
                }}
                components={{
                    Pagination: _ => (
                        <TablePagination
                            onPageChange={handlePageChange}
                            rowsPerPage={10}
                            rowsPerPageOptions={[]}
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
