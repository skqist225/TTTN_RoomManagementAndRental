import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userState } from "../../features/user/userSlice";
import { Image } from "../../globalStyle";
import { callToast, getImage, seperateNumber } from "../../helpers";
import { amenityState, fetchAmenities } from "../../features/amenity/amenitySlice";
import IAmenity from "../../types/type_Amenity";
import $ from "jquery";
import "./css/room_preview_main_content.css";
import { fetchRules, ruleState } from "../../features/rule/ruleSlice";
import { roomState } from "../../features/room/roomSlice";

interface IRoomPreviewMainContentProps {}

const RoomPreviewMainContent: FC<IRoomPreviewMainContentProps> = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(userState);
    const [lAmenities, setLAmenities] = useState<IAmenity[]>([]);
    const [lRules, setLRules] = useState<[]>([]);
    const { loading: aLoading, amenities } = useSelector(amenityState);
    const {
        listing: { loading: rLoading, rules },
    } = useSelector(ruleState);

    const { newlyCreatedRoomId } = useSelector(roomState);

    useEffect(() => {
        dispatch(fetchAmenities());
        dispatch(fetchRules());
    }, []);

    useEffect(() => {
        if (!rLoading) {
            const lsRoom = localStorage.getItem("room");
            if (lsRoom) {
                const { rules: lsRules } = JSON.parse(lsRoom);

                const selectedRules = rules.filter(({ id }) => lsRules.includes(id));
                setLRules(selectedRules as any);
            }
        }
    }, [rLoading]);

    useEffect(() => {
        if (!aLoading) {
            const lsRoom = localStorage.getItem("room");
            if (lsRoom) {
                const { amenities: lsAmenities } = JSON.parse(lsRoom);

                const selectedAmenities = amenities.filter(({ id }) => lsAmenities.includes(id));
                setLAmenities(selectedAmenities);
            }
        }
    }, [aLoading]);

    useEffect(() => {
        const lsRoom = localStorage.getItem("room");

        if (!lsRoom) {
            window.location.href = window.location.origin;
            return;
        }

        if (lsRoom) {
            const {
                name,
                images,
                guestNumber,
                bedRoomNumber,
                bedNumber,
                bathRoomNumber,
                description,
                price,
                privacyName,
                currencySymbol,
                placeName,
            } = JSON.parse(lsRoom);

            $("#roomThumbnail").attr("src", getImage(`/room_images/${user?.email}/${images[0]}`));
            $("#room-preview__room-title").text(name);

            $("#room-preview__room-type").text(
                `${privacyName} cho thuê. Chủ nhà ${user?.firstName} ${user?.lastName}`
            );
            $("#room-preview__room-info").text(
                `${guestNumber} khách · ${bedRoomNumber} phòng ngủ  · ${bedNumber} giường · ${bathRoomNumber} phòng tắm`
            );
            $("#room-preview__room-description").text(
                `Thư giãn tại địa điểm nghỉ dưỡng ${description} này.`
            );

            $("#room-preview__room-price").text(seperateNumber(price) + "đ" + "/ đêm");

            $("#room-preview__room-location-txt").text(placeName);
        }
    }, []);

    useEffect(() => {
        if (newlyCreatedRoomId) {
            window.location.href = `${window.location.origin}/hosting/listings/1`;
        }
    }, [newlyCreatedRoomId]);

    return (
        <div className='room-preview__container'>
            <div className='room-preview__wrapper'>
                <div id='room-preview__room-thumbnail'>
                    <img
                        src=''
                        alt=''
                        id='roomThumbnail'
                        className='of-c'
                        width='100%'
                        height='229px'
                    />
                </div>
                <div id='room-preview__room-title' className='room-preview__line'></div>
                <div className='room-preview__line flex'>
                    <div id='room-preview__room-type'></div>
                    <Image
                        src={getImage(user!.avatarPath)}
                        size='40px'
                        className='of-c rounded-border inline-block '
                        style={{ justifySelf: "flex-end" }}
                    />
                </div>
                <div id='room-preview__room-info' className='room-preview__line'></div>
                <div id='room-preview__room-description' className='room-preview__line'></div>
                <div id='room-preview__room-price' className='room-preview__line'></div>
                <div id='room-preview__room-amentities' className='room-preview__line'>
                    <div className='room-preview__amentity-title'>Tiện nghi</div>
                    {lAmenities.map(amenity => (
                        <div className='flex room-preview__amentity-container' key={amenity.id}>
                            <div id='prominentAmentityName'>{amenity.name}</div>
                            <div>
                                <img
                                    src={getImage(amenity.iconImagePath)}
                                    alt=''
                                    id='prominentAmentity'
                                    width='26px'
                                    height='26px'
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div id='room-preview__room-amentities' className='room-preview__line'>
                    <div className='room-preview__amentity-title'>Quy tắc</div>
                    {lRules.map((rule: any) => (
                        <div className='flex room-preview__amentity-container' key={rule.id}>
                            <div id='prominentAmentityName'>{rule.title}</div>
                            <div>
                                <img
                                    src={getImage(rule.iconPath)}
                                    alt=''
                                    id='prominentAmentity'
                                    width='26px'
                                    height='26px'
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div
                    id='room-preview__room-location'
                    style={{ margin: "0 24px", paddingBottom: "24px" }}
                >
                    <h2>Vị trí</h2>
                    <div id='room-preview__room-location-txt'></div>
                </div>
            </div>
        </div>
    );
};

export default RoomPreviewMainContent;
