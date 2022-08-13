import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { countryState, fetchCountries } from "../../../features/address/countrySlice";
import { Div } from "../../../globalStyle";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import { userState } from "../../../features/user/userSlice";
import {
    Button,
    Divider,
    FormControl,
    FormLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import $ from "jquery";
import { getImage } from "../../../helpers";
import { useForm } from "react-hook-form";

const accessToken =
    "pk.eyJ1IjoibG9yZGVkc3dpZnQyMjUiLCJhIjoiY2t3MDJvZ2E5MDB0dDJxbndxbjZxM20wOCJ9.hYxzgffyfc93Aiogipp5bA";

const PropertyLocationMainContent = ({ values, setValues, activeStep }) => {
    mapboxgl.accessToken = accessToken;
    const [userLat, setUserLat] = useState(0);
    const [userLng, setUserLng] = useState(0);
    const [placeName, setPlaceName] = useState("");
    const [isMapHide, setIsMapHide] = useState(true);

    const { user } = useSelector(userState);
    const userName = user?.firstName + " " + user?.lastName;
    const userAvatar = user.avatarPath;

    const { street, city, state, country } = values;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        console.log(values);
        if (street) {
            $("#aprtNoAndStreet").val(street);
        }

        if (city) {
            $("#city").val(city);
        }

        if (state) {
            $("#state").val(state);
        }

        if (country) {
            $("#country").val(country);
        }

        const placeToSearch = street + " " + city + " " + state + " " + country;
        $("#map").empty();
        getPositionFromInput(placeToSearch, accessToken);
    }, [activeStep]);

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

    function useCurrentPosition() {
        getLocation();
        $(".location__search-location").first().removeClass("input-focus");
        $(".location__location-option-box").first().removeClass("input-focus");
    }

    async function getPositionFromInput(placeToSearch, accessToken) {
        console.log(placeToSearch);
        const { data } = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeToSearch}.json?access_token=${accessToken}`
        );

        setPlaceName(data.features[0].place_name);

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

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    showPosition(position, true, true);
                },
                showError,
                {
                    timeout: 10000,
                }
            );
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    async function showPosition(
        position,
        doReverseSearch = true,
        isCallFromUseCurrentLocation = false
    ) {
        setUserLat(position.coords.latitude);
        setUserLng(position.coords.longitude);

        const userLng2 = position.coords.longitude;
        const userLat2 = position.coords.latitude;

        console.log(userLng2, userLat2);

        if (doReverseSearch) {
            const { data } = await axios.get(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${userLng2},${userLat2}.json?access_token=${accessToken}`
            );

            if (data) setPlaceName(data.features[0].place_name);

            if (isCallFromUseCurrentLocation) {
                let lCity = "",
                    lState = "",
                    lStreet = "";

                data.features[0].context.forEach(({ id, text }) => {
                    console.log(id);
                    if (id.includes("locality")) {
                        lStreet = text;
                        $("#aprtNoAndStreet").val(text);
                    }
                    if (id.includes("place")) {
                        lCity = text;
                        $("#city").val(text);
                    }
                    if (id.includes("region")) {
                        lState = text;
                        $("#state").val(text);
                    }
                });

                setValues({ ...values, street: lStreet, city: lCity, state: lState });
            }
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

        map.on("click", e => {
            $(".location__search-location").first().removeClass("input-focus");
            $(".location__location-option-box").first().removeClass("input-focus");

            setUserLat(e.lngLat.lat);
            setUserLng(e.lngLat.lng);

            if (marker) marker.remove();
            if (popup) popup.remove();

            currentPopup = new mapboxgl.Popup({
                offset: popupOffsets,
                className: "mapboxgl-popup",
            }) // add popups
                .setHTML(`<h2>${userName}</h2>`)
                .setMaxWidth("300px");

            let newMarker = new mapboxgl.Marker(image)
                // .setPopup(currentPopup)
                .setLngLat([e.lngLat.lng, e.lngLat.lat])
                .addTo(map);

            showPosition({
                coords: {
                    longitude: e.lngLat.lng,
                    latitude: e.lngLat.lat,
                },
            });
        });

        map.on("drag", () => {
            console.log("A drag event occurred.");
        });

        map.on("data", () => {
            $("#map_loading").css("display", "none");
        });
    }

    function showError(error) {}

    useEffect(() => {
        jQueryCode();
    }, []);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchCountries());
    }, []);

    const {
        listing: { countries },
    } = useSelector(countryState);

    const onSubmit = data => {
        const { street: dStreet, city: dCity, state: dState, country: dCountry } = data;
        setValues({ ...values, street: dStreet, city: dCity, state: dState, country: dCountry });

        const placeToSearch = street + " " + city + " " + state + " " + country;
        $("#map").empty();
        getPositionFromInput(placeToSearch, accessToken);
        setIsMapHide(false);
    };

    return (
        <>
            <div className='flex'>
                <div className='flex-1 w-30'>
                    <Div padding='28px' className='col-flex items-center justify-center'>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                handleSubmit(onSubmit)(e);
                            }}
                        >
                            <div id='location__enter-address-option__body' className='w-96'>
                                <div className='mb-5'>
                                    <FormControl fullWidth>
                                        <FormLabel>Street</FormLabel>
                                        <TextField
                                            name='street'
                                            id='aprtNoAndStreet'
                                            {...register("street")}
                                            defaultValue=''
                                            required
                                        />
                                    </FormControl>
                                </div>

                                <div className='mb-5'>
                                    <FormControl fullWidth>
                                        <FormLabel>City</FormLabel>
                                        <TextField
                                            name='city'
                                            id='city'
                                            {...register("city")}
                                            defaultValue=''
                                            required
                                        />
                                    </FormControl>
                                </div>
                                <div className='mb-5'>
                                    <FormControl fullWidth>
                                        <FormLabel>State</FormLabel>
                                        <TextField
                                            name='state'
                                            id='state'
                                            {...register("state")}
                                            defaultValue=''
                                            required
                                        />
                                    </FormControl>
                                </div>
                                <div className='mb-5'>
                                    <FormControl fullWidth>
                                        <InputLabel>Country</InputLabel>
                                        <Select
                                            value={"Vietnam"}
                                            label='Country'
                                            name='country'
                                            id='country'
                                            {...register("country")}
                                        >
                                            {countries.map(c => (
                                                <MenuItem value={c.name} key={c.id}>
                                                    {c.name} {c.code}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                <div>
                                    <div className='mb-5'>
                                        <FormControl fullWidth>
                                            <Button
                                                variant='outlined'
                                                onClick={() => {
                                                    useCurrentPosition();
                                                    setIsMapHide(false);
                                                }}
                                                type='button'
                                            >
                                                Use Current Location
                                            </Button>
                                        </FormControl>
                                    </div>
                                    <FormControl fullWidth>
                                        <Button variant='outlined' type='submit'>
                                            Look Good
                                        </Button>
                                    </FormControl>
                                </div>
                            </div>
                        </form>
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
