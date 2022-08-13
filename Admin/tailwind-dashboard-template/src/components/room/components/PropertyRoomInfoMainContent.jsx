import React from "react";
import { useEffect } from "react";
import IncAndDecBtn from "./IncAndDecBtn";
import $ from "jquery";
import "../css/room_info_main_content.css";

const PropertyRoomInfoMainContent = ({ values, setValues }) => {
    useEffect(() => {
        if (localStorage.getItem("room")) {
            const { guestNumber, bedNumber, bedRoomNumber, bathRoomNumber } = JSON.parse(
                localStorage.getItem("room")
            );

            $("#guestNumber").text(guestNumber);
            $("#bedNumber").text(bedNumber);
            $("#bedRoomNumber").text(bedRoomNumber);
            $("#bathRoomNumber").text(bathRoomNumber);
        }
        $(".incAndDecBtn").each(function () {
            $(this).on("click", function () {
                const spanInfoTag = $(this).siblings(`#${$(this).data("edit")}`);
                let spanValue = parseInt(spanInfoTag.text());
                const dataFunction = $(this).data("function");

                if (dataFunction === "dec") {
                    if (spanValue > 0) {
                        if (spanValue === 1) $(this).attr("disabled", "true");

                        spanInfoTag.html(--spanValue + "");
                    }
                }

                if (dataFunction === "inc") {
                    if (spanValue === 0)
                        $(this)
                            .siblings(`#${$(this).data("edit")}DecBtn`)
                            .removeAttr("disabled");
                    spanInfoTag.html(++spanValue + "");
                }
            });
        });
    }, []);

    return (
        <div className='col-flex'>
            <div className='flex-space mb-4'>
                <div className='room-info__info-title'>Guest</div>
                <IncAndDecBtn dataEdit='guestNumber' dataTrigger='guestNumber' />
            </div>
            <div className='flex-space mb-4'>
                <div className='room-info__info-title'>Bed</div>
                <IncAndDecBtn dataEdit='bedNumber' dataTrigger='bedNumber' />
            </div>
            <div className='flex-space mb-4'>
                <div className='room-info__info-title'>Bedroom</div>
                <IncAndDecBtn dataEdit='bedRoomNumber' dataTrigger='bedRoomNumber' />
            </div>
            <div className='flex-space mb-4'>
                <div className='room-info__info-title'>Bathroom</div>
                <IncAndDecBtn dataEdit='bathRoomNumber' dataTrigger='bathRoomNumber' />
            </div>
        </div>
    );
};

export default PropertyRoomInfoMainContent;
