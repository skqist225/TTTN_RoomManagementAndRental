package com.airtnt.airtntapp.booking;

import java.text.ParseException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.mail.MessagingException;
import javax.mail.internet.AddressException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.airtnt.airtntapp.booking.dto.BookingDTO;
import com.airtnt.airtntapp.booking.dto.BookingListResponse;
import com.airtnt.airtntapp.booking.dto.CreateReviewDTO;
import com.airtnt.airtntapp.email.SendEmail;
import com.airtnt.airtntapp.exception.AlreadyCancelException;
import com.airtnt.airtntapp.exception.BookingNotFoundException;
import com.airtnt.airtntapp.exception.ForbiddenException;
import com.airtnt.airtntapp.exception.RoomHasBeenBookedException;
import com.airtnt.airtntapp.exception.RoomNotFoundException;
import com.airtnt.airtntapp.exception.UserHasBeenBookedThisRoomException;
import com.airtnt.airtntapp.firebase.FirebaseInitialize;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.airtntapp.response.error.ForbiddenResponse;
import com.airtnt.airtntapp.response.error.NotFoundResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.airtntapp.review.ReviewService;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.airtntapp.security.UserDetailsImpl;
import com.airtnt.entity.Booking;
import com.airtnt.entity.Review;
import com.airtnt.entity.SubRating;
import com.airtnt.entity.User;

@RestController
@RequestMapping("/api/booking")
public class BookingRestController {

	@Autowired
	private RoomService roomService;

	@Autowired
	private BookingService bookingService;

	@Autowired
	private FirebaseInitialize firebaseInitialize;

	@Autowired
	private ReviewService reviewService;

	@GetMapping(value = "/{roomid}/create")
	public ResponseEntity<StandardJSONResponse<BookingDTO>> createBooking(
			@AuthenticationPrincipal UserDetailsImpl userDetailsImpl, @PathVariable("roomid") Integer roomId,
			@RequestParam("checkin") String checkin, @RequestParam("checkout") String checkout,
			@RequestParam("clientMessage") String clientMessage) throws ParseException {
		String errorMessage = "";
		try {
			User customer = userDetailsImpl.getUser();
			String userToken = UUID.randomUUID().toString();
			Booking booking;

			booking = bookingService.createBooking(checkin, checkout, roomService.getRoomById(roomId), clientMessage,
					customer, userToken);

			// if (booking != null) {
			// firebaseInitialize.initialize();
			// firebaseInitialize.writeBooking(booking.getId(), booking.getUserToken(),
			// "Pending");
			// }
			if (booking != null) {
				return new OkResponse<BookingDTO>(BookingDTO.build(booking)).response();
			}

			return new BadResponse<BookingDTO>("Cannot create booking").response();
		} catch (ParseException e) {
			errorMessage = e.getMessage();
		} catch (RoomNotFoundException e) {
			errorMessage = e.getMessage();
		} catch (RoomHasBeenBookedException e) {
			errorMessage = e.getMessage();
		} catch (UserHasBeenBookedThisRoomException e) {
			errorMessage = e.getMessage();
		}

		return new BadResponse<BookingDTO>(errorMessage).response();
	}

	@GetMapping(value = "/{roomid}/create-mobile")
	public ResponseEntity<StandardJSONResponse<BookingDTO>> createBookingMobile(
			@AuthenticationPrincipal UserDetailsImpl userDetailsImpl, @PathVariable("roomid") Integer roomId,
			@RequestParam("checkin") String checkin, @RequestParam("checkout") String checkout,
			@RequestParam("cardNumber") String cardNumber, @RequestParam("cardExp") String cardExp,
			@RequestParam("cardCVV") String cardCVV, @RequestParam("clientMessage") String clientMessage)
			throws ParseException {
		String errorMessage = "";
		try {
			User customer = userDetailsImpl.getUser();
			String userToken = UUID.randomUUID().toString();
			if (!cardNumber.equals("4242424242424242")) {
				return new BadResponse<BookingDTO>("Card number does not correct").response();
			}
			if (!cardExp.equals("240224")) {
				return new BadResponse<BookingDTO>("Card exp does not correct").response();
			}
			if (!cardCVV.equals("424")) {
				return new BadResponse<BookingDTO>("Card CVV does not correct").response();
			}

			Booking booking;
			booking = bookingService.createBooking(checkin, checkout, roomService.getRoomById(roomId), clientMessage,
					customer, userToken);

			if (booking != null) {
				return new OkResponse<BookingDTO>(BookingDTO.build(booking)).response();
			}

			return new BadResponse<BookingDTO>("Cannot create booking").response();
		} catch (ParseException e) {
			errorMessage = e.getMessage();
		} catch (RoomNotFoundException e) {
			errorMessage = e.getMessage();
		} catch (RoomHasBeenBookedException e) {
			errorMessage = e.getMessage();
		} catch (UserHasBeenBookedThisRoomException e) {
			errorMessage = e.getMessage();
		}
		return new BadResponse<BookingDTO>(errorMessage).response();
	}

	@GetMapping(value = "/listings/{page}")
	public ResponseEntity<StandardJSONResponse<BookingListResponse>> listings(
			@AuthenticationPrincipal UserDetailsImpl userDetailsImpl, @PathVariable("page") Integer page,
			@RequestParam(name = "booking_date_month", required = false, defaultValue = "") String bookingDateMonth,
			@RequestParam(name = "booking_date_year", required = false, defaultValue = "") String bookingDateYear,
			@RequestParam(name = "total_fee", required = false, defaultValue = "0") String totalFee,
			@RequestParam(name = "query", required = false, defaultValue = "") String query,
			@RequestParam(name = "sort_dir", required = false, defaultValue = "desc") String sortDir,
			@RequestParam(name = "sort_field", required = false, defaultValue = "bookingDate") String sortField,
			@RequestParam(name = "booking_date", required = false, defaultValue = "") String bookingDate,
			@RequestParam(name = "is_complete", required = false, defaultValue = "") String isComplete)
			throws ParseException {
		User host = userDetailsImpl.getUser();

		List<Integer> roomIds = roomService.getRoomIdByHost(host);

		Map<String, String> filters = new HashMap<>();
		filters.put("sortField", sortField);
		filters.put("sortDir", sortDir);
		filters.put("query", query);
		filters.put("isComplete", isComplete);
		filters.put("bookingDate", bookingDate);
		filters.put("bookingDateMonth", bookingDateMonth);
		filters.put("bookingDateYear", bookingDateYear);
		filters.put("totalFee", totalFee);

		BookingListResponse bookings = bookingService.getBookingListByRooms(roomIds, filters, page);

		return new OkResponse<BookingListResponse>(bookings).response();

	}

	@PutMapping(value = "/{bookingid}/host/canceled")
	public ResponseEntity<StandardJSONResponse<String>> hostCancelBooking(@PathVariable("bookingid") Integer bookingid,
			@AuthenticationPrincipal UserDetailsImpl userDetailsImpl) throws ForbiddenException {
		try {
			User host = userDetailsImpl.getUser();
			Booking booking;
			booking = bookingService.hostCancelBooking(bookingid, host);

			// firebaseInitialize.initialize();
			// firebaseInitialize.updateBookingState(booking.getId(), "Rejected");

			return booking != null ? new OkResponse<String>("Cancel booking successfully").response()
					: new BadResponse<String>("Can not cancel booking").response();
		} catch (BookingNotFoundException e) {
			return new NotFoundResponse<String>(e.getMessage()).response();
		}

	}

	@PutMapping(value = "/{bookingid}/user/canceled")
	public ResponseEntity<StandardJSONResponse<String>> userCancelBooking(@PathVariable("bookingid") Integer bookingid,
			@AuthenticationPrincipal UserDetailsImpl userDetailsImpl) throws AddressException, MessagingException {
		try {
			User customer = userDetailsImpl.getUser();
			Booking booking;
			try {

				booking = bookingService.userCancelBooking(bookingid, customer);
				if (booking != null) {
					SendEmail.send(customer.getEmail(), "Cancel booking", "Cancel booking successfully");
				}

				return booking != null ? new OkResponse<String>("Cancel booking successfully").response()
						: new BadResponse<String>("Can not cancel booking").response();
			} catch (AlreadyCancelException e) {
				return new OkResponse<String>(e.getMessage()).response();
			} catch (BookingNotFoundException e) {
				return new NotFoundResponse<String>(e.getMessage()).response();
			}
		} catch (ForbiddenException e) {
			return new ForbiddenResponse<String>(e.getMessage()).response();
		}
	}

	@PutMapping(value = "/{bookingid}/approved")
	public ResponseEntity<StandardJSONResponse<String>> approveBooking(@PathVariable("bookingid") Integer bookingId,
			@AuthenticationPrincipal UserDetailsImpl userDetailsImpl) {
		try {
			User customer = userDetailsImpl.getUser();
			Booking booking = bookingService.approveBooking(bookingId, customer);

			// firebaseInitialize.initialize();
			// firebaseInitialize.updateBookingState(booking.getId(), "Successful");

			return booking != null ? new OkResponse<String>("Approve booking successfully").response()
					: new BadResponse<String>("Can not approve booking").response();

		} catch (ForbiddenException e) {
			return new ForbiddenResponse<String>().response();
		}
	}

	@PostMapping(value = "/{bookingId}/create-review")
	public ResponseEntity<StandardJSONResponse<String>> approveBooking(@PathVariable("bookingId") Integer bookingId,
			@RequestBody CreateReviewDTO createReviewDTO, @AuthenticationPrincipal UserDetailsImpl userDetailsImpl)
			throws ForbiddenException, BookingNotFoundException {
		User customer = userDetailsImpl.getUser();
		Integer cleanlinessRating = createReviewDTO.getCleanlinessRating();
		Integer contactRating = createReviewDTO.getContactRating();
		Integer checkinRating = createReviewDTO.getCheckinRating();
		Integer accuracyRating = createReviewDTO.getAccuracyRating();
		Integer locationRating = createReviewDTO.getLocationRating();
		Integer valueRating = createReviewDTO.getValueRating();

		SubRating subRating = SubRating.builder().cleanliness(cleanlinessRating).contact(contactRating)
				.checkin(checkinRating).accuracy(accuracyRating).location(locationRating).value(valueRating).build();

		Booking booking = bookingService.getBookingById(bookingId);
		if (booking.getReview() != null) {
			Review review = booking.getReview();
			review.setSubRating(subRating);
			review.setComment(createReviewDTO.getRatingComment());

			reviewService.updateReview(review);
		} else {
			Review review = Review.builder().comment(createReviewDTO.getRatingComment()).subRating(subRating)
					.booking(new Booking(bookingId)).build();

			reviewService.createReview(review);
		}

		return new OkResponse<String>("OK").response();

	}
}
