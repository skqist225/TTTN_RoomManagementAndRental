import React, { useState } from "react";
import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchStatesByCountry } from "../../features/address/stateSlice";
import { fetchCountries } from "../../features/address/countrySlice";
import { fetchCitiesByState } from "../../features/address/citySlice";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

const AddressEdit = ({
    country,
    state,
    city,
    street,
    setCountry,
    setState,
    setCity,
    setStreet,
}) => {
    const dispatch = useDispatch();
    const [countryOptions, setCountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

    useEffect(() => {
        if (country) {
            dispatch(fetchCountries());
        }
    }, [country]);

    useEffect(() => {
        if (country) {
            dispatch(fetchStatesByCountry({ countryId: country }));
        }
    }, [country]);

    useEffect(() => {
        if (state) {
            dispatch(fetchCitiesByState({ stateId: state }));
        }
    }, [state]);

    const { countries } = useSelector(state => state.country);
    const { states } = useSelector(state => state.state);
    const { cities } = useSelector(state => state.city);

    useEffect(() => {
        if (countries) {
            const tempCountries = countries.map(state => ({
                value: state.id.toString(),
                displayText: state.name,
            }));

            setCountryOptions(tempCountries);
        }
    }, [countries]);

    useEffect(() => {
        if (states) {
            const tempStates = states.map(state => ({
                value: state.id.toString(),
                displayText: state.name,
            }));

            setStateOptions(tempStates);
        }
    }, [states]);

    useEffect(() => {
        if (cities) {
            const tempcities = cities.map(city => ({
                value: city.id.toString(),
                displayText: city.name,
            }));

            setCityOptions(tempcities);
        }
    }, [cities]);

    return (
        <div>
            <div className='mb-5'>
                <FormControl fullWidth>
                    <InputLabel>Country/Area</InputLabel>
                    <Select
                        id='countrySelect'
                        value={country}
                        label='Country/Area'
                        name='country'
                        onChange={e => {
                            e.preventDefault();
                            setCountry(e.target.value);
                            dispatch(fetchStatesByCountry({ countryId: e.target.value }));
                        }}
                    >
                        {countryOptions.map(({ value, displayText }) => (
                            <MenuItem value={value} key={value}>
                                {displayText}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <div className='mb-5'>
                <FormControl fullWidth>
                    <InputLabel>State</InputLabel>
                    <Select
                        defaultValue=''
                        value={state}
                        label='State'
                        name='state'
                        onChange={e => {
                            e.preventDefault();
                            setState(e.target.value);
                            dispatch(fetchCitiesByState({ stateId: e.target.value }));
                        }}
                    >
                        {stateOptions.map(({ value, displayText }) => (
                            <MenuItem value={value} key={value}>
                                {displayText}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <div className='mb-5'>
                <FormControl fullWidth>
                    <InputLabel>City</InputLabel>
                    <Select
                        label='City'
                        name='city'
                        value={city}
                        onChange={e => {
                            setCity(e.target.value);
                        }}
                    >
                        {cityOptions.map(({ value, displayText }) => (
                            <MenuItem value={value} key={value}>
                                {displayText}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <div className='mb-5'>
                <FormControl fullWidth>
                    <TextField
                        label='Street'
                        name='street'
                        defaultValue=''
                        value={street}
                        onChange={e => {
                            console.log(street);
                            setStreet(e.target.value);
                        }}
                    />
                </FormControl>
            </div>
        </div>
    );
};

export default AddressEdit;
