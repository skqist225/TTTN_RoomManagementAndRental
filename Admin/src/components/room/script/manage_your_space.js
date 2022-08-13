import React from "react";
import Keyframes from "@keyframes/core";

import $ from "jquery";

export function initComp(room, amenities) {
    const status = room?.status;
    const safeAmentitiesID = amenities.filter(a => a.safe).map(({ id }) => id);
    const favoriteAmentitiesID = amenities.filter(a => a.favorite).map(({ id }) => id);
    const prominentAmentitiesID = amenities.filter(a => a.prominent).map(({ id }) => id);

    $("#descriptionCounter").text($("#descriptionInput").val().length);
    $("#roomNameCounter").text($("#roomNameInput").val().length);

    $(".radioStatus").each(function () {
        if ($(this).attr("id") === `roomStatus${status ? 1 : 0}`) {
            $(this).prop("checked", true);
            return false;
        }
    });

    $(".manage-ys__changeView").each(function () {
        $(this)
            .off("click")
            .on("click", function () {
                const dataScroll = $(this).data("scroll");
                const offsetTop = $(dataScroll).offset().top - 80;
                $(document).off("scroll");
                window.scrollTo({
                    top: offsetTop,
                    behavior: "smooth",
                });

                animate($(this));
            });
    });

    const roomImagesTopValue = getOffsetTop("#roomImages");
    const basicRoomInfosTopValue = getOffsetTop("#basicRoomInfos");
    const roomAmentitiesTopValue = getOffsetTop("#roomAmentities");
    const roomLocationTopValue = getOffsetTop("#roomLocation");
    const roomInfoTopValue = getOffsetTop("#roomInfo");

    let anchorRoomImages = $('a[data-scroll="#roomImages"]');
    let anchorBasicRoomInfos = $('a[data-scroll="#basicRoomInfos"]');
    let anchorRoomAmentities = $('a[data-scroll="#roomAmentities"]');
    let anchorRoomLocation = $('a[data-scroll="#roomLocation"]');
    let anchorRoomInfo = $('a[data-scroll="#roomInfo"]');

    function addScrollEventForDocument() {
        const topValue = $(document).scrollTop();

        if (topValue <= roomImagesTopValue) {
            if ($(".manage--ys__scrolling--menu").first().hasClass("active"))
                $(".manage--ys__scrolling--menu").first().removeClass("active");
        } else if (topValue > roomImagesTopValue && topValue < basicRoomInfosTopValue) {
            animate(anchorRoomImages);
        } else if (topValue >= basicRoomInfosTopValue && topValue < roomAmentitiesTopValue) {
            animate(anchorBasicRoomInfos);
        } else if (topValue >= roomAmentitiesTopValue && topValue < roomInfoTopValue) {
            animate(anchorRoomAmentities);
        } else if (topValue >= roomInfoTopValue && topValue < roomInfoTopValue) {
            animate(anchorRoomLocation);
        } else animate(anchorRoomInfo);
    }

    $(document).on("scroll", addScrollEventForDocument);

    $("#roomStatus1").on("change", function () {
        $("#roomStatus0").prop("checked", false);
        $("#deleteRoom").prop("checked", false);
    });

    $("#roomStatus0").on("change", function () {
        $("#roomStatus1").prop("checked", false);
        $("#deleteRoom").prop("checked", false);
    });

    $("#deleteRoom").on("change", function () {
        $("#roomStatus0").prop("checked", false);
        $("#roomStatus1").prop("checked", false);
    });

    $(".manage-ys__check-btn").each(function () {
        const dataType = $(this).data("type");

        if (
            dataType === "prominentAmentities" &&
            prominentAmentitiesID.includes($(this).data("edit"))
        )
            $(this).addClass("checked");
        else if (
            dataType === "favoriteAmentities" &&
            favoriteAmentitiesID.includes($(this).data("edit"))
        )
            $(this).addClass("checked");
        else {
            if (safeAmentitiesID.includes($(this).data("edit"))) $(this).addClass("checked");
        }

        $(this)
            .off("click")
            .on("click", function () {
                const siblings = $(this).siblings(".manage-ys__uncheck-btn");
                if (siblings.hasClass("checked")) {
                    siblings.removeClass("checked");
                    const svg = siblings.children().children("svg");
                    svg.css("stroke", "rgb(113, 113, 113)");
                }

                const svg = $(this).children().children("svg");
                if (!$(this).hasClass("checked")) {
                    $(this).addClass("checked");
                    svg.css("stroke", "#fff");
                } else {
                    $(this).removeClass("checked");
                    svg.css("stroke", "rgb(113, 113, 113)");
                }
            });
    });

    $(".manage-ys__uncheck-btn").each(function () {
        $(this)
            .off("click")
            .on("click", function () {
                const siblings = $(this).siblings(".manage-ys__check-btn");
                if (siblings.hasClass("checked")) {
                    siblings.removeClass("checked");
                    const svg = siblings.children().children("svg");
                    svg.css("stroke", "rgb(113, 113, 113)");
                }

                const svg = $(this).children().children("svg");
                if (!$(this).hasClass("checked")) {
                    $(this).addClass("checked");
                    svg.css("stroke", "#fff");
                } else {
                    $(this).removeClass("checked");
                    svg.css("stroke", "rgb(113, 113, 113)");
                }
            });
    });
}

export function getOffsetTop(id) {
    return $(id).offset().top - 80;
}

export function animate(self) {
    const currentActive = self.parent().siblings().filter(".active");
    const currentDataIndex = parseInt(currentActive.data("index"));
    currentActive.removeClass("active");
    const selfIndex = parseInt(self.parent().data("index"));

    let distance = 0;
    if (selfIndex < currentDataIndex) {
        distance = currentDataIndex - selfIndex;

        self.siblings("div").css("transform", `translateY(${distance * 50}%)`);

        Keyframes.define([
            {
                name: "reverseTranslateY",
                from: { top: `50%` },
                to: {
                    top: `-${distance * 50}%`,
                },
            },
        ]);

        self.parent().addClass("active");

        const ball = new Keyframes(document.getElementById(self.siblings("div").prop("id")));
        ball.play({
            name: "reverseTranslateY",
            duration: "1s",
            timingFunction: "linear",
            delay: "0s",
        });
    } else {
        distance = selfIndex - currentDataIndex;
        self.siblings("div").css("transform", "translateY(-50%)");
        Keyframes.define([
            {
                name: "translateY",
                from: { top: `-${distance * 50}%` },
                to: { top: `50%` },
            },
        ]);

        self.parent().addClass("active");

        const ball = new Keyframes(document.getElementById(self.siblings("div").prop("id")));
        ball.play({
            name: "translateY",
            duration: "1s",
            timingFunction: "linear",
            delay: "0s",
        });
    }

    $(".manage--ys__scrolling--menu").first().addClass("active");
    $(document)
        .off("scroll")
        .on("scroll", function () {
            const roomImagesTopValue = getOffsetTop("#roomImages");
            const basicRoomInfosTopValue = getOffsetTop("#basicRoomInfos");
            const roomAmentitiesTopValue = getOffsetTop("#roomAmentities");
            const roomLocationTopValue = getOffsetTop("#roomLocation");
            const roomInfoTopValue = getOffsetTop("#roomInfo");

            let anchorRoomImages = $('a[data-scroll="#roomImages"]');
            let anchorBasicRoomInfos = $('a[data-scroll="#basicRoomInfos"]');
            let anchorRoomAmentities = $('a[data-scroll="#roomAmentities"]');
            let anchorRoomLocation = $('a[data-scroll="#roomLocation"]');
            let anchorRoomInfo = $('a[data-scroll="#roomInfo"]');

            function addScrollEventForDocument() {
                const topValue = $(document).scrollTop();

                if (topValue <= roomImagesTopValue) {
                    if ($(".manage--ys__scrolling--menu").first().hasClass("active"))
                        $(".manage--ys__scrolling--menu").first().removeClass("active");
                } else if (topValue > roomImagesTopValue && topValue < basicRoomInfosTopValue) {
                    animate(anchorRoomImages);
                } else if (
                    topValue >= basicRoomInfosTopValue &&
                    topValue < roomAmentitiesTopValue
                ) {
                    animate(anchorBasicRoomInfos);
                } else if (topValue >= roomAmentitiesTopValue && topValue < roomInfoTopValue) {
                    animate(anchorRoomAmentities);
                } else if (topValue >= roomInfoTopValue && topValue < roomInfoTopValue) {
                    animate(anchorRoomLocation);
                } else animate(anchorRoomInfo);
            }

            addScrollEventForDocument();
        });
}

export function onKeyDown(event) {
    const self = $(event.currentTarget);
    const currentLength = $(self.data("input-id"));
    const currentValue = currentLength.text();
    if (event.key === "Backspace") {
        if (parseInt(currentValue) > 0) currentLength.text(parseInt(currentValue) - 1);
    } else {
        if (parseInt(currentValue) < 50) currentLength.text(parseInt(currentValue) + 1);
    }
}

export function hideEditBox(
    sectionKey,
    {
        name,
        description,
        roomGroup,
        category,
        roomPrivacy,
        country,
        street,
        city,
        state,
        bedroom,
        bed,
        bathroom,
        status,
    }
) {
    $(`#manage-ys__${sectionKey}-control-container`).removeClass("unhideEditBox");
    $(`#manage-ys__${sectionKey}-control-view`).removeClass("hideViewBox");

    switch (sectionKey) {
        case "name": {
            name && $("#roomNameInput").val(name);
            break;
        }
        case "roomInfo": {
            bedroom && $("#manage-ys__bedRoom").text(bedroom);
            bed && $("#manage-ys__bed").text(bed);
            bathroom && $("#manage-ys__bathRoom").text(bathroom);
            break;
        }
        case "groupAndTypeAndPrivacy": {
            roomGroup && $('select[id="manage-ys__group-input"]').val(roomGroup);
            category && $('select[id="manage-ys__type-input"]').val(category);
            roomPrivacy && $('select[id="manage-ys__privacy-input"]').val(roomPrivacy);
            break;
        }
        case "location": {
            country && $("#manage-ys__location-country").val(country);
            street && $("#manage-ys__location-street").val(street);
            city && $("#manage-ys__location-city").val(city);
            state && $("#manage-ys__location-state").val(state);
            break;
        }
        case "status": {
            $(".radioStatus").each(function () {
                if ($(this).attr("id") === `roomStatus${status ? 1 : 0}`) {
                    $(this).prop("checked", true);
                } else $(this).prop("checked", false);
            });
            break;
        }
        case "description": {
            description && $("#descriptionInput").val(description);
            break;
        }
    }
}

// function redirectToPhotoPage() {

// }
