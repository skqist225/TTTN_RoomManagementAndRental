import MaterialTable from "@material-table/core";
import { tableIcons } from "../utils/tableIcon";
import { getImage } from "../helpers";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import { TablePagination } from "@material-ui/core";
import "../css/page/rooms.css";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Image } from "../globalStyle";

const RulesPage = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);

    let {
        listing: { rules, totalElements, loading },
    } = useSelector(state => state.rule);

    const handleView = () => { };

    const handleEdit = () => { };

    const handleDelete = () => { };

    const handlePageChange = (e, pn) => {
        // dispatch(fetchBookings());
        setPage(pn);
    };


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
                        <Button variant='contained' onClick={handleEdit}>
                            <EditIcon />
                        </Button>
                        <Button variant='outlined' color='error' onClick={handleDelete}>
                            <DeleteIcon />
                        </Button>
                    </Stack>
                </div>
            ),
            grouping: false,
        },
    ];

    return (
        <MaterialTable
            title={
                <>
                    Total Rules:{" "}
                    <span style={{ fontSize: "18px", fontWeight: "bold" }}>{totalElements}</span>
                </>
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
    );
};

export default RulesPage;
