import MaterialTable from "@material-table/core";
import { tableIcons } from "../utils/tableIcon";
import { getImage } from "../helpers";
import MyNumberForMat from "../utils/MyNumberFormat";
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

const AmenitiesPage = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);

    let {
        listing: { amenities, totalElements, loading },
    } = useSelector(state => state.amenity);

    const handleView = () => { };

    const handleEdit = () => { };

    const handleDelete = () => { };

    const handlePageChange = (e, pn) => {
        // dispatch(fetchBookings());
        setPage(pn);
    };

    if (amenities.length) {
        amenities = amenities.map(amenity => ({
            ...amenity,
            amtCategory: amenity.amentityCategory ? amenity.amentityCategory.name : "None",
        }));
    }

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
                    Total Amenities:{" "}
                    <span style={{ fontSize: "18px", fontWeight: "bold" }}>{totalElements}</span>
                </>
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
    );
};

export default AmenitiesPage;
