import MaterialTable from "@material-table/core";
import { tableIcons } from "../utils/tableIcon";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TablePagination } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import "../css/page/rooms.css";

const PrivaciesPage = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);

    const {
        listing: { privacies, totalElements, loading },
    } = useSelector(state => state.privacy);

    const handleView = () => { };

    const handleEdit = () => { };

    const handleDelete = () => { };

    const handlePageChange = (e, pn) => {
        setPage(pn);
    };

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
                        <Button variant='contained' onClick={handleEdit}>
                            <EditIcon />
                        </Button>
                        <Button variant='outlined' color='error' onClick={handleDelete}>
                            <DeleteIcon />
                        </Button>
                    </Stack>
                </div>
            ),
        },
    ];

    return (
        <MaterialTable
            title={
                <>
                    Total Room Privacies:{" "}
                    <span style={{ fontSize: "18px", fontWeight: "bold" }}>{totalElements}</span>
                </>
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
                Pagination: props => (
                    <TablePagination
                        {...props}
                    />
                ),
            }}
        />
    );
};

export default PrivaciesPage;
