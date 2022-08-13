import React from "react";
import { FormControl, TextareaAutosize, Typography } from "@mui/material";

const PropertyDescriptionMainContent = ({ values, setValues }) => {
    const handleChange = e => {
        setValues({
            ...values,
            description: e.target.value,
        });
    };

    return (
        <div className='flex justify-center mb-10'>
            <div className='w-4/6'>
                <Typography component='h1' variant='h4'>
                    Description
                </Typography>
                <FormControl fullWidth>
                    <TextareaAutosize
                        aria-label='minimum height'
                        minRows={3}
                        placeholder='Minimum 3 rows'
                        value={values.description}
                        onChange={handleChange}
                    />
                </FormControl>
            </div>
        </div>
    );
};

export default PropertyDescriptionMainContent;
