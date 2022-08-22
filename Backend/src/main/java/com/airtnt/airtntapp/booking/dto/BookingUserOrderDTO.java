package com.airtnt.airtntapp.booking.dto;

import com.airtnt.entity.Booking;
import com.airtnt.entity.Status;
import com.airtnt.entity.User;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
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
    private Set<BookingDetailDTO> bookingDetails = new HashSet<>();
    private Integer hostId;
    private String hostFullName;
    private float totalPrice;
    private Status state;
    private String customerFullName;
    private String customerAvatar;

    public static BookingUserOrderDTO build(Booking booking) {
        User host = booking.getBookingDetails().iterator().next().getRoom().getHost();

        return BookingUserOrderDTO.builder()
                .id(booking.getId())
                .bookingDate(booking.getBookingDate())
                .bookingDetails(booking.getBookingDetails().stream().map(BookingDetailDTO::build
                ).collect(Collectors.toSet()))
                .hostId(host.getId())
                .hostFullName(host.getFullName())
                .totalPrice(booking.getTotalFee())
                .state(booking.determineStatus())
                .customerFullName(booking.getCustomer().getFullName())
                .customerAvatar(booking.getCustomer().getAvatarPath())
                .build();
    }
}
