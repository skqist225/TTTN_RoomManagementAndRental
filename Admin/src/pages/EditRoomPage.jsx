import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchRoomById, roomState } from "../features/room/roomSlice";
import EditRoomContent from "./EditRoomContent";

function EditRoomPage() {
    const { roomid } = useParams();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchRoomById({ roomid }));
    }, []);

    const { room, loading } = useSelector(roomState);

    return <div>{!loading && room && <EditRoomContent room={room} />}</div>;
}

export default EditRoomPage;
