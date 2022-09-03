import { FC } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Div, Image } from "../../globalStyle";
import { getImage } from "../../helpers";
import { MyNumberForMat } from "../utils";
import ContactHost from "./ContactHost";

const PBRoomThumbnail = styled.img`
    width: 124px;
    height: 106px;
    object-fit: cover;
    vertical-align: bottom;
    border-radius: 10px;
`;

interface IRoomAndPricePreviewProps {
    room: IRoom;
    numberOfNights: number;
}

interface IRoom {
    id: number;
    name: string;
    thumbnail: string;
    category: string;
    numberOfReviews: number;
    cleanFee: number;
    siteFee: number;
    currencySymbol: string;
    price: number;
    averageRating: number;
    totalFee: number;
    checkinDate?: string;
    checkoutDate?: string;
}

const RoomAndPricePreview: FC<IRoomAndPricePreviewProps> = ({ room, numberOfNights }) => {
    return (
        <div style={{ width: "100%" }}>
            <div id='boxPreview'>
                <div id='boxPreview-header'>
                    <div>
                        <PBRoomThumbnail src={getImage(room!.thumbnail)} />
                    </div>
                    <div>
                        <Div className='col-flex' style={{ justifyContent: "space-between" }}>
                            <div>
                                <div className='fs-12'>{room?.category}</div>
                                <div className='fw-500'>{room!.name}</div>
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
                                        <span>{room!.averageRating}</span>
                                    ) : (
                                        <span>0.0</span>
                                    )}
                                    <span style={{ color: "rgb(113,133,133)" }}>
                                        ({room!.numberOfReviews || 0} đánh giá)
                                    </span>
                                </span>
                            </div>
                            {room.checkinDate && <div>Từ ngày: {room.checkinDate}</div>}
                            {room.checkoutDate && <div>Đến ngày: {room.checkoutDate}</div>}
                        </Div>
                    </div>
                </div>
                <div>
                    <div id='boxPreview-body'>
                        <div className='previewPrice-line'>
                            <div className='flex-space'>
                                <div>
                                    <div
                                        style={{ color: "rgb(32, 32, 32)" }}
                                        className='fs-16 fw-400 normal-flex'
                                    >
                                        <MyNumberForMat price={room!.price} priceFontSize='16px' />
                                        <div>
                                            &nbsp;
                                            <span>x</span>&nbsp;
                                            <span>{numberOfNights}</span>
                                            &nbsp;đêm&nbsp;
                                        </div>
                                    </div>
                                </div>
                                <div className='fs-16 fw-400'>
                                    <MyNumberForMat
                                        price={room!.price * numberOfNights}
                                        priceFontSize='16px'
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='previewPrice-line' style={{ borderBottom: "none" }}>
                            <div className='flex-space'>
                                <div>
                                    <div
                                        style={{
                                            color: "rgb(32, 32, 32)",
                                            textDecoration: "underline",
                                        }}
                                        className='fs-16 fw-400'
                                    >
                                        Phí vệ sinh
                                    </div>
                                </div>
                                <div className='fs-16 fw-400'>
                                    <MyNumberForMat price={room.cleanFee} priceFontSize='16px' />
                                </div>
                            </div>
                        </div>
                        <div className='previewPrice-line' style={{ borderBottom: "none" }}>
                            <div className='flex-space'>
                                <div>
                                    <div
                                        style={{
                                            color: "rgb(32, 32, 32)",
                                            textDecoration: "underline",
                                        }}
                                        className='fs-16 fw-400'
                                    >
                                        Phí dịch vụ
                                    </div>
                                </div>
                                <div className='fs-16 fw-400'>
                                    <MyNumberForMat price={room.siteFee} priceFontSize='16px' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id='boxPreview-footer' className='flex-space'>
                        <div className='fs-16 fw-600'>Tổng &nbsp;</div>
                        <div>
                            <MyNumberForMat
                                price={room.totalFee}
                                priceFontSize='16px'
                                priceFontWeight='600'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomAndPricePreview;
