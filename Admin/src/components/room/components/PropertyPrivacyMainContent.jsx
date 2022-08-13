import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrivacies, privacyState } from "../../../features/privacy/privacySlice";
import { Div } from "../../../globalStyle";
import $ from "jquery";

import "../css/privacy_main_content.css";

const PropertyPrivacyMainContent = ({ values, setValues, activeStep }) => {
    const {
        listing: { privacies },
    } = useSelector(privacyState);

    const dispatch = useDispatch();
    const { privacyType } = values;

    useEffect(() => {
        const privacyTypeBox = $(".privacy-type__box");

        privacyTypeBox.each(function () {
            $(this)
                .off("click")
                .on("click", function () {
                    privacyTypeBox.each(function () {
                        $(this).removeClass("active");
                    });

                    console.log($(this).data("privacy"));
                    $(this).addClass("active");
                    setValues({ ...values, privacyType: $(this).data("privacy") });
                });
        });
    }, [privacies]);

    useEffect(() => {
        const privacyTypeBox = $(".privacy-type__box");

        if (privacyType) {
            privacyTypeBox.each(function () {
                if ($(this).data("privacy") === privacyType) {
                    $(this).addClass("active");
                } else {
                    $(this).removeClass("active");
                }
            });
        }
    }, [privacies, activeStep]);

    useEffect(() => {
        dispatch(fetchPrivacies());
    }, []);

    return (
        <Div className='col-flex-center'>
            {privacies.map(p => (
                <div className='privacy-type__box' key={p.id} data-privacy={p.id}>
                    <div className='content__box--name'>{p.name}</div>
                </div>
            ))}
        </Div>
    );
};

export default PropertyPrivacyMainContent;
