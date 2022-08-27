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
    // const [category,setCategory] = useState(0);
    const [nextButtonDisabled, setNextButtonDisabled] = useState(true);

    const { user } = useSelector(userState);
    const { newlyCreatedRoomId } = useSelector(roomState);

    useEffect(() => {
        if (stepNumber === 1) {
            if ($("div.category__box").filter(".active")) setNextButtonDisabled(false);
        }
    }, [$("div.category__box").filter(".active")]);

    function showErrorNotification(message: string) {
        callToast("error", message);
        return;
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
                }

                setRoomAttrToLocalStorage({
                    privacy: parseInt(chosenPrivacy.data("privacy-id")),
                });

                break;
            }
            case 3: {
                if (!longitude) {
                    showErrorNotification("Kinh độ không tồn tại");
                }
                if (!latitude) {
                    showErrorNotification("Vĩ độ không tồn tại");
                }

                setRoomAttrToLocalStorage({
                    longitude,
                    latitude,
                    state: parseInt($("#state").val()!.toString()),
                    city: parseInt($("#city").val()!.toString()),
                    street: $("#street").val(),
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
                if (localStorage.getItem("room")) {
                    room = JSON.parse(localStorage.getItem("room")!);
                    if (room["roomImages"] && room.roomImages.length < 5) {
                        callToast("warning", "Vui lòng tải lên 5 ảnh");
                        return;
                    }
                }
                break;
            }
            case 7: {
                const roomTitle = $("textarea").val()! as string;

                if (!localStorage.getItem("room")) {
                    room = {
                        roomTitle,
                    };
                } else {
                    room = JSON.parse(localStorage.getItem("room")!);
                    room = {
                        ...room,
                        roomTitle,
                    };
                }
                break;
            }
            case 8: {
                if (descriptions && descriptions.length == 2) {
                    if (!localStorage.getItem("room")) {
                        room = {
                            descriptions,
                        };
                    } else {
                        room = JSON.parse(localStorage.getItem("room")!);
                        room = {
                            ...room,
                            descriptions,
                        };
                    }
                } else {
                    callToast("error", "Vui lòng chọn 2 mô tả cho nhà/phòng của bạn");
                    return;
                }
                break;
            }
            case 9: {
                const roomPricePerNight = ($("#room-price").val() as string).replace("₫", "");

                if (!localStorage.getItem("room")) {
                    room = {
                        roomPricePerNight,
                    };
                } else {
                    room = JSON.parse(localStorage.getItem("room")!);
                    room = {
                        ...room,
                        roomPricePerNight,
                    };
                }
                if (parseInt(($("#room-price").val() as string).replace("₫", "")) > 1000000000) {
                    callToast("warning", "Vui lòng nhập dưới 1.000.000.000đ");
                    return;
                }
                if (isNaN(parseInt(($("#room-price").val() as string).replace("₫", "")))) {
                    callToast("error", "Số tiền không hợp lệ");
                    return;
                }
                break;
            }
            case 10: {
                if (localStorage.getItem("room")) {
                    room = JSON.parse(localStorage.getItem("room")!);
                    const placeNameLength = room.placeName!.toString().split(",").length;
                    let country =
                        room.placeName!.toString().split(",")[placeNameLength - 1] || "no-country";
                    const state =
                        room.placeName!.toString().split(",")[placeNameLength - 2] || "no-state";
                    const city =
                        room.placeName!.toString().split(",")[placeNameLength - 3] || "no-city";
                    const street =
                        room.placeName!.toString().split(",")[placeNameLength - 4] || "no-street";

                    const fd = new FormData();

                    let amenities: number[] = [];
                    amenities.push(room.prominentAmentity!);
                    amenities.push(room.favoriteAmentity!);
                    amenities.push(room.safeAmentity!);

                    const roomEntity: IPostAddRoom = {
                        name: room.roomTitle!,
                        amentities: amenities!,
                        images: room.roomImages!,
                        country: 216,
                        state,
                        city,
                        street,
                        bedroomCount: room.bedRoomNumber!,
                        bathroomCount: room.bathRoomNumber!,
                        accomodatesCount: room.guestNumber!,
                        bedCount: room.bedNumber!,
                        currency: 2, // chose currency
                        category: room.category!,
                        roomGroup: room.roomGroup!,
                        description: room.descriptions?.join(",")!,
                        latitude: room.latitude!,
                        longitude: room.longitude!,
                        price: parseInt(room.roomPricePerNight!),
                        priceType: "PER_NIGHT",
                        host: user?.id!,
                        privacyType: room.privacyType!,
                    };

                    for (let key in roomEntity) {
                        fd.append(key, (roomEntity as any)[key]);
                    }
                    dispatch(addRoom(fd));
                }
                break;
            }
        }

        if (stepNumber !== 11) {
            window.location.href = `${window.location.origin}/become-a-host/${nextPage}`;
        }
    }

    useEffect(() => {
        if (newlyCreatedRoomId) {
            window.location.href = `${window.location.origin}/become-a-host/${nextPage}/${newlyCreatedRoomId}`;
        }
    }, [newlyCreatedRoomId]);

    function backToHomePage() {
        window.location.href = window.location.origin;
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
                <MainButton
                    width='120px'
                    height='48px'
                    onClick={moveToNextPage}
                    // disabled={nextButtonDisabled}
                >
                    <span className='fw-500'>Tiếp theo</span>
                </MainButton>
            </Div>
            <ToastContainer
                position='top-center'
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </Div>
    );
};

export default RightPageContent;
