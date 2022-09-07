import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { countryState, fetchCountries } from "../../../features/address/countrySlice";
import { Div } from "../../../globalStyle";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import { userState } from "../../../features/user/userSlice";
import $ from "jquery";
import {
    Divider,
    FormControl,
    FormLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@material-ui/core";
import { fetchStatesByCountry, stateState } from "../../../features/address/stateSlice";
import { cityState, fetchCities, fetchCitiesByState } from "../../../features/address/citySlice";
import { MyButton } from "../../common";
// import { getImage } from "../../../helpers";

const accessToken =
    "pk.eyJ1IjoibG9yZGVkc3dpZnQyMjUiLCJhIjoiY2t3MDJvZ2E5MDB0dDJxbndxbjZxM20wOCJ9.hYxzgffyfc93Aiogipp5bA";

const PropertyLocationMainContent = ({
    values,
    setValues,
    setLatitude,
    setLongitude,
    latitude,
    longitude,
}) => {
    mapboxgl.accessToken = accessToken;

    const dispatch = useDispatch();

    const [localStreet, setLocalStreet] = useState("");
    const [localCity, setLocalCity] = useState(0);
    const [localState, setLocalState] = useState(120);

    const { states } = useSelector(stateState);
    const { cities } = useSelector(cityState);

    useEffect(() => {
        if (values) {
            const { street, city, state } = values;
            if (street) {
                setLocalStreet(street);
            }
            if (city) {
                setLocalCity(city);
            }
            if (state) {
                setLocalState(state);
            }
        }
    }, []);

    useEffect(() => {
        console.log(latitude, longitude);
        if (latitude !== 0 && longitude !== 0) {
            const position = {
                coords: {
                    latitude,
                    longitude,
                },
            };

            showPosition(position, true, false);
        }
    }, []);

    const { user } = useSelector(userState);
    const userName = user?.firstName + " " + user?.lastName;
    const userAvatar = user.avatarPath;

    const jQueryCode = () => {
        const locationInputContainer = $(".location__input-container");

        locationInputContainer.each(function () {
            $(this).on("click", function () {
                locationInputContainer.each(function () {
                    if ($(this).hasClass("focus")) {
                        $(this).removeClass("focus");
                        const input = $(this).children().last().children("input");
                        if (!input.val()) {
                            $(this).children().first().removeClass("focus");

                            input.removeClass("focus");
                        }
                    }
                });

                $(this).children().first().addClass("focus");
                $(this).children().last().children("input").addClass("focus");
                $(this).addClass("focus");
            });
        });
    };

    function removeVietnameseTones(str) {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
    }

    async function getPositionFromInput(placeToSearch, accessToken) {
        const { data } = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${removeVietnameseTones(
                placeToSearch
            )}.json?access_token=${accessToken}`
        );

        const position = {
            coords: {
                latitude: data.features[0].center[1],
                longitude: data.features[0].center[0],
            },
        };

        showPosition(position, false);
        $(".location__search-location").first().removeClass("input-focus");
        $(".location__location-option-box").first().removeClass("input-focus");
    }

    async function showPosition(position, doReverseSearch = true) {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        const userLng2 = position.coords.longitude;
        const userLat2 = position.coords.latitude;

        if (doReverseSearch) {
            const { data } = await axios.get(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${userLng2},${userLat2}.json?access_token=${accessToken}`
            );
        }

        $("#map").empty();

        var map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: [userLng2 * 1, userLat2 * 1], // starting position [lng, lat]
            zoom: 13, // starting zoom
        });

        const markerHeight = 50;
        const markerRadius = 10;
        const linearOffset = 25;
        const popupOffsets = {
            top: [0, 0],
            "top-left": [0, 0],
            "top-right": [0, 0],
            bottom: [0, -markerHeight],
            "bottom-left": [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
            "bottom-right": [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
            left: [markerRadius, (markerHeight - markerRadius) * -1],
            right: [-markerRadius, (markerHeight - markerRadius) * -1],
        };

        const image = document.createElement("img");
        image.src = getImage(userAvatar);
        image.setAttribute(
            "style",
            "width: 40px; height: 40px; border-radius: 50%; object-fit: cover; transform: none !important;"
        );

        const marker = new mapboxgl.Marker()
            .setLngLat([userLng2 * 1, userLat2 * 1])
            .setPopup(
                new mapboxgl.Popup({
                    offset: 25,
                })
                    .setHTML(`<p style="font-size: 22px; margin: 0;">${userName}</p>`)
                    .setMaxWidth("300px")
            )
            .addTo(map);

        const popup = new mapboxgl.Popup({
            offset: popupOffsets,
            className: "my-class",
        })
            .setLngLat([userLng2, userLat2])
            .setHTML(`<p style="font-size: 22px;margin: 0;">${userName}</p>`)
            .setMaxWidth("300px")
            .addTo(map);
    }

    useEffect(() => {
        jQueryCode();
    }, []);

    useEffect(() => {
        dispatch(fetchStatesByCountry({ countryId: 216 }));
        dispatch(fetchCitiesByState({ stateId: 120 }));
    }, []);

    useEffect(() => {
        if (localState !== 0) {
            dispatch(fetchCitiesByState({ stateId: localState }));
        }
    }, [localState]);

    const handleUpdateLocation = () => {
        const selectedCity = cities.filter(city => city.id === localCity)[0];
        const selectedState = states.filter(state => state.id === localState)[0];

        setValues({
            ...values,
            street: localStreet,
            city: localCity,
        });

        const placeToSearch =
            localStreet +
            " " +
            selectedCity.name.replaceAll("Thành phố", "").trim() +
            " " +
            selectedState.name.replaceAll("Thành phố", "").trim() +
            " " +
            "(Vietnam)";

        console.log("[Use Enter Location]: " + placeToSearch);

        getPositionFromInput(placeToSearch, accessToken);
    };

    return (
        <>
            <div className='flex'>
                <div className='flex-1 w-30'>
                    <Div padding='28px' className='col-flex items-center justify-center'>
                        <div id='location__enter-address-option__body' className='w-96'>
                            <div className='mb-5'>
                                <FormControl fullWidth required>
                                    <FormLabel>Street</FormLabel>
                                    <TextField
                                        name='street'
                                        id='aprtNoAndStreet'
                                        value={localStreet}
                                        onChange={e => {
                                            setLocalStreet(e.target.value);
                                        }}
                                        defaultValue=''
                                    />
                                </FormControl>
                            </div>

                            <div className='mb-5'>
                                <FormControl fullWidth required>
                                    <InputLabel>City</InputLabel>
                                    <Select
                                        name='city'
                                        value={localCity}
                                        label='City'
                                        onChange={e => {
                                            setLocalCity(e.target.value);
                                        }}
                                    >
                                        {cities.map(city => (
                                            <MenuItem value={city.id} key={city.id}>
                                                {city.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className='mb-5'>
                                {
                                    <FormControl fullWidth required>
                                        <InputLabel>State</InputLabel>
                                        <Select
                                            name='state'
                                            value={localState}
                                            label='State'
                                            onChange={e => {
                                                setLocalState(e.target.value);
                                            }}
                                        >
                                            {states.map(state => (
                                                <MenuItem value={state.id} key={state.id}>
                                                    {state.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                }
                            </div>
                            <div>
                                <FormControl fullWidth>
                                    <MyButton
                                        type='lookGood'
                                        label={"Use Entered Location"}
                                        onClick={handleUpdateLocation}
                                    ></MyButton>
                                </FormControl>
                            </div>
                        </div>
                    </Div>
                </div>
                <Divider orientation='vertical' flexItem />

                <div
                    id='map'
                    style={{
                        height: "500px",
                        width: "100%",
                    }}
                ></div>
            </div>
        </>
    );
};

export default PropertyLocationMainContent;
