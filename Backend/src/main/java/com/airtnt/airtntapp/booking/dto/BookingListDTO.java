package com.airtnt.airtntapp.booking.dto;

import java.util.Date;
import java.io.Serializable;
import java.time.LocalDateTime;

import com.airtnt.entity.Booking;
import com.airtnt.entity.Room;
import com.airtnt.entity.Status;
import com.airtnt.entity.User;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.google.auto.value.AutoValue.Builder;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class BookingListDTO implements Serializable {
    private Integer bookingId;
    private Integer roomId;
    private String roomName;
    private String roomThumbnail;
    private String roomCurrency;

    private Status state;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime bookingDate;

    @JsonInclude(value = Include.NON_NULL)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime cancelDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date checkinDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date checkoutDate;

    private float pricePerDay;
    private long numberOfDays;
    private float siteFee;
    private float refundPaid;
    private float totalFee;

    private String customerName;
    private String customerAvatar;

    private String roomHostName;
    private String roomHostAvatar;

    public static BookingListDTO build(Booking booking) {
        Room room = booking.getRoom();
        User customer = booking.getCustomer();

        return new BookingListDTO(booking.getId(),
                room.getId(), room.getName(),
                room.renderThumbnailImage(),
                room.getCurrency().getSymbol(),
                booking.getState(),
                booking.getBookingDate(), booking.getCancelDate(), booking.getCheckinDate(),
                booking.getCheckoutDate(),
                room.getPrice(), booking.getNumberOfDays(), booking.getSiteFee(), booking.getRefundPaid(),
                booking.getTotalFee(),
                customer.getFullName(),
                customer.getAvatarPath(),
                room.getHost().getFullName(),
                room.getHost().getAvatarPath());
    }
}
