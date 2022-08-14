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
public class BookingDetailListDTO {
    private List<BookingDetailDTO> bookingDetails;
    private long totalElements;
    private long totalPages;
}
