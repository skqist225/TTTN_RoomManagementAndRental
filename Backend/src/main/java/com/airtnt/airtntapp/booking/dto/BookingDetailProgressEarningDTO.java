package com.airtnt.airtntapp.booking.dto;

import com.airtnt.entity.BookingDetail;
import com.airtnt.entity.Status;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookingDetailProgressEarningDTO {
	private Integer bookingId;
	private Status state;
	private String customerFullName;
	private String customerAvatar;
	private Integer customerId;
	private Set<BookingDetailDTO> bookingDetails;
	private float totalFee;

	public static BookingDetailProgressEarningDTO build(BookingDetail booking) {

		return BookingDetailProgressEarningDTO.builder().bookingId(booking.getId())
				.state(booking.getBooking().getState())
				.customerAvatar(booking.getBooking().getCustomer().getAvatarPath())
				.customerFullName(booking.getBooking().getCustomer().getFullName())
				.customerId(booking.getBooking().getCustomer().getId()).bookingDetails(null)
				.totalFee(booking.getTotalFee()).build();
	}
}
