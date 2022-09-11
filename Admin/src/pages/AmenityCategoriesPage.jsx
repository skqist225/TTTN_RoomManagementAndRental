import React, { useEffect, useState } from "react";
import MaterialTable from "@material-table/core";
import { tableIcons } from "../utils/tableIcon";
import Stack from "@mui/material/Stack";
import { useDispatch, useSelector } from "react-redux";

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
import callToast from "../helpers/call_toast";
import $ from "jquery";
import Toast from "../components/notify/Toast";

import "../css/page/rooms.css";
import {
    addAmenityCategory,
    clearDeleteAmenityCategoryActionState,
    deleteAmenityCategory,
    fetchAmenityCategories,
    fetchAmenityCategory,
    updateAmenityCategory,
} from "../features/amenity/amenitySlice";

const AmenityCategoriesPage = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    let {
        addAmenityAction: { successMessage },
        fetchAmenityCategoryAction: { amenityCategory },
        fetchAmenityCategoriesAction: { amenityCategories, totalElements },
        updateAmenityCategoryAction: { successMessage: upaSuccessMessage },
        deleteAmenityCategoryAction: { successMessage: dpaSuccessMessage, errorMessage },
        addAmenityCategoryAction: { errorMessage: aacErrorMessage },
    } = useSelector(state => state.amenity);

    const roomColumns = [
        {
            title: "Id",
            field: "id",
            render: rowData => <div style={{ maxWidth: "20px" }}>{rowData.id}</div>,
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
            grouping: false,
        },
    ];

    const handleClickOpen = () => {
        setOpen(true);
        turnOffEditMode();
    };

    const handleSubmit = () => {
        if ($("#name").val().length === 0) {
            callToast("error", "Name is required");
            return;
        }

        console.log(name, description);

        if (editMode) {
            dispatch(
                updateAmenityCategory({
                    id: amenityCategory.id,
                    name,
                    description,
                })
            );
        } else {
            dispatch(addAmenityCategory({ name, description }));
        }
    };

    useEffect(() => {
        if (aacErrorMessage) {
            callToast("error", aacErrorMessage);
        }
    }, [aacErrorMessage]);

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
        dispatch(fetchAmenityCategory(id));
    };

    useEffect(() => {
        if (amenityCategory) {
            handleClickOpen();
            setName(amenityCategory.name);
            setDescription(amenityCategory.description);
            setEditMode(true);
        }
    }, [amenityCategory]);

    const handleDelete = id => {
        dispatch(deleteAmenityCategory(id));
    };

    useEffect(() => {
        if (upaSuccessMessage) {
            handleClose();
            dispatch(fetchAmenityCategories(1));
        }
    }, [upaSuccessMessage]);

    const handlePageChange = (e, pn) => {
        dispatch(fetchAmenityCategories(pn + 1));
        setPage(pn);
    };

    useEffect(() => {
        if (dpaSuccessMessage) {
            callToast("success", dpaSuccessMessage);
            dispatch(fetchAmenityCategories(1));
        }
    }, [dpaSuccessMessage]);

    useEffect(() => {
        if (errorMessage) {
            callToast("error", errorMessage);
            dispatch(fetchAmenityCategories(1));
        }
    }, [errorMessage]);

    useEffect(() => {
        if (successMessage) {
            handleClose();
            dispatch(fetchAmenityCategories(1));
        }
    }, [successMessage]);

    useEffect(() => {
        return () => {
            dispatch(clearDeleteAmenityCategoryActionState());
        };
    }, []);

    return (
        <>
            <MaterialTable
                title={
                    <div className='flex items-center'>
                        <div className='mr-5'>
                            Total Amenity Categories:{" "}
                            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                                {amenityCategories.length}
                            </span>
                        </div>
                        <MyButton type='add' label='Amenity Category' onClick={handleClickOpen} />
                        <Dialog open={open} onClose={handleClose} className='w-full'>
                            <DialogTitle>{editMode ? "Edit" : "Add"} Amenity Category</DialogTitle>
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
                            <DialogContent className='h-20'>
                                <TextField
                                    autoFocus
                                    margin='dense'
                                    id='description'
                                    label='Description'
                                    fullWidth
                                    variant='outlined'
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </DialogContent>
                            <DialogActions>
                                <MyButton type='cancel' onClick={handleClose} />
                                <MyButton
                                    type={editMode ? "update" : "add"}
                                    label='Amenity Category'
                                    onClick={handleSubmit}
                                />
                            </DialogActions>
                        </Dialog>
                    </div>
                }
                icons={tableIcons}
                columns={roomColumns}
                data={amenityCategories}
                options={{
                    headerStyle: {
                        borderBottomColor: "red",
                        borderBottomWidth: "3px",
                        fontFamily: "verdana",
                    },
                    actionsColumnIndex: -1,
                    pageSizeOptions: [10, 15],
                    pageSize: 10,
                }}
                components={{
                    Pagination: props => <TablePagination {...props} />,
                }}
            />
            <Toast />
        </>
    );
};

export default AmenityCategoriesPage;
