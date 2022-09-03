package com.airtnt.airtntapp.user.dto;

import com.airtnt.entity.Booking;
import com.airtnt.entity.BookingDetail;
import com.airtnt.entity.Status;
import com.airtnt.entity.SubRating;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.google.auto.value.AutoValue.Builder;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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

    private Integer roomId;
    private String roomThumbnail;
    private String roomName;
    private String hostName;
    private String hostAvatar;
    private String privacyType;
    private String roomCategory;

    private String bookingReview;
    private SubRating reviewRating;
    private Status state;

    public static List<BookedRoomDTO> build(Booking booking) {
        Set<BookingDetail> bookingDetailsSet = booking.getBookingDetails();

        return bookingDetailsSet.stream().map(b -> {
            String roomThumbnail = b.getRoom().renderThumbnailImage();
            String userFullName = b.getRoom().getHost().getFullName();
            String userAvatar = b.getRoom().getHost().getAvatarPath();
            String bookingReview = null;
            SubRating reviewRating = null;

            if (b.getReview() != null) {
                bookingReview = b.getReview().getComment();
                reviewRating = b.getReview().getSubRating();
            }

            return new BookedRoomDTO(b.getId(), booking.getBookingDate(), b.getCheckinDate(), b.getCheckoutDate(),
                    b.getPricePerDay(), b.getNumberOfDays(),
                    b.getSiteFee(), b.getRoom().getId(), roomThumbnail, b.getRoom().getName(),
                    userFullName,
                    userAvatar, b.getRoom().getPrivacyType().getName(),
                    b.getRoom().getCategory().getName(),
                    bookingReview, reviewRating, b.getBooking().getState());

        }).collect(Collectors.toList());
    }
}
