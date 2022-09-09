import { FC } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { IFavRoom } from "../../features/user/userSlice";
import { Div, Image } from "../../globalStyle";
import { getImage } from "../../helpers";
import { MyNumberForMat } from "../utils";

const PBRoomThumbnail = styled.img`
    width: 124px;
    height: 106px;
    object-fit: cover;
    vertical-align: bottom;
    border-radius: 10px;
`;

interface IFavRoomProps {
    room: IFavRoom;
}

const FavRoom: FC<IFavRoomProps> = ({ room }) => {
    return (
        <div style={{ width: "100%" }}>
            <div
                id='boxPreview'
                style={{
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                    borderRadius: "12px",
                }}
                className='boxPreviewFavRoomPage'
            >
                <div id='boxPreview-header'>
                    <div>
                        <PBRoomThumbnail
                            src={getImage(room!.thumbnail)}
                            id='boxPreviewFavRoomPageRoomThumbnail'
                        />
                    </div>
                    <div>
                        <Div className='col-flex' style={{ justifyContent: "space-between" }}>
                            <div>
                                <div className='fw-600 fs-16' style={{ color: "#222" }}>
                                    {room!.name}
                                </div>
                                <div className='fs-14'>{room?.category}</div>
                            </div>
                            <div className='normal-flex'>
                                <Link to={`/rooms/${room.id}`}>
                                    <div className='flex-center'>
                                        <Image src={getImage("/svg/star.svg")} size='12px' />
                                    </div>
                                </Link>
                                <span
                                    style={{
                                        fontWeight: "500",
                                        fontSize: "12px",
                                        display: "inline-block",
                                        marginLeft: "12px",
                                    }}
                                >
                                    {room!.numberOfReviews > 0 ? (
                                        <span>{Math.floor(room!.averageRating)}</span>
                                    ) : (
                                        <span>0.0</span>
                                    )}
                                    <span style={{ color: "rgb(113,133,133)" }}>
                                        ({room!.numberOfReviews || 0} đánh giá)
                                    </span>
                                </span>
                            </div>
                            <div className='fw-600 fs-16'>
                                <MyNumberForMat price={room.price} />
                            </div>
                        </Div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FavRoom;
