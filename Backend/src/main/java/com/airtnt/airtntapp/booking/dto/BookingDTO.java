package com.airtnt.airtntapp.booking.dto;

import java.time.LocalDateTime;

import com.airtnt.entity.Booking;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookingDTO {
	private Integer id;
	@JsonFormat(pattern = "dd-MM-yyyy")
	private LocalDateTime bookingDate;
	private String currencySymbol;
	private long lastUpdated;

	public static BookingDTO build(Booking booking) {
		return BookingDTO.builder().id(booking.getId()).bookingDate(booking.getBookingDate())
				.currencySymbol(booking.getRoom().getCurrency().getSymbol()).lastUpdated(booking.getLastUpdated())
				.build();
	}
}
