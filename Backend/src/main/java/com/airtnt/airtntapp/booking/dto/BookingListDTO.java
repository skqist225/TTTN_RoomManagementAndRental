package com.airtnt.airtntapp.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookingListDTO {
    private List<BookingUserOrderDTO> bookings;
    private long totalElements;
    private long totalPages;
}
