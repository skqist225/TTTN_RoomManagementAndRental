package com.airtnt.airtntapp.booking;

import java.text.ParseException;
import java.util.*;

import javax.mail.MessagingException;
import javax.mail.internet.AddressException;

import com.airtnt.airtntapp.booking.dto.*;
import com.airtnt.airtntapp.bookingDetail.BookingDetailService;
import com.airtnt.airtntapp.exception.*;
import com.airtnt.airtntapp.user.UserRepository;
import com.airtnt.entity.*;
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

import com.airtnt.airtntapp.email.SendEmail;
import com.airtnt.airtntapp.firebase.FirebaseInitialize;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.airtntapp.response.error.ForbiddenResponse;
import com.airtnt.airtntapp.response.error.NotFoundResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.airtntapp.review.ReviewService;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.airtntapp.security.UserDetailsImpl;

@RestController
@RequestMapping("/api/booking")
public class BookingRestController {

	@Autowired
	private RoomService roomService;

	@Autowired
	private BookingService bookingService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private FirebaseInitialize firebaseInitialize;

	@Autowired
	private ReviewService reviewService;

	@Autowired
	private BookingDetailService bookingDetailService;

	@PostMapping(value = "create")
	public ResponseEntity<StandardJSONResponse<BookingDTO>> createBooking(
			@AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
			 @RequestBody CreateBookingDTO createBookingDTO)
			throws ParseException {
		try {
			List<User> users =(List<User>) userRepository.findAll();
			User customer = userDetailsImpl.getUser();
			String userToken = UUID.randomUUID().toString();
			Random rand = new Random();
			User randomElement = users.get(rand.nextInt(users.size()));

			Booking booking = bookingService.createBooking(createBookingDTO,
					customer, userToken);

			if (booking != null) {
				return new OkResponse<BookingDTO>(BookingDTO.build(booking)).response();
			}

			return new BadResponse<BookingDTO>("Cannot create booking").response();
		} catch (ParseException | RoomNotFoundException | RoomHasBeenBookedException
				| UserHasBeenBookedThisRoomException | ReserveDateInThePastException e) {
			return new BadResponse<BookingDTO>(e.getMessage()).response();
		}
	}

	@GetMapping(value = "/listings/{page}")
	public ResponseEntity<StandardJSONResponse<BookingListDTO>> listings(
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

//		BookingListResponse bookings = bookingDetailService.getBookingListByRooms(roomIds, filters, page);

		return new OkResponse<BookingListDTO>(null).response();

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
			} catch (CancelDateGreaterThanCheckinDateException e) {
				throw new RuntimeException(e);
			} catch (BookingDetailNotFoundException e) {
				return new BadResponse<String>(e.getMessage()).response();
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

			return booking != null ? new OkResponse<String>("Approve booking successfully").response()
					: new BadResponse<String>("Can not approve booking").response();

		} catch (ForbiddenException e) {
			return new ForbiddenResponse<String>().response();
		}
	}

	@PostMapping(value = "/{bookingDetailId}/create-review")
	public ResponseEntity<StandardJSONResponse<String>> approveBooking(
			@PathVariable("bookingDetailId") Integer bookingDetailId,
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

		BookingDetail bookingDetail = null;
		try {
			bookingDetail = bookingDetailService.findById(bookingDetailId);

			if (bookingDetail.getReview() != null) {
				Review review = bookingDetail.getReview();
				review.setSubRating(subRating);
				review.setComment(createReviewDTO.getRatingComment());

				reviewService.updateReview(review);
			} else {
				Review review = Review.builder().comment(createReviewDTO.getRatingComment()).subRating(subRating)
						.bookingDetail(bookingDetail).build();

				reviewService.createReview(review);
			}

			return new OkResponse<String>("OK").response();
		} catch (BookingDetailNotFoundException e) {
			return new BadResponse<String>(e.getMessage()).response();
		}
	}
}
