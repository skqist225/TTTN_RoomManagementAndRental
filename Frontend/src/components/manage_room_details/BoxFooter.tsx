import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { roomState, updateRoom } from "../../features/room/roomSlice";
import { callToast } from "../../helpers";

import $ from "jquery";
import "./css/box_footer.css";
import axios from "axios";
import { RootState } from "../../store";

interface IBoxFooterProps {
    sectionKey: string;
    idInput: string;
    hideEditBox: Function;
    name?: string;
    description?: string;
    roomGroup?: string;
    category?: string;
    roomPrivacy?: string;
    country?: string;
    street?: string;
    city?: string;
    state?: string;
}

const BoxFooter: FC<IBoxFooterProps> = ({
    sectionKey,
    idInput,
    name,
    description,
    category,
    roomPrivacy,
    country,
    street,
    city,
    state,
    hideEditBox,
}) => {
    const dispatch = useDispatch();

    const { states } = useSelector((state: RootState) => state.state);
    const { cities } = useSelector((state: RootState) => state.city);

    function closeEditBox() {
        let obj = {};
        if (sectionKey === "name") obj = { name };
        if (sectionKey === "description") obj = { description };
        if (sectionKey === "groupAndTypeAndPrivacy") obj = { category, roomPrivacy };
        if (sectionKey === "location")
            obj = {
                country,
                street,
                city,
                state,
            };
        hideEditBox(sectionKey, obj);
    }
    const { room } = useSelector(roomState);

    function sendRequest(data: any) {
        dispatch(
            updateRoom({
                roomId: room!.id,
                fieldName: sectionKey,
                postObj: data,
            })
        );
    }

    async function updateField() {
        switch (sectionKey) {
            case "name": {
                const roomName = $(idInput).val();
                sendRequest({ name: roomName });
                break;
            }
            case "roomInfo": {
                const guest = $("#manage-ys__guest").text().trim();
                const bedroom = $("#manage-ys__bedRoom").text().trim();
                const bed = $("#manage-ys__bed").text().trim();
                const bathroom = $("#manage-ys__bathRoom").text().trim();

                sendRequest({
                    guest,
                    bedroom,
                    bed,
                    bathroom,
                });
                break;
            }
            case "categoryAndPrivacy": {
                const categoryId = $('select[id="manage-ys__type-input"]').val();
                const privacyId = $('select[id="manage-ys__privacy-input"]').val();

                sendRequest({
                    category: categoryId,
                    roomPrivacy: privacyId,
                });

                break;
            }
            case "location": {
                const lState = $("#manage-ys__location-state").val();
                const lCity = $("#manage-ys__location-city").val();
                const street = $("#manage-ys__location-street").val();

                const filteredCity = cities.filter(
                    city => city.id === parseInt(lCity!.toString())
                )[0];
                const filteredState = states.filter(
                    state => state.id === parseInt(lState!.toString())
                )[0];

                const placeToSearch =
                    street + " " + filteredCity.name + " " + filteredState.name + " " + "Vietnam";

                const coords = await getPositionFromInput(placeToSearch);

                console.log({
                    city,
                    street,
                    ...coords,
                });

                sendRequest({
                    city: lCity,
                    street,
                    ...coords,
                });

                break;
            }
            case "status": {
                const checked = $('input[type="radio"]:checked').attr("id")!;
                let request: number = 0;
                if (checked.startsWith("roomStatus")) {
                    request = parseInt(checked.substr(-1));
                } else {
                    request = 2;
                }

                if (request === 2) {
                    // window.location.href = `${baseURL}room/${roomId}/delete`;
                } else {
                    sendRequest({
                        status: request,
                    });
                }

                break;
            }
            case "description": {
                const description2 = $("#descriptionInput").val();
                sendRequest({
                    description: description2,
                });
                break;
            }
            case "amenities": {
                let checkedArray: string[] = [];

                $(".manage-ys__check-btn").each(function () {
                    if ($(this).hasClass("checked")) {
                        checkedArray.push($(this).data("edit"));
                    }
                });

                sendRequest({
                    checked: checkedArray.length > 0 ? checkedArray.join(",").trim() : "-1",
                });

                break;
            }
            case "price": {
                sendRequest({
                    price: $("#roomPrice").val(),
                });
                break;
            }
        }

        closeEditBox();
    }

    async function getPositionFromInput(placeToSearch: string) {
        const accessToken =
            "pk.eyJ1IjoibG9yZGVkc3dpZnQyMjUiLCJhIjoiY2t3MDJvZ2E5MDB0dDJxbndxbjZxM20wOCJ9.hYxzgffyfc93Aiogipp5bA";

        const { data } = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeToSearch}.json?access_token=${accessToken}`
        );

        return Promise.resolve({
            latitude: data.features[0].center[1],
            longitude: data.features[0].center[0],
        });
    }

    return (
        <div className='flex-space' id='box--footer__container'>
            <div>
                <button className='manage--ys__transparentBtn' onClick={closeEditBox}>
                    Hủy
                </button>
            </div>
            <div>
                <button className='manage-ys__save-edit-btn' onClick={updateField}>
                    Lưu
                </button>
            </div>
        </div>
    );
};

export default BoxFooter;
