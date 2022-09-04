import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Div, MainButton } from "../../globalStyle";
import $ from "jquery";
import StepProcess from "./StepProcess";
import { ToastContainer } from "react-toastify";

import { callToast } from "../../helpers";
import { useDispatch, useSelector } from "react-redux";
import { addRoom, roomState } from "../../features/room/roomSlice";
import { IPostAddRoom, IRoomLocalStorage } from "../../types/room/type_Room";
import { userState } from "../../features/user/userSlice";

import "./css/right_content.css";
import Toast from "../notify/Toast";
import { stateState } from "../../features/address/stateSlice";
import { cityState } from "../../features/address/citySlice";

interface IRightPageContentProps {
    nextPage: string;
    prevPage: string;
    MainContent: React.ReactNode;
    stepNumber: number;
    backgroundColor?: string;
    beforeMiddle?: React.ReactNode;
    longitude?: number;
    latitude?: number;
    placeName?: string;
    descriptions?: string[];
}

const RightPageContent: FC<IRightPageContentProps> = ({
    nextPage,
    prevPage,
    MainContent,
    stepNumber,
    backgroundColor,
    beforeMiddle,
    longitude,
    latitude,
    placeName,
    descriptions,
}) => {
    const dispatch = useDispatch();

    const { user } = useSelector(userState);
    const { states } = useSelector(stateState);
    const { cities } = useSelector(cityState);

    function showErrorNotification(message: string) {
        callToast("error", message);
    }

    function setRoomAttrToLocalStorage(value: any) {
        let room: IRoomLocalStorage = {};
        if (!localStorage.getItem("room")) {
            room = {
                ...value,
            };
        } else {
            room = JSON.parse(localStorage.getItem("room")!);
            room = {
                ...room,
                ...value,
            };
        }

        localStorage.setItem("room", JSON.stringify(room));
    }

    function moveToNextPage() {
        let room: IRoomLocalStorage = {};
        switch (stepNumber) {
            case 1: {
                const chosenCategory = $("div.category__box").filter(".active");

                if (chosenCategory.length === 0) {
                    showErrorNotification("Vui lòng chọn thể loại cho phòng");
                    return;
                }

                setRoomAttrToLocalStorage({
                    category: parseInt(chosenCategory.data("category-id")),
                });

                break;
            }
            case 2: {
                const chosenPrivacy = $("div.privacy-type__box").filter(".active");

                if (chosenPrivacy.length === 0) {
                    showErrorNotification("Vui lòng chọn quyền riêng tư cho phòng");
                    return;
                }

                setRoomAttrToLocalStorage({
                    privacy: parseInt(chosenPrivacy.data("privacy-id")),
                    privacyName: chosenPrivacy.data("privacy-name"),
                });

                break;
            }
            case 3: {
                if (!longitude) {
                    showErrorNotification("Kinh độ không tồn tại");
                    return;
                }
                if (!latitude) {
                    showErrorNotification("Vĩ độ không tồn tại");
                    return;
                }

                const selectedCity = cities.filter(
                    ({ id }: { id: number }) => id === parseInt($("#city").val()!.toString())
                )[0];

                const selectedState = states.filter(
                    ({ id }: { id: number }) => id === parseInt($("#state").val()!.toString())
                )[0];

                setRoomAttrToLocalStorage({
                    longitude,
                    latitude,
                    state: parseInt($("#state").val()!.toString()),
                    city: parseInt($("#city").val()!.toString()),
                    street: $("#street").val(),
                    placeName: `${$("#street").val()}, ${selectedCity.name}, ${
                        selectedState.name
                    }, Việt Nam`,
                });

                break;
            }
            case 4: {
                setRoomAttrToLocalStorage({
                    guestNumber: parseInt($("#guestNumber").text()),
                    bedNumber: parseInt($("#bedNumber").text()),
                    bedRoomNumber: parseInt($("#bedRoomNumber").text()),
                    bathRoomNumber: parseInt($("#bathRoomNumber").text()),
                });

                break;
            }
            case 5: {
                const amenitiesClassName = $(".amentitiesClassName").filter(".chosen");

                if (amenitiesClassName.length === 0) {
                    showErrorNotification("Vui lòng chọn tiện ích trước khi tiếp tục!");
                    return;
                }

                const amenities: any[] = [];

                amenitiesClassName.each(function () {
                    amenities.push(parseInt($(this).children("input").first().val()!.toString()));
                });

                setRoomAttrToLocalStorage({
                    amenities,
                });

                break;
            }
            case 6: {
                const room = localStorage.getItem("room")!;

                if (room) {
                    const { images } = JSON.parse(room);
                    if (!images || (images && images.length === 0)) {
                        showErrorNotification("Vui lòng tải lên ít nhất 1 ảnh");
                        return;
                    }
                }
                break;
            }
            case 7: {
                if (!$("#room-name").val()) {
                    showErrorNotification("Vui lòng điền tên phòng");
                    return;
                }
                setRoomAttrToLocalStorage({
                    name: $("#room-name").val()!.toString(),
                });

                break;
            }
            case 8: {
                if (descriptions && descriptions.length == 2) {
                    setRoomAttrToLocalStorage({
                        description: descriptions.join(","),
                    });
                } else {
                    showErrorNotification("Vui lòng chọn 2 mô tả cho nhà/phòng của bạn");
                    return;
                }
                break;
            }
            case 9: {
                const price = $("#room-price").val();

                console.log(price);

                if (!price) {
                    callToast("error", "Vui lòng điền số tiền");
                    return;
                }

                if (isNaN(parseInt(price.toString()))) {
                    callToast("error", "Số tiền không hợp lệ");
                    return;
                }

                if (price > 1000000000) {
                    callToast("error", "Vui lòng nhập dưới 1.000.000.000đ");
                    return;
                }

                setRoomAttrToLocalStorage({
                    price,
                });

                break;
            }
            case 10: {
                const amenitiesClassName = $(".amentitiesClassName").filter(".chosen");

                if (amenitiesClassName.length === 0) {
                    showErrorNotification("Vui lòng chọn quy tắc trước khi tiếp tục!");
                    return;
                }

                const rules: any[] = [];

                amenitiesClassName.each(function () {
                    rules.push(parseInt($(this).children("input").first().val()!.toString()));
                });

                setRoomAttrToLocalStorage({
                    rules,
                });

                break;
            }
            case 11: {
                if (localStorage.getItem("room")) {
                    const {
                        amenities: lsAmenities,
                        bathRoomNumber,
                        bedNumber,
                        bedRoomNumber,
                        category,
                        city: lsCity,
                        description,
                        guestNumber,
                        images,
                        latitude,
                        longitude,
                        name,
                        price,
                        privacy,
                        rules,
                        street: lsStreet,
                    } = JSON.parse(localStorage.getItem("room")!);

                    const formData = new FormData();

                    const roomEntity: IPostAddRoom = {
                        category: category!,
                        privacy,

                        street: lsStreet,
                        city: lsCity,
                        latitude,
                        longitude,

                        bedroomCount: bedRoomNumber!,
                        bathroomCount: bathRoomNumber!,
                        guestCount: guestNumber!,
                        bedCount: bedNumber!,

                        amenities: lsAmenities,
                        images: images!,

                        name,
                        rules,

                        description,

                        price: parseInt(price!),

                        host: user?.id!,
                    };

                    console.log("[Room Entity] : ", roomEntity);

                    for (let key in roomEntity) {
                        formData.append(key, (roomEntity as any)[key]);
                    }
                    dispatch(addRoom(formData));
                }
                break;
            }
        }

        if (stepNumber !== 11) {
            window.location.href = `${window.location.origin}/become-a-host/${nextPage}`;
        }
    }

    return (
        <Div
            className='col-flex p-relative'
            width='50%'
            height='100%'
            backgroundColor={backgroundColor}
        >
            {stepNumber === 3 && beforeMiddle}

            {stepNumber === 5 ? (
                <div
                    className='flex-center f1'
                    style={{
                        overflowY: "scroll",
                        flex: 1,
                        padding: "0 48px",
                        maxWidth: "90%",
                        margin: "0 auto",
                    }}
                >
                    {MainContent}
                </div>
            ) : (
                <div className='flex-center f1'>{MainContent}</div>
            )}

            <StepProcess stepNumber={stepNumber} />
            <Div
                className='flex-space'
                height='80px'
                padding='16px'
                style={
                    stepNumber === 4
                        ? {
                              position: "absolute",
                              zIndex: 100,
                              bottom: "0",
                              backgroundColor: "#fff",
                          }
                        : {}
                }
            >
                <div>
                    <Link
                        to={stepNumber === 0 ? "/" : `/become-a-host/${prevPage}`}
                        id='right--content__prev--step'
                        style={{ color: backgroundColor === "#000000" ? "#fff" : "#222" }}
                    >
                        Quay lại
                    </Link>
                </div>
                <MainButton width='120px' height='48px' onClick={moveToNextPage}>
                    <span className='fw-500'>{stepNumber === 11 ? "Hoàn tất" : "Tiếp theo"}</span>
                </MainButton>
            </Div>
            <Toast />
        </Div>
    );
};

export default RightPageContent;
