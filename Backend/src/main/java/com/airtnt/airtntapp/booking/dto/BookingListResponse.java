package com.airtnt.airtntapp.booking.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookingListResponse {
    private List<BookingListDTO> bookings;
    private long totalElements;
    private long totalPages;
}
