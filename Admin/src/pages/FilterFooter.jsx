import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import $ from "jquery";
import "./css/filter_footer.css";
import { bookingState, fetchAdminUserBookings } from "../features/booking/bookingSlice";

const FilterFooter = ({ footerOf }) => {
    const dispatch = useDispatch();

    const { fetchData } = useSelector(bookingState);

    function closeFilterBox(footerClass) {
        $(`#listings__filter-${footerClass}`).removeClass("active");
    }

    function setCurrentFilterTitle(className, title) {
        $(`.listings__filter--option.${className}`).text(title);
    }

    useEffect(() => {
        $(".applyBtn").each(function () {
            $(this)
                .off("click")
                .on("click", function () {
                    const dataModify = $(this).data("modify");

                    switch (dataModify) {
                        case "findByMonthAndYear": {
                            const month = $("#bookingDateMonthInput").val().toString();
                            const year = $("#bookingDateYearInput").val().toString();
                            dispatch(
                                fetchAdminUserBookings({
                                    ...fetchData,
                                    bookingDateMonth: month,
                                    bookingDateYear: year,
                                })
                            );
                            break;
                        }

                        case "bookingStatus": {
                            const statuses = $("input.isCompleteSelected");
                            let isComplete = [];
                            statuses.each(function () {
                                if ($(this).prop("checked")) {
                                    isComplete.push($(this).val().toString());
                                }
                            });

                            if (isComplete.length > 0) {
                                dispatch(
                                    fetchAdminUserBookings({
                                        ...fetchData,
                                        isComplete: isComplete.join(","),
                                    })
                                );
                            }

                            break;
                        }
                    }

                    closeFilterBox(dataModify);
                });
        });
    }, []);

    $(".deleteBtn").each(function () {
        $(this)
            .off("click")
            .on("click", function () {
                const dataModify = $(this).data("modify");

                switch (dataModify) {
                    case "status": {
                        let statuses = [];
                        $(".statusSelected").each(function () {
                            if ($(this).children("span").hasClass("ant-checkbox-checked")) {
                                statuses.push($(this).children().children().val().toString());
                            }
                        });

                        break;
                    }
                    case "findByMonthAndYear": {
                        dispatch(setBookingDateMonth(""));
                        dispatch(setBookingDateYear(""));
                        break;
                    }
                    case "bookingDate": {
                        $("#bookingDateInput").val("");
                        $(".listings__filter--option.bookingDate").text("Ngày đặt phòng");
                        dispatch(setBookingDate(""));
                        break;
                    }
                    case "bookingStatus": {
                        dispatch(setIsComplete("APPROVED,PENDING,CANCELLED"));
                        break;
                    }
                    case "totalFee": {
                        dispatch(setTotalFee(0));
                        break;
                    }
                }

                $(this).attr("disabled", "true");
            });
    });

    return (
        <div className='filter--footer__container'>
            <div className='flex'>
                <div>
                    <button
                        className={"filter--footer__transparentBtn deleteBtn " + footerOf}
                        data-modify={footerOf}
                        disabled
                    >
                        Xóa
                    </button>
                </div>
                <div>
                    <button
                        className={"filter--footer__applyBtn applyBtn " + footerOf}
                        data-modify={footerOf}
                    >
                        Áp dụng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterFooter;
