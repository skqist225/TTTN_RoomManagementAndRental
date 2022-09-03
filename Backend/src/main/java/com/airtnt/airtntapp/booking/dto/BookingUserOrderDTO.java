package com.airtnt.airtntapp.booking.dto;

import com.airtnt.entity.Booking;
import com.airtnt.entity.Status;
import com.airtnt.entity.User;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookingUserOrderDTO {
    private Integer id;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDateTime bookingDate;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDateTime cancelDate;
    private Float refundPaid;
    private Set<BookingDetailDTO> bookingDetails = new HashSet<>();
    private Integer hostId;
    private String hostFullName;
    private float totalPrice;
    private Status state;
    private String customerFullName;
    private String customerAvatar;
    private boolean canDoAction;

    public static BookingUserOrderDTO build(Booking booking){
        User host = booking.getBookingDetails().iterator().next().getRoom().getHost();

        return BookingUserOrderDTO.builder()
                .id(booking.getId())
                .bookingDate(booking.getBookingDate())
                .cancelDate(booking.getCancelDate())
                .refundPaid(booking.getRefundPaid())
                .bookingDetails(booking.getBookingDetails().stream().map(BookingDetailDTO::build
                ).collect(Collectors.toSet()))
                .hostId(host.getId())
                .hostFullName(host.getFullName())
                .totalPrice(booking.getTotalFee())
                .state(booking.determineStatus())
                .customerFullName(booking.getCustomer().getFullName())
                .customerAvatar(booking.getCustomer().getAvatarPath())
                .canDoAction(!Objects.equals(booking.determineStatus(), Status.OUTOFDATE))
                .build();
    }
}
