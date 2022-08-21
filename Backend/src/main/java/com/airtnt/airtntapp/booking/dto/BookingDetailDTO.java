package com.airtnt.airtntapp.booking.dto;


import com.airtnt.entity.BookingDetail;
import com.airtnt.entity.Room;
import com.airtnt.entity.Status;
import com.airtnt.entity.User;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

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

    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date checkinDate;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date checkoutDate;

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

    public static BookingDetailDTO build(BookingDetail bookingDetail) {
        Room room = bookingDetail.getRoom();
        User customer = bookingDetail.getBooking().getCustomer();

        return BookingDetailDTO.builder()
                .bookingDetailId(bookingDetail.getId())
                .bookingId(bookingDetail.getId())
                .roomId(room.getId())
                .roomName(room.getName())
                .roomThumbnail(room.renderThumbnailImage())
                .roomCategory(room.getCategory().getName())
                .roomCurrency(room.getCurrency().getSymbol())
                .state(  bookingDetail.getBooking().getState())
                .bookingDate(bookingDetail.getBooking().getBookingDate())
                .checkinDate(bookingDetail.getCheckinDate())
                .checkoutDate(bookingDetail.getCheckoutDate())
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
                .build();
    }
}
