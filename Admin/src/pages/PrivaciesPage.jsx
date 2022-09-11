import React, { useEffect, useState } from "react";
import MaterialTable from "@material-table/core";
import { tableIcons } from "../utils/tableIcon";
import Stack from "@mui/material/Stack";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TablePagination,
    TextField,
} from "@material-ui/core";
import { MyButton } from "../components/common";
import { useDispatch, useSelector } from "react-redux";
import callToast from "../helpers/call_toast";
import Toast from "../components/notify/Toast";

import "../css/page/rooms.css";
import {
    addRoomPrivacy,
    clearDeleteActionState,
    deletePrivacy,
    fetchPrivacies,
    fetchPrivacy,
    privacyState,
    updatePrivacy,
} from "../features/privacy/privacySlice";

const PrivaciesPage = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [editMode, setEditMode] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const {
        listing: { privacies, totalElements, loading },
        addPrivacyAction: { successMessage },
        fetchPrivacyAction: { privacy },
        updatePrivacyAction: { successMessage: upaSuccessMessage },
        deletePrivacyAction: { successMessage: dpaSuccessMessage, errorMessage },
    } = useSelector(privacyState);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleSubmit = () => {
        if (editMode) {
            dispatch(
                updatePrivacy({
                    privacyId: privacy.id,
                    updateData: {
                        name,
                        description,
                    },
                })
            );
        } else {
            dispatch(
                addRoomPrivacy({
                    name,
                    description,
                })
            );
        }
    };

    const handleClose = () => {
        setOpen(false);
        if (editMode === true) {
            turnOffEditMode();
        }
    };

    function turnOffEditMode() {
        setName("");
        setDescription("");
        setEditMode(false);
    }

    const handleEdit = id => {
        dispatch(fetchPrivacy(id));
    };

    useEffect(() => {
        if (privacy) {
            handleClickOpen();
            setName(privacy.name);
            setDescription(privacy.description);
            setEditMode(true);
        }
    }, [privacy]);

    const handleDelete = id => {
        dispatch(deletePrivacy(id));
    };

    useEffect(() => {
        if (upaSuccessMessage) {
            handleClose();
            dispatch(fetchPrivacies(1));
        }
    }, [upaSuccessMessage]);

    const handlePageChange = (e, pn) => {
        dispatch(fetchPrivacies(pn + 1));
        setPage(pn);
    };

    useEffect(() => {
        if (dpaSuccessMessage) {
            callToast("success", dpaSuccessMessage);
            dispatch(fetchPrivacies(1));
        }
    }, [dpaSuccessMessage]);

    useEffect(() => {
        if (errorMessage) {
            callToast("error", errorMessage);
            dispatch(fetchPrivacies(1));
        }
    }, [errorMessage]);

    useEffect(() => {
        return () => {
            dispatch(clearDeleteActionState());
        };
    }, []);

    const roomColumns = [
        {
            title: "Id",
            field: "id",
        },
        {
            title: "Name",
            field: "name",
        },
        {
            title: "Description",
            field: "description",
        },
        {
            title: "",
            field: "",
            render: rowData => (
                <div>
                    <Stack spacing={2} direction='row'>
                        <MyButton
                            label='Privacy'
                            type='edit'
                            onClick={() => {
                                handleEdit(rowData.id);
                            }}
                        />

                        <MyButton
                            label='Privacy'
                            type='delete'
                            onClick={() => {
                                handleDelete(rowData.id);
                            }}
                        />
                    </Stack>
                </div>
            ),
        },
    ];

    useEffect(() => {
        if (successMessage) {
            handleClose();
            dispatch(fetchPrivacies(1));
        }
    }, [successMessage]);

    return (
        <>
            <MaterialTable
                title={
                    <div className='flex items-center'>
                        <div className='mr-5'>
                            Total Room Privacies:{" "}
                            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                                {totalElements}
                            </span>
                        </div>
                        <MyButton type='add' label='Privacy' onClick={handleClickOpen} />
                        <Dialog open={open} onClose={handleClose} className='w-full'>
                            <DialogTitle>Add Privacy</DialogTitle>
                            <DialogContentText style={{ width: "500px" }}></DialogContentText>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin='dense'
                                    id='name'
                                    label='Name'
                                    fullWidth
                                    variant='outlined'
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </DialogContent>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin='dense'
                                    id='description'
                                    label='Description'
                                    fullWidth
                                    variant='outlined'
                                    required
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </DialogContent>
                            <DialogActions>
                                <MyButton type='cancel' onClick={handleClose} />
                                <MyButton
                                    type={editMode ? "update" : "add"}
                                    label='Privacy'
                                    onClick={handleSubmit}
                                />
                            </DialogActions>
                        </Dialog>
                    </div>
                }
                icons={tableIcons}
                columns={roomColumns}
                data={privacies}
                options={{
                    headerStyle: {
                        borderBottomColor: "red",
                        borderBottomWidth: "3px",
                        fontFamily: "verdana",
                    },
                    actionsColumnIndex: -1,
                    pageSizeOptions: [12],
                    pageSize: 10,
                    exportButton: true,
                }}
                components={{
                    Pagination: props => <TablePagination {...props} />,
                }}
            />
            <Toast />
        </>
    );
};

export default PrivaciesPage;
