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

    const [localStreet, setLocalStreet] = useState(values.street);
    const [localCity, setLocalCity] = useState(values.city);
    const [localState, setLocalState] = useState(values.state);

    const { states, loading: statesLoading } = useSelector(stateState);
    const { cities, loading: citiesLoading } = useSelector(cityState);

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

    function useCurrentPosition() {
        setLocalCountry(216);
        setLocalState(120);
        getLocation();

        $(".location__search-location").first().removeClass("input-focus");
        $(".location__location-option-box").first().removeClass("input-focus");
    }

    async function getPositionFromInput(placeToSearch, accessToken) {
        const { data } = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeToSearch}.json?access_token=${accessToken}`
        );

        const position = {
            coords: {
                latitude: data.features[0].center[1],
                longitude: data.features[0].center[0],
            },
        };

        showPosition(position, false, false);
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
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        const userLng2 = position.coords.longitude;
        const userLat2 = position.coords.latitude;

        console.log(userLng2, userLat2);

        if (doReverseSearch) {
            const { data } = await axios.get(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${userLng2},${userLat2}.json?access_token=${accessToken}`
            );

            if (isCallFromUseCurrentLocation) {
                let lStreet = "",
                    lCity = 0,
                    lState = 0;

                data.features[0].context.forEach(({ id, text }) => {
                    if (id.includes("locality")) {
                        lStreet = text;
                        setLocalStreet(lStreet);
                    }

                    if (id.includes("place")) {
                        const filteredCity = cities.filter(city => city.name === text)[0];
                        lCity = filteredCity.id;
                        setLocalCity(lCity);
                    }

                    if (id.includes("region")) {
                        if (text === "HoChiMinhCity" || text === "Ho Chi Minh City") {
                            lState = 120;
                        }
                    }
                });

                setValues({
                    ...values,
                    street: lStreet,
                    city: lCity,
                    state: lState,
                    country: 216,
                });
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

        // const image = document.createElement("img");
        // image.src = getImage(userAvatar);
        // image.setAttribute(
        //     "style",
        //     "width: 40px; height: 40px; border-radius: 50%; object-fit: cover; transform: none !important;"
        // );
        //
        // const marker = new mapboxgl.Marker()
        //     .setLngLat([userLng2 * 1, userLat2 * 1])
        //     .setPopup(
        //         new mapboxgl.Popup({
        //             offset: 25,
        //         })
        //             .setHTML(`<p style="font-size: 22px; margin: 0;">${userName}</p>`)
        //             .setMaxWidth("300px")
        //     )
        //     .addTo(map);
        //
        // const popup = new mapboxgl.Popup({
        //     offset: popupOffsets,
        //     className: "my-class",
        // })
        //     .setLngLat([userLng2, userLat2])
        //     .setHTML(`<p style="font-size: 22px;margin: 0;">${userName}</p>`)
        //     .setMaxWidth("300px")
        //     .addTo(map);

        map.on("click", e => {
            $(".location__search-location").first().removeClass("input-focus");
            $(".location__location-option-box").first().removeClass("input-focus");

            setLatitude(e.lngLat.lat);
            setLongitude(e.lngLat.lng);

            if (marker) marker.remove();
            if (popup) popup.remove();

            const currentPopup = new mapboxgl.Popup({
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

        console.log(isCallFromUseCurrentLocation);

        if (isCallFromUseCurrentLocation) {
            showPosition();
        }
    }

    function showError(error) {}

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

    useEffect(() => {
        if (!citiesLoading) {
            setIsCityLoading(false);
        }
    }, [citiesLoading]);

    const handleUpdateLocation = () => {
        const filteredState = states.filter(state => state.id === localState)[0];
        const filteredCity = cities.filter(city => city.id === localCity)[0];

        setValues({
            ...values,
            street: localStreet,
            city: localCity,
            state: localState,
            country: 216,
        });

        const placeToSearch =
            localStreet + " " + filteredCity.name + " " + filteredState.name + " " + "Vietnam";

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
                                        <MenuItem value={0} disabled={true}>
                                            None
                                        </MenuItem>
                                        {!citiesLoading &&
                                            cities &&
                                            cities.length > 0 &&
                                            cities.map(city => (
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
                                            <MenuItem value={0} disabled={true}>
                                                None
                                            </MenuItem>
                                            {!statesLoading &&
                                                states &&
                                                states.length > 0 &&
                                                states.map(state => (
                                                    <MenuItem value={state.id} key={state.id}>
                                                        {state.name}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                }
                            </div>
                            {/* <div className='mb-5'>
                                <FormControl fullWidth required>
                                    <InputLabel>Country</InputLabel>
                                    <Select
                                        name='country'
                                        value={localCountry}
                                        label='Country'
                                        onChange={e => {
                                            setLocalCountry(e.target.value);
                                        }}
                                    >
                                        <MenuItem value={0} disabled={true}>
                                            None
                                        </MenuItem>
                                        {!countriesLoading &&
                                            countries &&
                                            countries.length > 0 &&
                                            countries.map(country => (
                                                <MenuItem value={country.id} key={country.id}>
                                                    {country.name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </div> */}
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
                        {/* <div className='mt-5 w-full'>
                            <FormControl fullWidth>
                                <MyButton
                                    onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        useCurrentPosition();
                                    }}
                                    type='currentPosition'
                                    label={"Use Current Location"}
                                />
                            </FormControl>
                        </div> */}
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
