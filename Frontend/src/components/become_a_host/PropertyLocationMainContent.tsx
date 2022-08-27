import React, { FC, SetStateAction, useEffect, useState } from "react";
import { Div, Image } from "../../globalStyle";
import { callToast, getImage } from "../../helpers";
import { useDispatch, useSelector } from "react-redux";
import { countryState, fetchCountries } from "../../features/country/countrySlice";
import { FloatingLabel, Form } from "react-bootstrap";
import { fetchStatesByCountry, stateState } from "../../features/address/stateSlice";
import { cityState, fetchCities, fetchCitiesByState } from "../../features/address/citySlice";
import $ from "jquery";
import Toast from "../notify/Toast";
import { Dispatch } from "react";

interface IPropertyLocationMainContentProps {
    getPositionFromInput: Function;
    setLCity: Dispatch<SetStateAction<number>>;
    setLState: Dispatch<SetStateAction<number>>;
    lCity: number;
    lState: number;
}

const PropertyLocationMainContent: FC<IPropertyLocationMainContentProps> = ({
    getPositionFromInput,
    setLState,
    setLCity,
    lCity,
    lState,
}) => {
    function backToSearchLocation() {
        $("#location__enter-address-option").removeClass("active");
        $(".location__search-location").first().addClass("active");
    }

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchCountries());
        dispatch(fetchStatesByCountry({ countryId: 216 }));
        dispatch(fetchCitiesByState({ stateId: 120 }));
    }, []);

    useEffect(() => {
        if (lState !== 0) {
            dispatch(fetchCitiesByState({ stateId: lState }));
        }
    }, [lState]);

    const { countries } = useSelector(countryState);
    const { states } = useSelector(stateState);
    const { cities } = useSelector(cityState);

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        console.log(name, value);
        if (name === "state") {
            setLState(parseInt(value));
        } else {
            setLCity(parseInt(value));
        }
    };

    const handleSelectedAddress = (event: any) => {
        event.preventDefault();

        const street = $("#street").val();
        const city = $("#city").val();
        const state = $("#state").val();

        // TODO: Null street value

        if (!street) {
            callToast("error", "Vui lòng chọn số nhà & tên đường");
            return;
        } else if (city === 0) {
            callToast("error", "Vui lòng chọn một thành phố");
            return;
        } else if (state === 0) {
            callToast("error", "Vui lòng chọn một tỉnh/thành phố TW");
            return;
        }

        const selectedState = states.filter(({ id }) => id.toString() === state!.toString())[0];
        const selectedCity = cities.filter(({ id }) => id.toString() === city!.toString())[0];

        const placeToSearch =
            street.toString() +
            " " +
            selectedCity.name.replaceAll("Thành phố", "").trim() +
            " " +
            selectedState.name.replaceAll("Thành phố", "").trim() +
            " " +
            "(Vietnam)";

        $("#map").empty();
        getPositionFromInput(placeToSearch);

        $("#location__enter-address-option").removeClass("active");
        $(".location__search-location").first().addClass("active");
    };

    return (
        <>
            <div id='location__map'></div>
            <div id='location__enter-address-option'>
                <Div padding='28px' className='col-flex'>
                    <div style={{ paddingBottom: "40px" }} className='normal-flex'>
                        <div onClick={backToSearchLocation} style={{ cursor: "pointer" }}>
                            <Image src={getImage("/svg/back.svg")} size='24px' />
                        </div>
                        <div className='location__confirm-address'>Xác nhận địa chỉ của bạn</div>
                    </div>
                    <div id='location__enter-address-option__body'>
                        <FloatingLabel label='Đường/Phố' className='mb-3'>
                            <Form.Control type='text' id='street' placeholder='placeholder' />
                        </FloatingLabel>

                        <div className='form-floating' style={{ margin: "16px 0" }}>
                            <select
                                className='form-select'
                                id='city'
                                name='city'
                                value={lCity}
                                onChange={handleChange}
                            >
                                {cities.map(city => (
                                    <option value={city.id} key={city.id}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                            <label>Thành phố/Quận/Huyện</label>
                        </div>

                        <div className='form-floating' style={{ margin: "16px 0" }}>
                            <select
                                className='form-select'
                                name='state'
                                id='state'
                                value={lState}
                                onChange={handleChange}
                            >
                                {states.map(state => (
                                    <option value={state.id} key={state.id}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                            <label>Tỉnh/Thành phố TW</label>
                        </div>

                        <div className='form-floating' style={{ margin: "16px 0" }}>
                            <select className='form-select' id='country' value={216}>
                                {countries.map(country => (
                                    <option value={country.id} key={country.id}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                            <label>Quốc gia</label>
                        </div>
                    </div>

                    <div style={{ paddingTop: "40px" }}>
                        <button
                            className='location__btn-complete-address'
                            id='location__btn-complete-address-id'
                            onClick={handleSelectedAddress}
                        >
                            Trông ổn rồi
                        </button>
                    </div>
                </Div>
            </div>
            <Toast />
        </>
    );
};

export default PropertyLocationMainContent;
