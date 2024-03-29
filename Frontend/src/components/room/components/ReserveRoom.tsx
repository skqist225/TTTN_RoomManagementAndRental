import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { userState } from "../../../features/user/userSlice";
import { Div, Image } from "../../../globalStyle";
import { callToast, getImage } from "../../../helpers";
import { IRoomDetails } from "../../../types/room/type_RoomDetails";
import Toast from "../../notify/Toast";
import $ from "jquery";
import { MyNumberForMat } from "../../utils";
import { upsertBookingDetail } from "../../../features/bookingDetail/bookingDetailSlice";

interface IReserveRoomProps {
    room: IRoomDetails;
}

const RDTBookingRatingAndReview = styled.div`
    margin-bottom: 24px;

    span {
        font-size: 14px;
        font-weight: 500;
        margin-right: 5px;
    }

    &:first-child {
        display: inline-flex;
        align-items: center;
    }

    span:last-child {
        text-decoration: underline;
    }
`;

const RDTBookingPreviewPriceLine = styled.div.attrs(props => ({
    className: "previewPrice-line",
}))`
    padding-bottom: 12px;
    display: none;
    margin-top: 10px;

    &.active {
        display: block !important;
    }

    &:first-child {
        margin-top: 20px !important;
    }
`;

const ReserveRoom: FC<IReserveRoomProps> = ({ room }) => {
    const dispatch = useDispatch();

    const { user } = useSelector(userState);

    function processBooking() {
        let checkinDate = $("#checkinDate").text().replaceAll("/", "-");
        let checkoutDate = $("#checkoutDate").text().replaceAll("/", "-");

        if (checkinDate === "Thêm ngày" && checkoutDate === "Thêm ngày") {
            callToast("warning", "Vui lòng chọn ngày bắt đầu và kết thúc");
            return;
        }
        if (user === null) {
            callToast("warning", "Vui lòng đăng nhập để đặt phòng");
            return;
        }

        checkinDate = checkinDate.replace(/\//g, "-");
        checkoutDate = checkoutDate.replace(/\//g, "-");

        let [checkinDateDate, checkinDateMonth, checkinDateYear] = checkinDate.split("-");
        let [checkoutDateDate, checkoutDateMonth, checkoutDateYear] = checkoutDate.split("-");

        if (parseInt(checkinDateDate) < 10) {
            checkinDateDate = `0${checkinDateDate}`;
        }
        if (parseInt(checkinDateMonth)) {
            checkinDateMonth = `0${checkinDateMonth}`;
        }

        if (parseInt(checkoutDateDate) < 10) {
            checkoutDateDate = `0${checkoutDateDate}`;
        }
        if (parseInt(checkoutDateMonth)) {
            checkoutDateMonth = `0${checkoutDateMonth}`;
        }

        console.log(`${checkinDateDate}-${checkinDateMonth}-${checkinDateYear}`);
        console.log(`${checkoutDateDate}-${checkoutDateMonth}-${checkoutDateYear}`);

        dispatch(
            upsertBookingDetail({
                checkinDate: `${checkinDateDate}-${checkinDateMonth}-${checkinDateYear}`,
                checkoutDate: `${checkoutDateDate}-${checkoutDateMonth}-${checkoutDateYear}`,
                roomId: room.id,
            })
        );
    }

    return (
        <article className='rdt__booking'>
            <div className='rdt__booking--container'>
                <Div>
                    <MyNumberForMat
                        price={room!.price}
                        priceFontSize='22px'
                        priceFontWeight='600'
                    />
                </Div>
                <RDTBookingRatingAndReview className='normal-flex'>
                    <span>
                        <Image src={getImage("/svg/star.svg")} size='12px' />
                    </span>
                    <span>{room.averageRating} ·</span>
                    <span>{room.reviews.length} đánh giá</span>
                </RDTBookingRatingAndReview>
                <div className='rdt__booking--receiveRoom'>
                    <div className='flex'>
                        <Div padding='10px 12px 10px' width='50%'>
                            <div className='fw-600'>Nhận phòng</div>
                            <div id='checkinDate'>Thêm ngày</div>
                        </Div>
                        <Div
                            width='50%'
                            padding='10px 12px 10px'
                            style={{
                                borderLeft: "0.5px solid rgb(211, 211, 211)",
                            }}
                        >
                            <div className='fw-600'>Trả phòng</div>
                            <div id='checkoutDate'>Thêm ngày</div>
                        </Div>
                    </div>
                </div>
                <div>
                    <button type='submit' className='rdt_booking_button' onClick={processBooking}>
                        <span>
                            <span
                                style={{
                                    backgroundPosition:
                                        "calc((100 - 96.4371) * 1%) calc((100 - 50) * 1%)",
                                }}
                            ></span>
                        </span>
                        <span>Đặt phòng</span>
                    </button>
                </div>
                <RDTBookingPreviewPriceLine>
                    <div className='normal-flex'>
                        <div className='f1'>
                            <div className='normal-flex'>
                                <div>
                                    <MyNumberForMat price={room!.price} priceFontSize='16px' />
                                </div>
                                <div style={{ color: "rgb(32, 32, 32)" }} className='fs-16'>
                                    <span>&nbsp;x&nbsp;</span>
                                    <span id='numberOfNight'>7</span>
                                    &nbsp;đêm&nbsp;
                                </div>
                            </div>
                        </div>
                        <div className='fs-16'>
                            <span id='totalPrice'></span>₫
                        </div>
                    </div>
                </RDTBookingPreviewPriceLine>
                <RDTBookingPreviewPriceLine>
                    <div className='flex-space'>
                        <div>
                            <div
                                style={{
                                    color: "rgb(32, 32, 32)",
                                    fontSize: "16px",
                                    textDecoration: "underline",
                                }}
                            >
                                Phí dọn dẹp
                            </div>
                        </div>
                        <div className='fs-16'>
                            <span id='cleanFee'></span>₫
                        </div>
                    </div>
                </RDTBookingPreviewPriceLine>
                <RDTBookingPreviewPriceLine>
                    <div className='flex-space'>
                        <div>
                            <div
                                style={{
                                    color: "rgb(32, 32, 32)",
                                    fontSize: "16px",
                                    textDecoration: "underline",
                                }}
                            >
                                Phí dịch vụ
                            </div>
                        </div>
                        <div className='fs-16'>
                            <span id='siteFee'></span>₫
                        </div>
                    </div>
                </RDTBookingPreviewPriceLine>
                <div className='flex' style={{ paddingTop: "16px" }}>
                    <div className='totalPriceTitle'>Tổng</div>
                    <div className='totalPriceTitle'>
                        <span id='finalTotalPrice'>0</span>₫
                    </div>
                </div>
            </div>
            <Toast />
        </article>
    );
};

export default ReserveRoom;
