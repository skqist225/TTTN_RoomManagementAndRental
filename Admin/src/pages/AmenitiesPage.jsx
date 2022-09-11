import React, { useEffect, useState } from "react";
import MaterialTable from "@material-table/core";
import { tableIcons } from "../utils/tableIcon";
import { getImage } from "../helpers";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "../css/page/rooms.css";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "../globalStyle";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    MenuItem,
    Select,
    TablePagination,
    TextField,
} from "@material-ui/core";
import $ from "jquery";
import Toast from "../components/notify/Toast";
import callToast from "../helpers/call_toast";
import axios from "../axios";
import { MyButton } from "../components/common";
import {
    addAmenity,
    clearDeleteAmenityActionState,
    deleteAmenity,
    fetchAmenities,
    updateAmenity,
} from "../features/amenity/amenitySlice";

const AmenitiesPage = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [amtCategory, setAmtCateogry] = React.useState(0);
    const [image, setImage] = useState(null);

    let {
        listing: { amenities, totalElements, loading },
        addAmenityAction: { successMessage, errorMessage: aaAErrorMessage },
        fetchAmenityAction: { amenity },
        fetchAmenityCategoriesAction: { amenityCategories },
        updateAmenityAction: { successMessage: upaSuccessMessage },
        deleteAmenityAction: { successMessage: dpaSuccessMessage, errorMessage },
    } = useSelector(state => state.amenity);

    if (amenities.length) {
        amenities = amenities.map(amenity => ({
            ...amenity,
            amtCategory: amenity.amentityCategory ? amenity.amentityCategory.name : "None",
        }));
    }

    useEffect(() => {
        return () => {
            dispatch(clearDeleteAmenityActionState());
        };
    }, []);

    const roomColumns = [
        {
            title: "Id",
            field: "id",
            render: rowData => <div style={{ maxWidth: "20px" }}>{rowData.id}</div>,
            grouping: false,
        },
        {
            title: "Name",
            field: "name",
        },
        {
            title: "Icon",
            field: "iconImagePath",
            render: rowData => (
                <div className='normal-flex' style={{ width: "300px" }}>
                    <img src={getImage(rowData.iconImagePath)} className='image' />
                </div>
            ),
            grouping: false,
        },
        {
            title: "Description",
            field: "description",
            grouping: false,
        },
        {
            title: "Category",
            field: "amtCategory",
            defaultGroupOrder: 0,
        },
        {
            title: "",
            field: "",
            render: rowData => (
                <div>
                    <Stack spacing={2} direction='row'>
                        <MyButton
                            label='Amenity'
                            type='edit'
                            onClick={() => {
                                handleEdit(rowData.id);
                            }}
                        />

                        <MyButton
                            label='Amenity'
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
            $("#previewImage").attr("src", `http://localhost:8080/Amenity_images/${imageName}`);
        } else {
            showPreviewImage(filesArr);
        }
    }

    const handleSubmit = () => {
        const formData = new FormData();

        if ($("#name").val().length === 0) {
            callToast("error", "Name is required");
            return;
        }
        if (!description) {
            callToast("error", "Description is required");
            return;
        }

        if (editMode) {
            formData.set("id", Amenity.id);
            formData.set("name", name);
            formData.set("AmenityImage", image);
            formData.set("status", true);
            dispatch(updateAmenity(formData));
        } else {
            formData.set("name", name);
            if (image) {
                formData.set("iconImage", image);
            }

            formData.set("status", true);

            if (amtCategory) {
                formData.set("amenityCategoryId", amtCategory);
            }

            dispatch(addAmenity(formData));
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
        dispatch(fetchAmenities(id));
    };

    useEffect(() => {
        if (amenity) {
            handleClickOpen();
            setName(amenity.title);
            restoreImage("amenity_images", amenity.icon);
            // setImage(amenity.description);
            setEditMode(true);
        }
    }, [amenity]);

    const handleDelete = id => {
        dispatch(deleteAmenity(id));
    };

    useEffect(() => {
        if (upaSuccessMessage) {
            handleClose();
            dispatch(fetchAmenities(1));
        }
    }, [upaSuccessMessage]);

    const handlePageChange = (e, pn) => {
        dispatch(fetchAmenities(pn + 1));
        setPage(pn);
    };

    useEffect(() => {
        if (dpaSuccessMessage) {
            callToast("success", dpaSuccessMessage);
            dispatch(fetchAmenities(1));
        }
    }, [dpaSuccessMessage]);

    useEffect(() => {
        if (errorMessage) {
            callToast("error", errorMessage);
            dispatch(fetchAmenities(1));
        }
    }, [errorMessage]);

    useEffect(() => {
        if (successMessage) {
            handleClose();
            dispatch(fetchAmenities(1));
        }
    }, [successMessage]);

    useEffect(() => {
        if (aaAErrorMessage) {
            callToast("error", aaAErrorMessage);
        }
    }, [aaAErrorMessage]);

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

    return (
        <>
            <MaterialTable
                title={
                    <div className='flex items-center'>
                        <div className='mr-5'>
                            Total Amenities:{" "}
                            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                                {totalElements}
                            </span>
                        </div>
                        <MyButton type='add' label='Amenity' onClick={handleClickOpen} />
                        <Dialog open={open} onClose={handleClose} className='w-full'>
                            <DialogTitle>Add Amenity</DialogTitle>
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
                                <FormControl fullWidth>
                                    <Select
                                        value={amtCategory}
                                        label='Category'
                                        onChange={e => {
                                            setAmtCateogry(e.target.value);
                                        }}
                                    >
                                        {amenityCategories.map(category => (
                                            <MenuItem value={category.id} id={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
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
                                    label='Amenity'
                                    onClick={handleSubmit}
                                />
                            </DialogActions>
                        </Dialog>
                    </div>
                }
                icons={tableIcons}
                columns={roomColumns}
                data={amenities}
                options={{
                    headerStyle: {
                        borderBottomColor: "red",
                        borderBottomWidth: "3px",
                        fontFamily: "verdana",
                    },
                    actionsColumnIndex: -1,
                    pageSizeOptions: [10, 15],
                    pageSize: 10,
                    exportButton: true,
                    grouping: true,
                }}
                components={{
                    Pagination: props => <TablePagination {...props} />,
                }}
            />
            <Toast />
        </>
    );
};

export default AmenitiesPage;
