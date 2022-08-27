import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAmenities, fetchAmenitiesCategory } from "../../features/amenity/amenitySlice";
import { Div } from "../../globalStyle";
import { RootState } from "../../store";
import IAmenity from "../../types/type_Amenity";
import AmenitiyPartial from "./AmenitiyPartial";
import $ from "jquery";

import "./css/amenities_main_content.css";
import { InputLabel, ListSubheader, MenuItem, Select } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";

interface IPropertyAmenitiesMainContentProps {}

const PropertyAmenitiesMainContent: FC<IPropertyAmenitiesMainContentProps> = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAmenities());
        dispatch(fetchAmenitiesCategory());
    }, []);

    const { amenities: lAmenities, amenityCategory } = useSelector(
        (state: RootState) => state.amenity
    );

    useEffect(() => {
        const amenitiesClass = $(".amentitiesClassName");

        if (localStorage.getItem("room")) {
            const { amenities } = JSON.parse(localStorage.getItem("room")!);

            if (amenities && amenities.length > 0) {
                amenitiesClass.each(function () {
                    if (
                        amenities.includes(
                            parseInt($(this).children("input").first().val()!.toString())
                        )
                    ) {
                        $(this).addClass("chosen");
                    }
                });
            }
        }

        amenitiesClass.each(function () {
            $(this)
                .off("click")
                .on("click", function () {
                    const self = $(this);
                    const amenityName = $(this).children(".amentity__name").text();
                    let isRemovedClassName = false;

                    const chosenArray = amenitiesClass.filter(".chosen");

                    if (chosenArray.length > 0) {
                        amenitiesClass.filter(".chosen").each(function () {
                            if (amenityName === $(this).children(".amentity__name").text()) {
                                self.removeClass("chosen");
                                isRemovedClassName = true;
                            }
                        });
                    }

                    if (!isRemovedClassName) {
                        $(this).addClass("chosen");
                    }
                });
        });
    }, [lAmenities]);

    return <AmenitiyPartial amenities={lAmenities} />;
};

export default PropertyAmenitiesMainContent;
