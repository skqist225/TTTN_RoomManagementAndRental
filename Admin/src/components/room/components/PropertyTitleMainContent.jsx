import React from "react";
import $ from "jquery";
import { FormControl, TextField, Typography } from "@mui/material";

const PropertyTitleMainContent = ({ values, setValues }) => {
    function onKeyDown(event) {
        const currentLength = $("#currentLength");
        const currentValue = parseInt(currentLength.text());
        if (event.key === "Backspace") {
            if (currentValue > 0) currentLength.text(currentValue - 1);
        } else {
            if (currentValue < 50) currentLength.text(currentValue + 1);
        }
    }

    const handleChange = e => {
        setValues({
            ...values,
            name: e.target.value,
        });
    };

    return (
        <div className='flex justify-center'>
            <div className='w-4/6'>
                <Typography component='h1' variant='h4'>
                    Name
                </Typography>

                <div id='numberOfTextPerMaxLength'>
                    <span id='currentLength'>0</span>/50
                </div>
            </div>
        </div>
    );
};

export default PropertyTitleMainContent;
