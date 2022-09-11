import React, { useEffect, useState } from "react";
import MaterialTable from "@material-table/core";
import { tableIcons } from "../utils/tableIcon";
import { getImage } from "../helpers";
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
import axios from "../axios";
import { MyButton } from "../components/common";
import callToast from "../helpers/call_toast";
import $ from "jquery";
import Toast from "../components/notify/Toast";

import "../css/page/rooms.css";
import { Image } from "../globalStyle";
import {
    addRule,
    clearDeleteActionState,
    deleteRule,
    fetchRule,
    fetchRules,
    ruleState,
    updateRule,
} from "../features/rule/ruleSlice";

const RulesPage = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);

    let {
        listing: { rules, totalElements, loading },
        addRuleAction: { successMessage },
        fetchRuleAction: { rule },
        updateRuleAction: { successMessage: upaSuccessMessage },
        deleteRuleAction: { successMessage: dpaSuccessMessage, errorMessage },
    } = useSelector(ruleState);

    const roomColumns = [
        {
            title: "Id",
            field: "id",
            render: rowData => <div style={{ maxWidth: "20px" }}>{rowData.id}</div>,
            grouping: false,
        },
        {
            title: "Name",
            field: "title",
        },
        {
            title: "Icon",
            field: "iconPath",
            render: rowData => (
                <div className='normal-flex' style={{ width: "300px" }}>
                    <img src={getImage(rowData.iconPath)} className='image' />
                </div>
            ),
            grouping: false,
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

    useEffect(() => {
        return () => {
            dispatch(clearDeleteActionState());
        };
    }, []);

    const handleSubmit = () => {
        const formData = new FormData();

        if ($("#name").val().length === 0) {
            callToast("error", "Name is required");
            return;
        }
        if (!image) {
            callToast("error", "Image is required");
            return;
        }

        if (editMode) {
            formData.set("id", rule.id);
            formData.set("name", name);
            formData.set("ruleImage", image);
            formData.set("status", true);
            dispatch(updateRule(formData));
        } else {
            formData.set("name", name);
            formData.set("ruleImage", image);
            formData.set("status", true);
            dispatch(addRule(formData));
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
        dispatch(fetchRule(id));
    };

    useEffect(() => {
        if (rule) {
            handleClickOpen();
            setName(rule.title);
            restoreImage("rule_images", rule.icon);
            // setImage(rule.description);
            setEditMode(true);
        }
    }, [rule]);

    const handleDelete = id => {
        dispatch(deleteRule(id));
    };

    useEffect(() => {
        if (upaSuccessMessage) {
            handleClose();
            dispatch(fetchRules(1));
        }
    }, [upaSuccessMessage]);

    const handlePageChange = (e, pn) => {
        dispatch(fetchRules(pn + 1));
        setPage(pn);
    };

    useEffect(() => {
        if (dpaSuccessMessage) {
            callToast("success", dpaSuccessMessage);
            dispatch(fetchRules(1));
        }
    }, [dpaSuccessMessage]);

    useEffect(() => {
        if (errorMessage) {
            callToast("error", errorMessage);
            dispatch(fetchRules(1));
        }
    }, [errorMessage]);

    useEffect(() => {
        if (successMessage) {
            handleClose();
            dispatch(fetchRules(1));
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

    return (
        <>
            <MaterialTable
                title={
                    <div className='flex items-center'>
                        <div className='mr-5'>
                            Total Rules:{" "}
                            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                                {totalElements}
                            </span>
                        </div>
                        <MyButton type='add' label='Rule' onClick={handleClickOpen} />
                        <Dialog open={open} onClose={handleClose} className='w-full'>
                            <DialogTitle>Add Rule</DialogTitle>
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
                                    label='Privacy'
                                    onClick={handleSubmit}
                                />
                            </DialogActions>
                        </Dialog>
                    </div>
                }
                icons={tableIcons}
                columns={roomColumns}
                data={rules}
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

export default RulesPage;
