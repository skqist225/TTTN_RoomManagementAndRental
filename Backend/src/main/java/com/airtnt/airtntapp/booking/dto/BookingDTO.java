package com.airtnt.airtntapp.booking.dto;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.airtnt.entity.Booking;
import com.airtnt.entity.BookingDetail;
import com.airtnt.entity.Status;
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
	private Integer bookingId;
	private Status state;
	private String customerFullName;
	private String customerAvatar;
	private Integer customerId;
	private Set<BookingDetailDTO> bookingDetails;
	private float totalFee;

	public static BookingDTO build(Booking booking) {
		Set<BookingDetailDTO> bookingDetailDTOS = new HashSet<>();
		for(BookingDetail bookingDetail : booking.getBookingDetails()) {
			bookingDetailDTOS.add(BookingDetailDTO.build(bookingDetail));
		}

		return BookingDTO.builder().bookingId(booking.getId()).state(booking.getState())
				.customerAvatar(booking.getCustomer().getAvatarPath())
				.customerFullName(booking.getCustomer().getFullName())
				.customerId(booking.getCustomer().getId())
				.bookingDetails(bookingDetailDTOS)
				.totalFee(booking.getTotalFee())
				.build();
	}
}
