import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    bookingState,
    fetchUserBookedOrders,
    makeReview,
} from "../../features/booking/bookingSlice";
import { callToast, getImage } from "../../helpers";
import { BookingDetail } from "../../types/booking/type_Booking";
import { IRatingLabel } from "../../types/user/type_User";
import $ from "jquery";
import { Image } from "../../globalStyle";

interface IReviewRoom {
    bookingDetail: BookingDetail;
}

// let cleanlinessRating2 = 0,
//     contactRating2 = 0,
//     checkinRating2 = 0,
//     accuracyRating2 = 0,
//     locationRating2 = 0,
//     valueRating2 = 0;

const ReviewRoom: FC<IReviewRoom> = ({ bookingDetail }) => {
    const dispatch = useDispatch();
    const [ratingComment, setRatingComment] = useState<null | string>(null);
    const [ratingComment2, setRatingComment2] = useState("");
    const [cleanlinessRating, setCleanlinessRating] = useState(0);
    const [accuracyRating, setAccuracyRating] = useState(0);
    const [contactRating, setContactRating] = useState(0);
    const [locationRating, setLocationRating] = useState(0);
    const [checkinRating, setCheckinRating] = useState(0);
    const [valueRating, setValueRating] = useState(0);

    useEffect(() => {
        if (bookingDetail.review && bookingDetail.review.comment) {
            setRatingComment(bookingDetail.review.comment);
        }
    }, []);

    const { createReviewSuccess } = useSelector(bookingState);

    useEffect(() => {
        if (createReviewSuccess) {
            hideEditThumbnailBox();
            dispatch(fetchUserBookedOrders());
        }
    }, [createReviewSuccess]);

    const ratingLabels: IRatingLabel[] = [
        {
            label: "Mức độ sạch sẽ",
            stars: [1, 2, 3, 4, 5],
        },
        {
            label: "Độ chính xác",
            stars: [1, 2, 3, 4, 5],
        },
        { label: "Liên lạc", stars: [1, 2, 3, 4, 5] },
        {
            label: "Vị trí",
            stars: [1, 2, 3, 4, 5],
        },
        {
            label: "Nhận phòng",
            stars: [1, 2, 3, 4, 5],
        },
        {
            label: "Giá trị",
            stars: [1, 2, 3, 4, 5],
        },
    ];

    function reviewSubmit(event: any) {
        const bookingId = $(event.currentTarget).data("booking-id");

        if (!ratingComment2) {
            callToast("warning", "Vui lòng để lại bình luận!");
            return;
        }

        dispatch(
            makeReview({
                bookingId,
                cleanlinessRating: cleanlinessRating,
                contactRating: contactRating,
                checkinRating: checkinRating,
                accuracyRating: accuracyRating,
                locationRating: locationRating,
                valueRating: valueRating,
                ratingComment: ratingComment2,
            })
        );
    }

    function handleLike() {
        $(".ratingStar").each(function () {
            $(this)
                .off("click")
                .on("click", function () {
                    if (bookingDetail.review !== null) {
                        return;
                    }

                    const starValue = $(this).data("star-value") * 1;
                    const ratingName = $(this).parent().parent().parent().data("rating-name");
                    let isHavingGreaterRating = false;

                    if ($(this).hasClass("selected")) {
                        $(this)
                            .parent()
                            .siblings()
                            .each(function () {
                                if (
                                    $(this).children(".ratingStar").data("star-value") * 1 >
                                        starValue &&
                                    $(this).children(".ratingStar").hasClass("selected")
                                ) {
                                    $(this).children(".ratingStar").removeClass("selected");
                                    isHavingGreaterRating = true;
                                }
                            });

                        if (!isHavingGreaterRating) {
                            $(this)
                                .parent()
                                .siblings()
                                .each(function () {
                                    if (
                                        $(this).children(".ratingStar").data("star-value") * 1 <
                                        starValue
                                    ) {
                                        $(this).children(".ratingStar").removeClass("selected");
                                    }
                                });

                            $(this).removeClass("selected");
                        } else {
                            switch (ratingName) {
                                case "Mức độ sạch sẽ": {
                                    setCleanlinessRating(starValue);
                                    // cleanlinessRating2 = starValue;
                                    break;
                                }
                                case "Độ chính xác": {
                                    setAccuracyRating(starValue);
                                    // accuracyRating2 = starValue;
                                    break;
                                }
                                case "Liên lạc": {
                                    setContactRating(starValue);
                                    // contactRating2 = starValue;
                                    break;
                                }
                                case "Vị trí": {
                                    setLocationRating(starValue);
                                    // locationRating2 = starValue;
                                    break;
                                }
                                case "Nhận phòng": {
                                    setCheckinRating(starValue);
                                    // checkinRating2 = starValue;
                                    break;
                                }
                                case "Giá trị": {
                                    setValueRating(starValue);
                                    // valueRating2 = starValue;
                                    break;
                                }
                            }
                        }
                    } else {
                        $(this)
                            .parent()
                            .siblings()
                            .each(function () {
                                if (
                                    $(this).children(".ratingStar").data("star-value") * 1 <=
                                    starValue
                                )
                                    $(this).children(".ratingStar").addClass("selected");
                            });
                        $(this).addClass("selected");

                        switch (ratingName) {
                            case "Mức độ sạch sẽ": {
                                setCleanlinessRating(starValue);
                                console.log(starValue);
                                // cleanlinessRating2 = starValue;
                                break;
                            }
                            case "Độ chính xác": {
                                setAccuracyRating(starValue);
                                console.log(starValue);
                                // accuracyRating2 = starValue;
                                break;
                            }
                            case "Liên lạc": {
                                setContactRating(starValue);
                                console.log(starValue);
                                // contactRating2 = starValue;
                                break;
                            }
                            case "Vị trí": {
                                setLocationRating(starValue);
                                console.log(starValue);
                                // locationRating2 = starValue;
                                break;
                            }
                            case "Nhận phòng": {
                                setCheckinRating(starValue);
                                console.log(starValue);
                                // checkinRating2 = starValue;
                                break;
                            }
                            case "Giá trị": {
                                setValueRating(starValue);
                                console.log(starValue);
                                // valueRating2 = starValue;
                                break;
                            }
                        }
                    }
                });
        });
    }

    function displayEditThumbnailBox(self: JQuery<HTMLElement>) {
        //find matching booking id and open up review section.
        console.log(self.data("booking-id"));
        $(".chooseRoomThumbnail").each(function () {
            if (parseInt($(this).data("booking-id")) === parseInt(self.data("booking-id"))) {
                $(this).addClass("active");
                $("#user-bookings__mainContainer").addClass("unactive");
            }
        });
        if (self.data("rating-comment")) {
        } else {
            handleLike();
        }

        $(".ratingContainer", ".chooseRoomThumbnail.active").each(function () {
            const cleanliness = parseInt($(this).data("rating-cleanliness"));
            const contact = parseInt($(this).data("rating-contact"));
            const checkin = parseInt($(this).data("rating-checkin"));
            const accuracy = parseInt($(this).data("rating-accuracy"));
            const location = parseInt($(this).data("rating-location"));
            const value = parseInt($(this).data("rating-value"));

            setCleanlinessRating(cleanliness);
            setContactRating(contact);
            setCheckinRating(checkin);
            setAccuracyRating(accuracy);
            setLocationRating(location);
            setValueRating(value);

            $(".ratingStarContainer").each(function () {
                const children = $(this).children();
                const label = $(this).data("label");

                switch (label) {
                    case "Mức độ sạch sẽ": {
                        children.each(function () {
                            if (
                                $(this).children(".ratingStar").data("star-value") * 1 <=
                                cleanliness
                            ) {
                                $(this).children(".ratingStar").addClass("selected");
                            }
                        });
                        break;
                    }
                    case "Độ chính xác": {
                        children.each(function () {
                            if ($(this).children(".ratingStar").data("star-value") * 1 <= accuracy)
                                $(this).children(".ratingStar").addClass("selected");
                        });
                        break;
                    }
                    case "Liên lạc": {
                        children.each(function () {
                            if ($(this).children(".ratingStar").data("star-value") * 1 <= contact)
                                $(this).children(".ratingStar").addClass("selected");
                        });
                        break;
                    }
                    case "Vị trí": {
                        children.each(function () {
                            if ($(this).children(".ratingStar").data("star-value") * 1 <= location)
                                $(this).children(".ratingStar").addClass("selected");
                        });
                        break;
                    }
                    case "Nhận phòng": {
                        children.each(function () {
                            if ($(this).children(".ratingStar").data("star-value") * 1 <= checkin)
                                $(this).children(".ratingStar").addClass("selected");
                        });
                        break;
                    }
                    case "Giá trị": {
                        children.each(function () {
                            if ($(this).children(".ratingStar").data("star-value") * 1 <= value)
                                $(this).children(".ratingStar").addClass("selected");
                        });
                        break;
                    }
                }
            });
        });
    }

    function hideEditThumbnailBox() {
        $(".chooseRoomThumbnail").removeClass("active");
        $("#user-bookings__mainContainer").removeClass("unactive");
    }

    function handleSetRatingComment(event: any) {
        setRatingComment2(event.currentTarget.value);
    }

    return (
        <>
            <button
                className='button bg-normal'
                data-booking-id={bookingDetail.bookingDetailId}
                onClick={e => displayEditThumbnailBox($(e.currentTarget))}
                data-rating-comment={bookingDetail.review}
            >
                {bookingDetail.review !== null ? "Xem đánh giá" : "Đánh giá"}
            </button>
            <div className='chooseRoomThumbnail' data-booking-id={bookingDetail.bookingId}>
                <div className='flex jc-center h-100'>
                    <div className='innerWrapper'>
                        <div id='boxHeader' className='normal-flex'>
                            <div
                                onClick={() => {
                                    hideEditThumbnailBox();
                                }}
                            >
                                <Image
                                    src={getImage("/svg/close2.svg")}
                                    size='16px'
                                    style={{ cursor: "pointer" }}
                                />
                            </div>
                            <div className='manage-photos__title f1 flex jc-center'>
                                Đánh giá phòng
                            </div>
                        </div>
                        <div id='boxBody'>
                            <div className='col-flex'>
                                <div className='normal-flex'>
                                    <div>
                                        <Image
                                            src={getImage(bookingDetail.roomThumbnail)}
                                            size='50px'
                                        />
                                    </div>
                                    <div>
                                        <div
                                            className='
                                                                                user-bookings__room-name
                                                                            '
                                        >
                                            {bookingDetail.roomName}
                                        </div>
                                        <div>
                                            <div className='fs-14 717171'>
                                                {bookingDetail.roomCategory}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                data-rating-cleanliness={
                                    bookingDetail.review !== null
                                        ? bookingDetail.review.subRating.cleanliness
                                        : 0
                                }
                                data-rating-contact={
                                    bookingDetail.review !== null
                                        ? bookingDetail.review.subRating.contact
                                        : 0
                                }
                                data-rating-checkin={
                                    bookingDetail.review !== null
                                        ? bookingDetail.review.subRating.checkin
                                        : 0
                                }
                                data-rating-accuracy={
                                    bookingDetail.review !== null
                                        ? bookingDetail.review.subRating.accuracy
                                        : 0
                                }
                                data-rating-location={
                                    bookingDetail.review !== null
                                        ? bookingDetail.review.subRating.location
                                        : 0
                                }
                                data-rating-value={
                                    bookingDetail.review !== null
                                        ? bookingDetail.review.subRating.value
                                        : 0
                                }
                                className='ratingContainer'
                            >
                                {ratingLabels.map(rating => (
                                    <div
                                        className='normal-flex jc-sb'
                                        data-rating-name={rating.label}
                                        key={rating.label}
                                    >
                                        <label>{rating.label}</label>
                                        <div
                                            className='
                                                                                normal-flex
                                                                                ratingStarContainer
                                                                            '
                                            data-label={rating.label}
                                        >
                                            {rating.stars.map((star, idx) => (
                                                <div>
                                                    <svg
                                                        enableBackground='new 0 0 15 15'
                                                        viewBox='0 0 15 15'
                                                        x='0'
                                                        y='0'
                                                        data-star-value={idx + 1}
                                                        className='
                                                                                            ratingStar
                                                                                        '
                                                        key={star + idx + 1}
                                                    >
                                                        <polygon
                                                            points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                                                            strokeLinecap='round'
                                                            strokeLinejoin='round'
                                                            strokeMiterlimit='10'
                                                        ></polygon>
                                                    </svg>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div>
                                    <label className='form-label'>Bình luận:</label>
                                    {ratingComment !== null ? (
                                        <input
                                            type='text'
                                            id='ratingComment'
                                            name='ratingComment'
                                            value={ratingComment}
                                            readOnly
                                        />
                                    ) : (
                                        <input
                                            type='text'
                                            id='ratingComment'
                                            name='ratingComment'
                                            value={ratingComment2}
                                            onChange={handleSetRatingComment}
                                            disabled={!!ratingComment}
                                            placeholder='Để lại bình luận ở đây!'
                                            required
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div id='boxFooter' className='flex-space'>
                            <div>
                                <button
                                    className='
                                                                        manage-photos__cancel-btn
                                                                    '
                                    onClick={() => {
                                        hideEditThumbnailBox();
                                    }}
                                >
                                    Hủy
                                </button>
                            </div>
                            <div>
                                <button
                                    className='
                                                                        manage-photos__save-edit-btn
                                                                    '
                                    data-booking-id={bookingDetail.bookingId}
                                    onClick={reviewSubmit}
                                    disabled={bookingDetail.review !== null}
                                >
                                    Đánh giá
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReviewRoom;
