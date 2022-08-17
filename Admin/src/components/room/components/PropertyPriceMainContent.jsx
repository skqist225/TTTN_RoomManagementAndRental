import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";
import { getImage } from "../../../helpers";
import { Image } from "../../../globalStyle";
import "../css/price_main_content.css";
import { currencyState, fetchCurrencies } from "../../../features/currency/currencySlice";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@material-ui/core";

const PropertyPriceMainContent = ({ currency, setCurrency, currencySymbol, setCurrencySymbol }) => {
    const dispatch = useDispatch();
    const {
        listing: { currencies },
    } = useSelector(currencyState);

    function decreasePrice() {
        const input = $("#room-price");
        const prevStep = parseInt(input.val().replace("₫", "")) || 0;

        if (prevStep >= 129000) {
            input.val("₫" + (prevStep - 129000));
        }

        setValues({
            ...values,
            price: prevStep - 129000,
        });
    }

    function increasePrice() {
        const input = $("#room-price");
        const prevStep = parseInt(input.val().replace("₫", "")) || 0;
        const step = prevStep + 129000;

        input.val("₫" + step);
    }

    useEffect(() => {
        dispatch(fetchCurrencies());
    }, []);

    return (
        <div className='col-flex'>
            <div className='mb-5'>
                <Typography component='h1' variant='h4'>
                    Price
                </Typography>
            </div>
            <FormControl fullWidth>
                <TextField
                    label='Price'
                    value={price}
                    onChange={e => {
                        setName(e.target.value);
                    }}
                />
            </FormControl>
            {/* <div className='flex items-center'>
                <div>
                    <button className='room-price__btn' onClick={decreasePrice}>
                        <span>
                            <Image src={getImage("/svg/minus.svg")} size='12px' />
                        </span>
                    </button>
                </div>
                <div id='priceInputContainer'>
                    <input
                        type='text'
                        id='room-price'
                        pattern='[0-9]*'
                        placeholder='₫00'
                        maxLength={11}
                        minLength={7}
                    />
                </div>
                <div>
                    <button className='room-price__btn' onClick={increasePrice}>
                        <span>
                            <Image src={getImage("/svg/plus.svg")} size='12px' />
                        </span>
                    </button>
                </div>
            </div> */}
            <div style={{ textAlign: "center" }} className='per-night mb-5'>
                per night
            </div>

            <FormControl fullWidth>
                <InputLabel>Currencies</InputLabel>
                <Select
                    id='demo-simple-select'
                    value={currency}
                    label='Currencies'
                    onChange={e => {
                        console.log($("#room-price").attr("placeholder"));
                        if (["₫00", "$00"].includes($("#room-price").attr("placeholder"))) {
                            $("#room-price").attr(
                                "placeholder",
                                `${e.target.value === 1 ? "₫00" : "$00"}`
                            );
                        }
                        setCurrency(e.target.value);
                        console.log(e.target);
                        setCurrencySymbol(e.target.value);
                    }}
                >
                    {currencies.map(currency => (
                        <MenuItem value={currency.id} id={currency.unit}>
                            {currency.symbol} ({currency.unit})
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

export default PropertyPriceMainContent;
