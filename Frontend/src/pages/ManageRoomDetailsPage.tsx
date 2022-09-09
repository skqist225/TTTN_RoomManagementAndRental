import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import Header from "../components/Header";
import { clearUpdateSuccessState, fetchRoomById, roomState } from "../features/room/roomSlice";

import {
    EditLocation,
    EditRoomCount,
    EditRoomInfo,
    SideBar,
    EditImage,
    EditAmenity,
    ViewRoom,
} from "../components/manage_room_details";
import { amenityState, fetchAmenities } from "../features/amenity/amenitySlice";
import "./css/manage_room_details.css";
import { initComp } from "./script/manage_your_space";
import Toast from "../components/notify/Toast";
import { callToast } from "../helpers";

interface IManageRoomDetailsPageProps {}

const ManageRoomDetailsPage: FC<IManageRoomDetailsPageProps> = () => {
    const dispatch = useDispatch();

    const { updateSuccess } = useSelector(roomState);

    const { room } = useSelector(roomState);
    const { amenities } = useSelector(amenityState);

    const { roomId } = useParams();

    useEffect(() => {
        dispatch(fetchRoomById({ roomId: roomId! }));

        dispatch(fetchAmenities());
    }, []);

    useEffect(() => {
        if (room) initComp(room, amenities);
    }, [room, amenities]);

    useEffect(() => {
        if (updateSuccess) {
            callToast("success", "Cập nhật thông tin phòng thành công!");
        }
    }, [updateSuccess]);

    useEffect(() => {
        return () => {
            dispatch(clearUpdateSuccessState());
        };
    }, []);

    return (
        <>
            <Header includeMiddle={false} excludeBecomeHostAndNavigationHeader={true} />

            {room && (
                <div id='main'>
                    <div id='manage-ys__container'>
                        <SideBar roomName={room.name} />
                        <div className='manage-ys__right'>
                            <ViewRoom status={room.status} roomid={room.id} />
                            <div className='manage-ys__right-content'>
                                <EditImage images={room!.images} roomid={room.id} />
                                <EditRoomInfo room={room} />
                                <EditAmenity amenities={amenities} room={room} />
                                <EditLocation room={room} />
                                <EditRoomCount room={room} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Toast />
        </>
    );
};

export default ManageRoomDetailsPage;
