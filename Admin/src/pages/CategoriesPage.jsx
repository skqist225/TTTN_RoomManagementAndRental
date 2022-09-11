import React, { useEffect } from "react";
import MaterialTable from "@material-table/core";
import { tableIcons } from "../utils/tableIcon";
import { callToast, getImage } from "../helpers";
import Stack from "@mui/material/Stack";
import { TablePagination } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "../axios";

import { Image } from "../globalStyle";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from "@material-ui/core";
import { MyButton } from "../components/common";
import $ from "jquery";

import "../css/page/rooms.css";
import {
    addCategory,
    clearDeleteActionState,
    deleteCategory,
    fetchCategories,
    fetchCategory,
    updateCategory,
} from "../features/category/categorySlice";
import Toast from "../components/notify/Toast";

const CategoriesPage = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);

    const {
        listing: { categories, totalElements, loading },
        addCategoryAction: { successMessage },
        fetchCategoryAction: { category },
        updateCategoryAction: { successMessage: upaSuccessMessage },
        deleteCategoryAction: { successMessage: dpaSuccessMessage, errorMessage },
    } = useSelector(state => state.category);

    const handleClickOpen = () => {
        setOpen(true);
    };

    async function restoreImage(folderName, imageName) {
        const formData = new FormData();
        formData.set("folderName", folderName);
        formData.set("iconName", imageName);

        const data = await axios.post(`/become-a-host/get-upload-icons`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        const filesArr = data.roomImages.map(e => {
            var array = new Uint8Array(e.bytes);
            const blob = new Blob([array], { type: "image/jpeg" });
            return new File([blob], e.name, {
                type: `image/jpeg`,
            });
        });

        if (filesArr[0].name.includes("svg")) {
            $("#previewImage").attr("src", `http://localhost:8080/rule_images/${imageName}`);
        } else {
            showPreviewImage(filesArr);
        }
    }

    const handleSubmit = () => {
        const formData = new FormData();
        console.log("here");

        if ($("#name").val().length === 0) {
            console.log("case1");
            callToast("error", "Name is required");
            return;
        }
        if (!image && !editMode) {
            console.log("case2");
            callToast("error", "Image is required");
            return;
        }
        console.log(editMode);

        if (editMode) {
            formData.set("id", category.id);
            formData.set("name", name);
            formData.set("fileImage", image);
            formData.set("status", true);
            dispatch(updateCategory(formData));
        } else {
            formData.set("name", name);
            formData.set("fileImage", image);
            formData.set("status", true);
            dispatch(addCategory(formData));
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
        setImage(null);
        setEditMode(false);
    }

    const handleEdit = id => {
        dispatch(fetchCategory(id));
    };

    useEffect(() => {
        if (category) {
            handleClickOpen();
            setName(category.name);
            restoreImage("category_images", category.iconPath.split("/").pop());
            setEditMode(true);
        }
    }, [category]);

    const handleDelete = id => {
        dispatch(deleteCategory(id));
    };

    useEffect(() => {
        if (upaSuccessMessage) {
            handleClose();
            dispatch(fetchCategories(1));
        }
    }, [upaSuccessMessage]);

    const handlePageChange = (e, pn) => {
        dispatch(fetchCategories(pn + 1));
        setPage(pn);
    };

    useEffect(() => {
        if (dpaSuccessMessage) {
            callToast("success", dpaSuccessMessage);
            dispatch(fetchCategories(1));
        }
    }, [dpaSuccessMessage]);

    useEffect(() => {
        if (errorMessage) {
            callToast("error", errorMessage);
            dispatch(fetchCategories(1));
        }
    }, [errorMessage]);

    useEffect(() => {
        if (successMessage) {
            handleClose();
            dispatch(fetchCategories(1));
        }
    }, [successMessage]);

    function showPreviewImage(file) {
        file = file[0];

        const fileReader = new FileReader();
        fileReader.onload = function (e) {
            $("#previewImage").attr("src", e.target.result);
        };
        fileReader.readAsDataURL(file);
    }

    const handleImageChange = e => {
        const file = e.target.files[0];
        showPreviewImage(e.target.files);
        setImage(file);
    };

    useEffect(() => {
        return () => {
            dispatch(clearDeleteActionState());
        };
    }, []);

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
            title: "Icon",
            render: rowData => (
                <div className='normal-flex' style={{ width: "300px" }}>
                    <img src={getImage(rowData.icon)} className='image' />
                </div>
            ),
            sortable: false,
        },
        {
            title: "",
            field: "",
            render: rowData => (
                <div>
                    <Stack spacing={2} direction='row'>
                        <MyButton
                            label='Category'
                            type='edit'
                            onClick={() => {
                                handleEdit(rowData.id);
                            }}
                        />

                        <MyButton
                            label='Category'
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

    return (
        <>
            <MaterialTable
                title={
                    <div className='flex items-center'>
                        <div className='mr-5'>
                            Total Categories:{" "}
                            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                                {totalElements}
                            </span>
                        </div>
                        <MyButton type='add' label='Category' onClick={handleClickOpen} />
                        <Dialog open={open} onClose={handleClose} className='w-full'>
                            <DialogTitle>{!editMode ? "Add" : "Edit"} Category</DialogTitle>
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
                                <div className='flex items-center w-full h-full justify-between'>
                                    <Image size='150px' id='previewImage' />
                                </div>
                            </DialogContent>
                            <DialogContent className='h-20'>
                                <input type='file' name='image' onChange={handleImageChange} />
                            </DialogContent>
                            <DialogActions>
                                <MyButton type='cancel' onClick={handleClose} />
                                <MyButton
                                    type={editMode ? "update" : "add"}
                                    label='Category'
                                    onClick={handleSubmit}
                                />
                            </DialogActions>
                        </Dialog>
                    </div>
                }
                icons={tableIcons}
                columns={roomColumns}
                data={categories}
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

export default CategoriesPage;
