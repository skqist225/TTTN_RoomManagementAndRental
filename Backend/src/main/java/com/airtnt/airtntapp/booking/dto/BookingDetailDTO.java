package com.airtnt.airtntapp.booking.dto;


import com.airtnt.entity.BookingDetail;
import com.airtnt.entity.Review;
import com.airtnt.entity.Room;
import com.airtnt.entity.Status;
import com.airtnt.entity.User;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookingDetailDTO {
    private Integer bookingDetailId;
    private Integer bookingId;
    private Integer roomId;
    private String roomName;
    private String roomThumbnail;
    private String roomCurrency;
    private String roomCategory;
    private Status state;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDateTime bookingDate;

    @JsonInclude(value = JsonInclude.Include.NON_NULL)
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDateTime cancelDate;

    private String checkinDate;

    private String checkoutDate;

    private float pricePerDay;
    private long numberOfDays;
    private float siteFee;
    private float cleanFee;
    private float refundPaid;
    private float totalFee;
    private String customerName;
    private String customerAvatar;
    private String roomHostName;
    private String roomHostAvatar;
    private Integer numberOfReviews;
    private Float averageRating;
    private Review review;

    public static BookingDetailDTO build(BookingDetail bookingDetail) {
        Room room = bookingDetail.getRoom();
        User customer = bookingDetail.getBooking().getCustomer();

        DateFormat outputFormatter = new SimpleDateFormat("dd-MM-yyyy");
        String checkinDateStr = outputFormatter.format(bookingDetail.getCheckinDate());
        String checkoutDateStr = outputFormatter.format(bookingDetail.getCheckoutDate());

        return BookingDetailDTO.builder()
                .bookingDetailId(bookingDetail.getId())
                .bookingId(bookingDetail.getId())
                .roomId(room.getId())
                .roomName(room.getName())
                .roomThumbnail(room.renderThumbnailImage())
                .roomCategory(room.getCategory().getName())
                .state(bookingDetail.getBooking().getState())
                .bookingDate(bookingDetail.getBooking().getBookingDate())
                .checkinDate(checkinDateStr)
                .checkoutDate(checkoutDateStr)
                .cancelDate(bookingDetail.getBooking().getCancelDate())
                .pricePerDay(room.getPrice())
                .numberOfDays(bookingDetail.getNumberOfDays())
                .siteFee(bookingDetail.getSiteFee())
                .cleanFee(bookingDetail.getCleanFee())
                .refundPaid(bookingDetail.getBooking().getRefundPaid())
                .totalFee(bookingDetail.getTotalFee())
                .customerAvatar(bookingDetail.getBooking().getCustomer().getAvatarPath())
                .customerName(customer.getFullName())
                .roomHostName(room.getHost().getFullName())
                .roomHostAvatar(room.getHost().getAvatarPath())
                .numberOfReviews(room.getNumberOfReviews())
                .averageRating(room.getAverageRatings())
                .roomCategory(room.getCategory().getName())
                .review(bookingDetail.getReview())
                .build();
    }
}
