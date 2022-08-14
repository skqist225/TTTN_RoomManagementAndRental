package com.airtnt.airtntapp.bookingDetail;

import com.airtnt.airtntapp.booking.dto.BookingDetailDTO;
import com.airtnt.airtntapp.booking.dto.BookingDetailListDTO;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.airtntapp.security.UserDetailsImpl;
import com.airtnt.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminBookingDetailRestController {

	@Autowired
	private BookingDetailService bookingDetailService;


	@GetMapping(value = "bookingDetails")
	public ResponseEntity<StandardJSONResponse<BookingDetailListDTO>> listings(
			@AuthenticationPrincipal UserDetailsImpl userDetailsImpl, @RequestParam("page") Integer page, @RequestParam(value = "keyword", required = false) String keyword)
			throws ParseException {
		Page<BookingDetail> bookingsPage = bookingDetailService.getAllBookingDetails(page, keyword);

		List<BookingDetailDTO> bookingDetailDTOList  = new ArrayList<>();
		BookingDetailListDTO bookingDetailListDTO = new BookingDetailListDTO();

		for (BookingDetail bookingDetail : bookingsPage.getContent()) {
			bookingDetailDTOList.add(BookingDetailDTO.build(bookingDetail));
		}

		bookingDetailListDTO.setBookingDetails(bookingDetailDTOList);
		bookingDetailListDTO.setTotalPages(bookingsPage.getTotalPages());
		bookingDetailListDTO.setTotalElements(bookingsPage.getTotalElements());

		return new OkResponse<BookingDetailListDTO>(bookingDetailListDTO).response();
	}

//	@PostMapping(value = "/{bookingDetailId}/create-review")
//	public ResponseEntity<StandardJSONResponse<String>> approveBooking(@PathVariable("bookingDetailId") Integer bookingDetailId,
//			@RequestBody CreateReviewDTO createReviewDTO, @AuthenticationPrincipal UserDetailsImpl userDetailsImpl)
//			throws ForbiddenException, BookingNotFoundException {
//		User customer = userDetailsImpl.getUser();
//		Integer cleanlinessRating = createReviewDTO.getCleanlinessRating();
//		Integer contactRating = createReviewDTO.getContactRating();
//		Integer checkinRating = createReviewDTO.getCheckinRating();
//		Integer accuracyRating = createReviewDTO.getAccuracyRating();
//		Integer locationRating = createReviewDTO.getLocationRating();
//		Integer valueRating = createReviewDTO.getValueRating();
//
//		SubRating subRating = SubRating.builder().cleanliness(cleanlinessRating).contact(contactRating)
//				.checkin(checkinRating).accuracy(accuracyRating).location(locationRating).value(valueRating).build();
//
//		BookingDetail bookingDetail = null;
//		try {
//			bookingDetail = bookingDetailService.findById(bookingDetailId);
//
//			if (bookingDetail.getReview() != null) {
//				Review review = bookingDetail.getReview();
//				review.setSubRating(subRating);
//				review.setComment(createReviewDTO.getRatingComment());
//
//				reviewService.updateReview(review);
//			} else {
//				Review review = Review.builder().comment(createReviewDTO.getRatingComment()).subRating(subRating)
//						.bookingDetail(bookingDetail).build();
//
//				reviewService.createReview(review);
//			}
//
//			return new OkResponse<String>("OK").response();
//		} catch (BookingDetailNotFoundException e) {
//			return new BadResponse<String>(e.getMessage()).response();
//		}
//	}
}
