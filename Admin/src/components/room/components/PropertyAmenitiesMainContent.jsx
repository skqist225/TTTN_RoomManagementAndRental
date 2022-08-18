import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { amenityState, fetchAmenities} from "../../../features/amenity/amenitySlice";
import { Div } from "../../../globalStyle";
import AmenitiyPartial from "./AmenitiyPartial";
import $ from "jquery";
import { Button, ButtonGroup, Typography } from "@mui/material";

import "../css/amenities_main_content.css";

const PropertyAmenitiesMainContent = ({ values, setValues }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAmenities(1));
    }, []);

    const {
        listing: { amenities },
    } = useSelector(amenityState);

    const prominentAmentities = amenities.filter(a => a.prominent);
    const favoriteAmentities = amenities.filter(a => a.favorite);
    const safeAmentities = amenities.filter(a => a.safe);

    console.log(values);

    useEffect(() => {
        const prominentAmentities2 = $(".prominentAmentities");
        const favoriteAmentities2 = $(".favoriteAmentities");
        const safeAmentities2 = $(".safeAmentities");

        if (values.amenities) {
            const { prominentAmentity, favoriteAmentity, safeAmentity } = values.amenities;

            console.log(prominentAmentity, favoriteAmentity, safeAmentity);

            prominentAmentities2.each(function () {
                if ($(this).children("input").first().val() == prominentAmentity) {
                    $(this).addClass("choosen");
                    return false;
                }
            });

            favoriteAmentities2.each(function () {
                if ($(this).children("input").first().val() == favoriteAmentity) {
                    $(this).addClass("choosen");
                    return false;
                }
            });

            safeAmentities2.each(function () {
                if ($(this).children("input").first().val() == safeAmentity) {
                    $(this).addClass("choosen");
                    return false;
                }
            });
        }

        prominentAmentities2.each(function () {
            $(this)
                .off("click")
                .on("click", function () {
                    if (
                        prominentAmentities2.filter(".choosen").length &&
                        prominentAmentities2.filter(".choosen").data("id") === $(this).data("id")
                    ) {
                        $(this).removeClass("choosen");
                    } else {
                        prominentAmentities2.each(function () {
                            $(this).removeClass("choosen");
                        });
                        $(this).addClass("choosen");
                        setValues({
                            ...values,
                            amenities: {
                                ...values.amenities,
                                prominentAmentity: $(this).data("id"),
                            },
                        });
                    }
                });
        });

        favoriteAmentities2.each(function () {
            $(this)
                .off("click")
                .on("click", function () {
                    if (
                        favoriteAmentities2.filter(".choosen").length &&
                        favoriteAmentities2.filter(".choosen").data("id") === $(this).data("id")
                    ) {
                        $(this).removeClass("choosen");
                    } else {
                        favoriteAmentities2.each(function () {
                            $(this).removeClass("choosen");
                        });
                        $(this).addClass("choosen");
                        setValues({
                            ...values,
                            amenities: {
                                ...values.amenities,
                                favoriteAmentity: $(this).data("id"),
                            },
                        });
                    }
                });
        });

        safeAmentities2.each(function () {
            $(this)
                .off("click")
                .on("click", function () {
                    if (
                        safeAmentities2.filter(".choosen").length &&
                        safeAmentities2.filter(".choosen").data("id") === $(this).data("id")
                    ) {
                        $(this).removeClass("choosen");
                    } else {
                        safeAmentities2.each(function () {
                            $(this).removeClass("choosen");
                        });

                        $(this).addClass("choosen");

                        setValues({
                            ...values,
                            amenities: {
                                ...values.amenities,
                                safeAmentity: $(this).data("id"),
                            },
                        });
                    }
                });
        });
    }, [amenities, values, setValues]);

    const handleRandomPick = () => {
        const prominentAmentities2 = $(".prominentAmentities");
        const favoriteAmentities2 = $(".favoriteAmentities");
        const safeAmentities2 = $(".safeAmentities");

        handleDeselectAll(true);

        let random1 = Math.floor(Math.random() * (prominentAmentities.length - 1));
        prominentAmentities2.each(function (index) {
            if (index === random1) {
                $(this).addClass("choosen");
            }
        });

        const random2 = Math.floor(Math.random() * (favoriteAmentities.length - 1));
        favoriteAmentities2.each(function (index) {
            if (index === random2) {
                $(this).addClass("choosen");
            }
        });

        const random3 = Math.floor(Math.random() * (safeAmentities.length - 1));
        safeAmentities2.each(function (index) {
            if (index === random3) {
                $(this).addClass("choosen");
            }
        });

        setValues({
            ...values,
            amenities: {
                prominentAmentity: prominentAmentities[random1]["id"],
                favoriteAmentity: favoriteAmentities[random2]["id"],
                safeAmentity: safeAmentities[random3]["id"],
            },
        });
    };

    const handleDeselectAll = (callFromRandomPick = false) => {
        const prominentAmentities2 = $(".prominentAmentities");
        const favoriteAmentities2 = $(".favoriteAmentities");
        const safeAmentities2 = $(".safeAmentities");

        prominentAmentities2.each(function () {
            $(this).removeClass("choosen");
        });

        favoriteAmentities2.each(function () {
            $(this).removeClass("choosen");
        });

        safeAmentities2.each(function () {
            $(this).removeClass("choosen");
        });

        // if (!callFromRandomPick) {
        //     console.log("true");
        setValues({
            ...values,
            amenities: {
                prominentAmentity: null,
                favoriteAmentity: null,
                safeAmentity: null,
            },
        });
        // }
    };

    return (
        <>
            {" "}
            <Div className='col-flex h-full'>
                <div className='flex items-center h-3/6 flex-1'>
                    <Div className='col-flex flex-1 w-50'>
                        <Typography className='amentities__title my-5' variant='h6' component='h2'>
                            Prominent Amenities
                        </Typography>
                        <div>
                            <AmenitiyPartial
                                amenities={prominentAmentities}
                                className='prominentAmentities'
                            />
                        </div>
                    </Div>
                    <Div className='col-flex flex-1 w-50'>
                        <Typography className='amentities__title my-5' variant='h6' component='h2'>
                            Favorite Amenities
                        </Typography>
                        <div>
                            <AmenitiyPartial
                                amenities={favoriteAmentities}
                                className='favoriteAmentities'
                            />
                        </div>
                    </Div>
                </div>
                <Div className='col-flex h-3/6 flex-1'>
                    <div className='w-3/6'>
                        <Typography className='amentities__title my-5' variant='h6' component='h2'>
                            Safe Amenities
                        </Typography>
                        <div>
                            <AmenitiyPartial
                                amenities={safeAmentities}
                                className='safeAmentities'
                            />
                        </div>
                    </div>
                </Div>
                <Div className='flex justify-center items-end'>
                    <ButtonGroup
                        variant='outlined'
                        aria-label='outlined primary button group'
                        size='large'
                        className='mr-5'
                    >
                        <Button onClick={handleRandomPick}>Random Pick</Button>
                        <Button onClick={handleDeselectAll}>Deselect All</Button>
                    </ButtonGroup>
                </Div>
            </Div>
        </>
    );
};

export default PropertyAmenitiesMainContent;
