import { FC, useEffect, useState } from "react";
import { Image } from "../../globalStyle";
import { getImage } from "../../helpers";
import $ from "jquery";
import "./css/price_main_content.css";
import { FormControl, MenuItem, Select } from "@mui/material";
import { InputLabel } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { currencyState, fetchCurrencies } from "../../features/currency/currencySlice";

interface IPropertyPriceMainContentProps {}

const PropertyPriceMainContent: FC<IPropertyPriceMainContentProps> = () => {
    const [currency, setCurrency] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCurrencies());
    }, []);

    const {
        listing: { currencies },
    } = useSelector(currencyState);

    useEffect(() => {
        const lsRoom = localStorage.getItem("room");
        if (lsRoom) {
            const { price, currency: lsCurrency } = JSON.parse(lsRoom);
            if (price) {
                $("#room-price").val(price);
            }

            if (lsCurrency) {
                setCurrency(parseInt(lsCurrency));
            }
        }
    }, []);

    return (
        <div className='col-flex'>
            <div style={{ width: "100%" }}>
                <div id='priceInputContainer' style={{ width: "100%" }}>
                    <input
                        type='number'
                        id='room-price'
                        pattern='[0-9]*'
                        placeholder='00'
                        maxLength={11}
                        minLength={7}
                    />
                </div>
                <div style={{ textAlign: "center" }} className='per-night'>
                    mỗi đêm
                </div>
            </div>
            <div style={{ marginTop: "20px" }}>
                <div className='form-floating' style={{ margin: "16px 0" }}>
                    <select
                        className='form-select'
                        id='room-currency'
                        value={currency}
                        onChange={(e: any) => {
                            setCurrency(e.target.value);
                        }}
                    >
                        {currencies.map((currency: any) => (
                            <option value={currency.id} key={currency.id}>
                                {currency.symbol} ({currency.unit})
                            </option>
                        ))}
                    </select>
                    <label>Tiền tệ</label>
                </div>
            </div>
        </div>
    );
};

export default PropertyPriceMainContent;
