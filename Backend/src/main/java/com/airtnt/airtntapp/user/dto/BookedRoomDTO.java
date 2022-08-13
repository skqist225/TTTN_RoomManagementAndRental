package com.airtnt.airtntapp.user.dto;

import java.time.LocalDateTime;
import java.util.Date;

import com.airtnt.entity.Booking;
import com.airtnt.entity.Status;
import com.airtnt.entity.SubRating;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.google.auto.value.AutoValue.Builder;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookedRoomDTO {
    private Integer bookingId;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDateTime bookingDate;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date checkinDate;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date checkoutDate;

    private float pricePerDay;
    private long numberOfDays;
    private float siteFee;
    private Status state;

    private Integer roomId;
    private String roomThumbnail;
    private String roomName;
    private String hostName;
    private String hostAvatar;
    private String currency;
    private String privacyType;
    private String roomCategory;

    private String bookingReview;
    private SubRating reviewRating;

    public static BookedRoomDTO build(Booking b) {
        String roomThumbnail = b.getRoom().renderThumbnailImage();
        String userFullName = b.getRoom().getHost().getFullName();
        String userAvatar = b.getRoom().getHost().getAvatarPath();
        String bookingReview = null;
        SubRating reviewRating = null;

        if (b.getReview() != null) {
            bookingReview = b.getReview().getComment();
            reviewRating = b.getReview().getSubRating();
        }

        return new BookedRoomDTO(b.getId(), b.getBookingDate(), b.getCheckinDate(), b.getCheckoutDate(),
                b.getPricePerDay(), b.getNumberOfDays(),
                b.getSiteFee(), b.getState(), b.getRoom().getId(), roomThumbnail, b.getRoom().getName(),
                userFullName,
                userAvatar, b.getRoom().getCurrency().getSymbol(), b.getRoom().getPrivacyType().getName(),
                b.getRoom().getCategory().getName(),
                bookingReview, reviewRating);
    }
}
