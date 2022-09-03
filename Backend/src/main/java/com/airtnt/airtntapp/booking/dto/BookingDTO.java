package com.airtnt.airtntapp.booking.dto;

import com.airtnt.entity.Booking;
import com.airtnt.entity.BookingDetail;
import com.airtnt.entity.Status;
import lombok.*;

import java.text.ParseException;
import java.util.HashSet;
import java.util.Set;

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

	public static BookingDTO build(Booking booking) throws ParseException {
		Set<BookingDetailDTO> bookingDetailDTOS = new HashSet<>();
		for(BookingDetail bookingDetail : booking.getBookingDetails()) {
			bookingDetailDTOS.add(BookingDetailDTO.build(bookingDetail));
		}
		
		return BookingDTO.builder().bookingId(booking.getId()).state(booking.determineStatus())
				.customerAvatar(booking.getCustomer().getAvatarPath())
				.customerFullName(booking.getCustomer().getFullName())
				.customerId(booking.getCustomer().getId())
				.bookingDetails(bookingDetailDTOS)
				.totalFee(booking.getTotalFee())
				.build();
	}
}
