import React from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";

import BookingTable from "../components/booking/BookingTable";

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const BookingsPage = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
                    <Tab label='All' {...a11yProps(0)} />
                    <Tab label='Approved' {...a11yProps(1)} />
                    <Tab label='Pending' {...a11yProps(1)} />
                    <Tab label='Cancelled' {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <BookingTable type='ALL' />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <BookingTable type='APPROVED' />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <BookingTable type='PENDING' />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <BookingTable type='CANCELLED' />
            </TabPanel>
        </>
    );
};

export default BookingsPage;
