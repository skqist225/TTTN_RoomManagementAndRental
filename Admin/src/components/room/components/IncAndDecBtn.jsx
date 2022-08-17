import React, { useEffect } from "react";
import $ from "jquery";

const IncAndDecBtn = ({ dataEdit, dataTrigger, info, data = 0 }) => {
    useEffect(() => {
        if (info) {
            // console.log()
            switch (dataEdit) {
                case "guestNumber": {
                    if (info.accomodatesCount) {
                        $("#" + dataEdit).text(info.accomodatesCount);
                    }
                    break;
                }
                case "bathRoomNumber": {
                    if (info.bathroomCount) {
                        $("#" + dataEdit).text(info.bathroomCount);
                    }
                    break;
                }
                case "bedNumber": {
                    if (info.bedroomCount) {
                        $("#" + dataEdit).text(info.bedroomCount);
                    }
                    break;
                }
                case "bedRoomNumber": {
                    if (info.bedCount) {
                        $("#" + dataEdit).text(info.bedCount);
                    }
                    break;
                }
            }
        }
    }, [info]);

    $(".incAndDecBtn").each(function () {
        $(this)
            .off("click")
            .on("click", function () {
                const spanInfoTag = $(this).siblings(`#${$(this).data("edit")}`);
                let spanValue = parseInt(spanInfoTag.text());
                const dataFunction = $(this).data("function");
                let deleteButton;
                if (dataTrigger) deleteButton = $(".deleteBtn." + $(this).data("trigger"));
                const self = $(this);

                if (dataFunction === "dec") {
                    if (spanValue > 0) {
                        if (spanValue === 1) $(this).attr("disabled", "true");
                        spanInfoTag.text(--spanValue);
                    }
                    let countZero = 0;
                    if (spanValue === 0)
                        $(".listings__minus-btn").each(function () {
                            if (!$(this).is(self)) {
                                const spanValue = parseInt(
                                    $(this)
                                        .siblings(`#${$(this).data("edit")}`)
                                        .text()
                                );
                                if (spanValue === 0) countZero++;
                            }
                        });

                    if (countZero === $(".listings__minus-btn").length - 1)
                        if (dataTrigger) deleteButton.attr("disabled", "true");
                }

                if (dataFunction === "inc") {
                    if (spanValue === 0)
                        $(this)
                            .siblings(`.listings__minus-btn.incAndDecBtn`)
                            .removeAttr("disabled");
                    spanInfoTag.text(++spanValue);

                    if (spanValue > 0) if (dataTrigger) deleteButton.removeAttr("disabled");
                }
            });
    });

    return (
        <>
            <div>
                <button
                    className='listings__minus-btn incAndDecBtn'
                    data-function='dec'
                    data-edit={dataEdit}
                    data-trigger={dataTrigger}
                >
                    <span>
                        <svg
                            viewBox='0 0 32 32'
                            xmlns='http://www.w3.org/2000/svg'
                            aria-hidden='true'
                            role='presentation'
                            focusable='false'
                            style={{
                                display: "block",
                                fill: "none",
                                height: "12px",
                                width: "12px",
                                stroke: "currentcolor",
                                strokeWidth: "5.33333",
                                overflow: "visible",
                            }}
                        >
                            <path d='m2 16h28'></path>
                        </svg>
                    </span>
                </button>
                <span id={dataEdit} className='filter-count'>
                    {data}
                </span>
                <button
                    className='listings__plus-btn incAndDecBtn'
                    data-function='inc'
                    data-edit={dataEdit}
                    data-trigger={dataTrigger}
                >
                    <span>
                        <svg
                            viewBox='0 0 32 32'
                            xmlns='http://www.w3.org/2000/svg'
                            aria-hidden='true'
                            role='presentation'
                            focusable='false'
                            style={{
                                display: "block",
                                fill: "none",
                                height: "12px",
                                width: "12px",
                                stroke: "currentcolor",
                                strokeWidth: "5.33333",
                                overflow: "visible",
                            }}
                        >
                            <path d='m2 16h28m-14-14v28'></path>
                        </svg>
                    </span>
                </button>
            </div>
        </>
    );
};

export default IncAndDecBtn;
