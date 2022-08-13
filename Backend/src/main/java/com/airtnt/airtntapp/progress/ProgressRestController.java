package com.airtnt.airtntapp.progress;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.airtnt.airtntapp.booking.BookingService;
import com.airtnt.airtntapp.booking.dto.BookingDTO;
import com.airtnt.airtntapp.progress.dto.ProgressEarningsDTO;
import com.airtnt.airtntapp.progress.dto.ProgressReviewsDTO;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.airtntapp.review.ReviewService;
import com.airtnt.airtntapp.review.dto.ReviewDTO;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.airtntapp.security.UserDetailsImpl;
import com.airtnt.entity.Booking;
import com.airtnt.entity.Review;
import com.airtnt.entity.Room;
import com.airtnt.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/progress/")
public class ProgressRestController {

	@Autowired
	private RoomService roomService;

	@Autowired
	private BookingService bookingService;

	@Autowired
	private ReviewService reviewService;

	@GetMapping(value = "earnings")
	public ResponseEntity<StandardJSONResponse<ProgressEarningsDTO>> earnings(
			@AuthenticationPrincipal UserDetailsImpl userDetailsImpl, @Param("year") Integer year) {

		if (year == null) {
			return null;
		}

		User host = userDetailsImpl.getUser();
		List<Room> rooms = roomService.getRoomsByHost(host);
		Integer[] roomIds = new Integer[rooms.size()];

		for (int i = 0; i < rooms.size(); i++) {
			roomIds[i] = rooms.get(i).getId();
		}

		LocalDateTime startDate = LocalDateTime.of(year, 1, 1, 0, 0, 0);
		LocalDateTime endDate = LocalDateTime.of(year, 12, 31, 0, 0, 0);

		List<Booking> bookings = bookingService.getBookingsByRooms(roomIds, startDate, endDate);

		float totalFee = 0;
		Map<Integer, Float> feesInMonth = new HashMap<>();
		Map<Integer, Integer> numberOfBookingsInMonth = new HashMap<>();
		List<BookingDTO> bookingsDTO = new ArrayList<>();
		for (Booking booking : bookings) {
			float totalBookingFee = booking.getTotalFee();

			BookingDTO bookingDTO = BookingDTO.build(booking);
			bookingsDTO.add(bookingDTO);
			if (booking.getRoom().getCurrency().getSymbol().equals("$")) {
				totalFee += totalBookingFee * 22705;
			} else {
				totalFee += totalBookingFee;
			}

			Integer monthValue = booking.getBookingDate().getMonthValue();

			if (feesInMonth.containsKey(monthValue))
				feesInMonth.put(monthValue, totalBookingFee + feesInMonth.get(monthValue));
			else
				feesInMonth.put(monthValue, totalBookingFee);

			if (numberOfBookingsInMonth.containsKey(monthValue))
				numberOfBookingsInMonth.put(monthValue, 1 + numberOfBookingsInMonth.get(monthValue));
			else
				numberOfBookingsInMonth.put(monthValue, 1);
		}

		feesInMonth.entrySet().stream().sorted(Map.Entry.comparingByKey());
		numberOfBookingsInMonth.entrySet().stream().sorted(Map.Entry.comparingByKey());

		return new OkResponse<ProgressEarningsDTO>(
				new ProgressEarningsDTO(bookingsDTO, feesInMonth, numberOfBookingsInMonth, totalFee)).response();

	}

	@GetMapping(value = "reviews")
	public ResponseEntity<StandardJSONResponse<ProgressReviewsDTO>> reviews(
			@AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
			@RequestParam(name = "numberOfStars", required = false, defaultValue = "0") String numberOfStars) {

		User host = userDetailsImpl.getUser();
		List<Room> rooms = roomService.getRoomsByHost(host);
		Integer[] roomIds = new Integer[rooms.size()];

		for (int i = 0; i < rooms.size(); i++) {
			roomIds[i] = rooms.get(i).getId();
		}

		List<Booking> bookings = bookingService.getBookingsByRooms(roomIds);
		Integer[] bookingIds = new Integer[bookings.size()];
		for (int i = 0; i < bookings.size(); i++)
			bookingIds[i] = bookings.get(i).getId();

		float finalRatings = 0;
		List<Review> reviews = reviewService.getReviewsByBookings(bookingIds, (double) Double.parseDouble(numberOfStars));

		if (reviews.isEmpty()) {
			finalRatings = 0;
		} else {
			for (Review r : reviews) {
				finalRatings += r.getFinalRating();
			}

			if (reviews.size() > 0) {
				finalRatings = finalRatings / reviews.size();
			}
		}

		List<ReviewDTO> reviewsDTO = new ArrayList<>();
		reviews.forEach(review -> reviewsDTO.add(ReviewDTO.build(review)));

		return new OkResponse<ProgressReviewsDTO>(new ProgressReviewsDTO(reviewsDTO, finalRatings)).response();
	}
}
