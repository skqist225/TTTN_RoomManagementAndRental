import { ChangeEvent, FC, MouseEvent, useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import ReactDOM from "react-dom";
import {
    BuyButton,
    BuyProductBar,
    FinalPrice,
    Modal,
    ModalContainer,
    OpacityBackground,
    ProductImg,
    ProductLeft,
    ProductName,
    ShopName,
    TotalPay,
} from "./ViewCartComponent";
import { ContentContainer, Flex, WhiteBgWrapper } from "../globalStyle";
import { useDispatch, useSelector } from "react-redux";
import {
    bookingState,
    fetchUserOrders,
    updateBookingStatus,
} from "../features/booking/bookingSlice";
import { callToast, getImage } from "../helpers";
import styled from "styled-components";
import MessageIcon from "@mui/icons-material/Message";
import Button from "@mui/material/Button";
import Toast from "../components/notify/Toast";

import "./css/cart.css";
import { MyNumberForMat } from "../components/utils";
import {
    bookingDetailState,
    clearDeleteBookingDetailAction,
    deleteBookingDetail,
} from "../features/bookingDetail/bookingDetailSlice";

interface ICartPageProps {}

export const Label = styled.label`
    font-weight: 400;
    font-size: 1.8rem;
    color: rgba(0, 0, 0, 0.54);
`;

export const CheckboxInput = styled.input.attrs(() => ({
    type: "checkbox",
}))`
    margin-top: 0.225rem;
    width: 1.5rem;
    height: 1.5rem;

    &:checked {
        background-color: #fff;
        color: orange;
    }

    &:hover {
        background-color: #ccc;
    }
`;

const CartPage: FC<ICartPageProps> = () => {
    const [allBookings, setAllBookings] = useState(false);
    const [finalPrice, setFinalPrice] = useState(0);

    const dispatch = useDispatch();

    const {
        fetchUserOrdersAction: { loading, bookings },
        updateBookingStatusAction: { successMessage: ubsaSuccessMessage },
    } = useSelector(bookingState);

    const {
        deleteBookingDetailAction: { successMessage },
    } = useSelector(bookingDetailState);

    useEffect(() => {
        dispatch(fetchUserOrders());
    }, []);

    function refreshFinalPrice() {
        const finalPrice = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);
        setFinalPrice(finalPrice);
    }

    const handleSelectAllBookings = (event: ChangeEvent<HTMLInputElement>) => {
        const allCb: HTMLCollectionOf<Element> = document.getElementsByClassName("cbShopSelected");
        setAllBookings(prevState => !prevState);

        if (event.target.checked) {
            for (let cb of allCb) {
                (cb as HTMLInputElement).checked = true;
            }

            refreshFinalPrice();
        } else {
            for (let cb of allCb) {
                (cb as HTMLInputElement).checked = false;
            }
            // setNumberOfSelectedProducts(0);
            setFinalPrice(0);
        }
    };

    const handleSelectBooking = (event: ChangeEvent<HTMLInputElement>) => {
        const allCb: HTMLCollectionOf<Element> = document.getElementsByClassName("cbShopSelected");

        if (event.target.checked) {
            if (allCb.length === 1) {
                setAllBookings(true);
                refreshFinalPrice();
                return;
            } else {
                const numberOfCheckbox = allCb.length;
                let numberOfCheckedCheckBox = 0;

                for (let cb of allCb) {
                    if ((cb as HTMLInputElement).checked) {
                        numberOfCheckedCheckBox++;
                    }
                }

                if (numberOfCheckedCheckBox === numberOfCheckbox) {
                    setAllBookings(true);
                    refreshFinalPrice();
                    return;
                }
            }

            const addedPrice = bookings.filter(
                booking => booking.hostId === parseInt(event.target.value)
            )[0];
            setFinalPrice(finalPrice => finalPrice + addedPrice.totalPrice);
        } else {
            if (allCb.length === 1) {
                setAllBookings(false);
                setFinalPrice(0);
                return;
            } else {
                let numberOfUnCheckedCheckBox = 0;

                for (let cb of allCb) {
                    if ((cb as HTMLInputElement).checked) {
                        numberOfUnCheckedCheckBox++;
                    }
                }

                if (numberOfUnCheckedCheckBox === 0) {
                    setAllBookings(false);
                    setFinalPrice(0);
                    return;
                }
            }

            const removedPrice = bookings.filter(
                booking => booking.hostId === parseInt(event.target.value)
            )[0];
            setFinalPrice(finalPrice => finalPrice - removedPrice.totalPrice);
        }
    };
    const handleDeleteBookingDetail = (e: MouseEvent<HTMLButtonElement>) => {
        const { bookingDetailId } = (e.target as any).dataset;
        dispatch(deleteBookingDetail(bookingDetailId));
    };

    useEffect(() => {
        if (successMessage) {
            callToast("success", "Xóa chi tiết đơn đặt phòng thành công");
            dispatch(fetchUserOrders());
            if (allBookings) {
                refreshFinalPrice();
            }
        }
    }, [successMessage]);

    useEffect(() => {
        return () => {
            dispatch(clearDeleteBookingDetailAction());
        };
    }, []);

    const handleProcessToOrder = () => {
        const bookingIds: number[] = [];
        const allCb: HTMLCollectionOf<Element> = document.getElementsByClassName("cbShopSelected");
        for (let cb of allCb) {
            if ((cb as HTMLInputElement).checked) {
                bookingIds.push(parseInt((cb as any).dataset.bookingId));
            }
        }

        if (bookingIds.length === 0) {
            callToast("error", "Vui lòng chọn ít nhất 1 đơn đặt phòng để đặt phòng");
            return;
        } else {
            dispatch(updateBookingStatus({ bookingIds }));
        }
    };

    useEffect(() => {
        if (ubsaSuccessMessage) {
            window.location.href = `/bookings/checkout`;
        }
    }, [ubsaSuccessMessage]);

    return (
        <>
            <Header includeMiddle={false} excludeBecomeHostAndNavigationHeader={true} />
            <div id='main'>
                <div>
                    {!loading && bookings.length > 0 ? (
                        <div id='viewCartParent'>
                            <table style={{ width: "100%" }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: "end" }}>
                                            <Flex width='50%'>
                                                <CheckboxInput
                                                    onChange={handleSelectAllBookings}
                                                    checked={allBookings}
                                                />
                                                <Label
                                                    style={{
                                                        color: " rgba(0,0,0,0.8)",
                                                        width: "46.27949%",
                                                        fontSize: "1rem",
                                                        marginLeft: ".625rem",
                                                    }}
                                                >
                                                    Nhà/Phòng
                                                </Label>
                                            </Flex>
                                        </th>

                                        <th style={{ textAlign: "end" }}>Giá mỗi đêm</th>
                                        <th style={{ textAlign: "end" }}>Ngày nhận phòng</th>
                                        <th style={{ textAlign: "end" }}>Ngày trả phòng</th>
                                        <th style={{ textAlign: "end" }}>Phí dịch vụ</th>
                                        <th style={{ textAlign: "end" }}>Phí dọn dẹp</th>
                                        <th style={{ textAlign: "end" }}>Tổng giá tiền</th>
                                        <th style={{ textAlign: "end" }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(booking => (
                                        <>
                                            <tr>
                                                <td>
                                                    <ShopName>
                                                        <CheckboxInput
                                                            width='1.8rem'
                                                            height='1.8rem'
                                                            style={{ marginRight: "1.8rem" }}
                                                            className='cbShopSelected'
                                                            onChange={handleSelectBooking}
                                                            value={booking.hostId}
                                                            data-booking-id={booking.id}
                                                        />
                                                        <span>{booking.hostFullName}</span>
                                                        {/* <MessageIcon /> */}
                                                    </ShopName>
                                                </td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                            {booking.bookingDetails.map(bookingDetail => (
                                                <tr key={bookingDetail.bookingDetailId}>
                                                    <td>
                                                        <ProductLeft>
                                                            <ProductImg
                                                                src={getImage(
                                                                    bookingDetail.roomThumbnail
                                                                )}
                                                            />
                                                            <Flex
                                                                style={{ flexWrap: "wrap" }}
                                                                flexDirection='column'
                                                                padding='.5rem 2rem 0 1rem'
                                                                alignItems='flex-start'
                                                                width='22.5rem'
                                                            >
                                                                <ProductName
                                                                    to={`/room/${bookingDetail.roomId}`}
                                                                >
                                                                    {bookingDetail.roomName}
                                                                </ProductName>
                                                            </Flex>
                                                        </ProductLeft>
                                                    </td>
                                                    <td>
                                                        <MyNumberForMat
                                                            price={bookingDetail.pricePerDay}
                                                        />
                                                    </td>
                                                    <td>{bookingDetail.checkinDate}</td>
                                                    <td>{bookingDetail.checkoutDate}</td>
                                                    <td>
                                                        <MyNumberForMat
                                                            price={bookingDetail.siteFee}
                                                        />
                                                    </td>
                                                    <td>
                                                        <MyNumberForMat
                                                            price={bookingDetail.cleanFee}
                                                        />
                                                    </td>
                                                    <td>
                                                        <FinalPrice>
                                                            <MyNumberForMat
                                                                price={bookingDetail.totalFee}
                                                            />
                                                        </FinalPrice>
                                                    </td>
                                                    <td>
                                                        <Button
                                                            variant='outlined'
                                                            color='error'
                                                            onClick={handleDeleteBookingDetail}
                                                            data-booking-detail-id={
                                                                bookingDetail.bookingDetailId
                                                            }
                                                        >
                                                            Xóa
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    ))}
                                </tbody>
                            </table>

                            <BuyProductBar>
                                <ContentContainer>
                                    <WhiteBgWrapper>
                                        <Flex width='100%'>
                                            <Flex style={{ flex: "1", maxWidth: "45%" }}></Flex>
                                            <Flex
                                                style={{ flex: "1", maxWidth: "70%" }}
                                                justifyContent='flex-end'
                                            >
                                                <Flex flexDirection='row' alignItems='flex-end'>
                                                    <TotalPay className='first'>
                                                        <span>Tổng thanh toán:</span>
                                                        &nbsp;
                                                        <FinalPrice>
                                                            {finalPrice > 0 && (
                                                                <MyNumberForMat
                                                                    price={finalPrice}
                                                                />
                                                            )}
                                                        </FinalPrice>
                                                    </TotalPay>
                                                </Flex>
                                                <BuyButton onClick={handleProcessToOrder}>
                                                    Đặt phòng
                                                </BuyButton>
                                            </Flex>
                                        </Flex>
                                    </WhiteBgWrapper>
                                </ContentContainer>
                            </BuyProductBar>
                        </div>
                    ) : (
                        <h2 style={{ textAlign: "center" }}>Không có đơn đặt phòng</h2>
                    )}
                </div>
            </div>
            <Toast />
        </>
    );
};

export default CartPage;
