import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LeftPageContent, RightPageContent } from "../../components/become_a_host";
import PropertyLocationMainContent from "../../components/become_a_host/PropertyLocationMainContent";
import { Div, Image } from "../../globalStyle";
import { callToast, getImage } from "../../helpers";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import $ from "jquery";
import axios from "axios";

import { userState } from "../../features/user/userSlice";

import "./css/location.css";

interface IPropertyLocationPageProps {}

const PropertyLocationPage: FC<IPropertyLocationPageProps> = () => {
    const accessToken =
        "pk.eyJ1IjoibG9yZGVkc3dpZnQyMjUiLCJhIjoiY2t3MDJvZ2E5MDB0dDJxbndxbjZxM20wOCJ9.hYxzgffyfc93Aiogipp5bA";

    mapboxgl.accessToken = accessToken;
    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [lState, setLState] = useState<number>(120);
    const [lCity, setLCity] = useState<number>(0);

    const { user } = useSelector(userState);
    const userName = user?.firstName + " " + user?.lastName;
    const userAvatar = user!.avatarPath;

    useEffect(() => {
        const room = localStorage.getItem("room");
        if (room) {
            const { longitude, latitude, street, city, state } = JSON.parse(room!);

            if (longitude && latitude) {
                showPosition(
                    {
                        coords: {
                            latitude,
                            longitude,
                        },
                    },
                    true
                );
            }
            if (state) {
                setLState(parseInt(state.toString()));
            }
            if (city) {
                setLCity(parseInt(city.toString()));
            }
            if (street) {
                $("#street").val(street);
            }
        }
    }, []);

    function removeVietnameseTones(str: string) {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
    }

    const jQueryCode = () => {
        const locationInputContainer = $(".location__input-container");

        locationInputContainer.each(function () {
            $(this)
                .off("click")
                .on("click", function () {
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

    async function forwardGeocoding(placeToSearch: string) {
        const { data } = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeToSearch}.json?access_token=${accessToken}`
        );

        return data;
    }

    async function getPositionFromInput(placeToSearch: string) {
        console.log("[placeToSearch][VIE]: " + placeToSearch);
        console.log("[placeToSearch][ENG]: " + removeVietnameseTones(placeToSearch));

        const data = await forwardGeocoding(removeVietnameseTones(placeToSearch));

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

    async function showPosition(
        position: {
            coords: {
                latitude: number;
                longitude: number;
            };
        },
        doReverseSearch = true
    ) {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        const lng = position.coords.longitude;
        const lat = position.coords.latitude;

        var map = new mapboxgl.Map({
            container: "location__map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: [lng * 1, lat * 1], // starting position [lng, lat]
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

        const image: HTMLImageElement = document.createElement("img");
        image.src = getImage(userAvatar);
        image.setAttribute("style", "width:40px; height:40px; border-radius:50%;object-fit:cover");

        const marker = new mapboxgl.Marker(image)
            .setPopup(
                new mapboxgl.Popup({
                    offset: popupOffsets as any,
                    className: "my-class",
                }) // add popups
                    .setHTML(`<p style="font-size: 22px;margin: 0;">${userName}</p>`)
                    .setMaxWidth("300px")
            )
            .setLngLat([lng, lat])
            .addTo(map);

        const popup = new mapboxgl.Popup({
            offset: popupOffsets as any,
            className: "my-class",
        })
            .setLngLat([lng, lat])
            .setHTML(`<p style="font-size: 22px;margin: 0;">${userName}</p>`)
            .setMaxWidth("300px")
            .addTo(map);

        let currentPopup = null;

        // map.on("click", async e => {
        //     $(".location__search-location").first().removeClass("input-focus");
        //     $(".location__location-option-box").first().removeClass("input-focus");

        //     setLatitude(e.lngLat.lat);
        //     setLongitude(e.lngLat.lng);

        //     const data = await reverseGeocoding(e.lngLat.lng, e.lngLat.lat);

        //     console.log(data);

        //     if (marker) marker.remove();
        //     if (popup) popup.remove();

        //     currentPopup = new mapboxgl.Popup({
        //         offset: popupOffsets as any,
        //         className: "mapboxgl-popup",
        //     }) // add popups
        //         .setHTML(`<h2>${userName}</h2>`)
        //         .setMaxWidth("300px");

        //     let newMarker = new mapboxgl.Marker(image)
        //         // .setPopup(currentPopup)
        //         .setLngLat([e.lngLat.lng, e.lngLat.lat])
        //         .addTo(map);

        //     showPosition({
        //         coords: {
        //             longitude: e.lngLat.lng,
        //             latitude: e.lngLat.lat,
        //         },
        //     });
        // });

        map.on("data", () => {
            $("#map_loading").css("display", "none");
        });
    }

    function displayEnterLocation() {
        $("#location__enter-address-option").addClass("active");

        $(".location__search-location")
            .first()
            .addClass("non-active")
            .removeClass("active input-focus");

        $(".location__location-option-box").first().removeClass("input-focus");
    }

    function showError(error: any) {}

    useEffect(() => {
        jQueryCode();
    }, []);

    return (
        <Div height='100vh'>
            <Div className='flex'>
                <LeftPageContent
                    background='/images/location.jpg'
                    title='Chỗ ở của bạn nằm ở đâu?'
                />
                <RightPageContent
                    nextPage='room-info'
                    prevPage='privacy'
                    beforeMiddle={
                        <>
                            <div className='location__search-location'>
                                <div className='location__location-option-box'>
                                    <div className='location__location-option-box-first'>
                                        <Image
                                            src={getImage("/svg/location.svg")}
                                            size='32px'
                                            style={{ margin: "12px" }}
                                        />
                                        <button
                                            className='location__enter-address-btn'
                                            onClick={displayEnterLocation}
                                        >
                                            Tự nhập địa chỉ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    MainContent={
                        <PropertyLocationMainContent
                            getPositionFromInput={getPositionFromInput}
                            setLState={setLState}
                            setLCity={setLCity}
                            lCity={lCity}
                            lState={lState}
                        />
                    }
                    stepNumber={3}
                    longitude={longitude}
                    latitude={latitude}
                />
            </Div>
        </Div>
    );
};

export default PropertyLocationPage;
