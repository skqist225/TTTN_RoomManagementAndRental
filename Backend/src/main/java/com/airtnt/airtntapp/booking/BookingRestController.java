package com.airtnt.airtntapp.booking;

import com.airtnt.airtntapp.booking.dto.BookingDTO;
import com.airtnt.airtntapp.booking.dto.BookingListDTO;
import com.airtnt.airtntapp.booking.dto.BookingUserOrderDTO;
import com.airtnt.airtntapp.booking.dto.CountBookingDTO;
import com.airtnt.airtntapp.booking.dto.CreateBookingDTO;
import com.airtnt.airtntapp.booking.dto.CreateReviewDTO;
import com.airtnt.airtntapp.booking.dto.TransferToPendingBookingDTO;
import com.airtnt.airtntapp.booking.dto.TransferToPendingBookingElementDTO;
import com.airtnt.airtntapp.bookingDetail.BookingDetailService;
import com.airtnt.airtntapp.email.SendEmail;
import com.airtnt.airtntapp.exception.AlreadyCancelException;
import com.airtnt.airtntapp.exception.BookingDetailNotFoundException;
import com.airtnt.airtntapp.exception.BookingNotFoundException;
import com.airtnt.airtntapp.exception.CancelDateGreaterThanCheckinDateException;
import com.airtnt.airtntapp.exception.ForbiddenException;
import com.airtnt.airtntapp.exception.ReserveDateInThePastException;
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
import com.airtnt.entity.BookingDetail;
import com.airtnt.entity.Review;
import com.airtnt.entity.Status;
import com.airtnt.entity.SubRating;
import com.airtnt.entity.User;
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

import javax.mail.MessagingException;
import java.text.ParseException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

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

    @Autowired
    private BookingDetailService bookingDetailService;

    @PostMapping(value = "create")
    public ResponseEntity<StandardJSONResponse<BookingDTO>> createBooking(@AuthenticationPrincipal UserDetailsImpl userDetailsImpl, @RequestBody CreateBookingDTO createBookingDTO) throws ParseException {
        try {
            User customer = userDetailsImpl.getUser();

            Booking booking = bookingService.createBooking(createBookingDTO, customer);

            if (booking != null) {
                return new OkResponse<>(BookingDTO.build(booking)).response();
            }

            return new BadResponse<BookingDTO>("Cannot create booking").response();
        } catch (ParseException | RoomNotFoundException | RoomHasBeenBookedException |
                 UserHasBeenBookedThisRoomException | ReserveDateInThePastException e) {
            return new BadResponse<BookingDTO>(e.getMessage()).response();
        }
    }

    @GetMapping(value = "/listings/{page}")
    public ResponseEntity<StandardJSONResponse<BookingListDTO>> listings(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
            @PathVariable("page") Integer page,
            @RequestParam(name = "booking_date_month", required = false, defaultValue = "") String bookingDateMonth,
            @RequestParam(name = "booking_date_year", required = false, defaultValue = "") String bookingDateYear,
            @RequestParam(name = "total_fee", required = false, defaultValue = "0") String totalFee,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sort_dir", required = false, defaultValue = "desc") String sortDir,
            @RequestParam(name = "sort_field", required = false, defaultValue = "bookingDate") String sortField,
            @RequestParam(name = "booking_date", required = false, defaultValue = "") String bookingDate,
            @RequestParam(name = "is_complete", required = false, defaultValue = "") String isComplete) throws ParseException {
        User host = userDetailsImpl.getUser();

        List<Integer> roomIds = roomService.getRoomIdByHost(host);

        Map<String, String> filters = new HashMap<>();
        filters.put("query", query);
        filters.put("isComplete", isComplete);
        filters.put("bookingDateMonth", bookingDateMonth);
        filters.put("bookingDateYear", bookingDateYear);

        BookingListDTO bookings = bookingService.getBookingListByRooms(roomIds, filters, page, host.getId());

        return new OkResponse<>(bookings).response();
    }

    @GetMapping("count")
    public ResponseEntity<StandardJSONResponse<CountBookingDTO>> getBookingState( @AuthenticationPrincipal UserDetailsImpl userDetailsImpl) throws BookingNotFoundException {
        User host = userDetailsImpl.getUser();
        return new OkResponse<>(bookingService.countBookingByState(host.getId())).response();
    }

    @PutMapping(value = "/{bookingId}/host/canceled")
    public ResponseEntity<StandardJSONResponse<String>> hostCancelBooking(@PathVariable("bookingId") Integer bookingId, @AuthenticationPrincipal UserDetailsImpl userDetailsImpl) throws ForbiddenException {
        try {
            User host = userDetailsImpl.getUser();
            Booking booking;
            booking = bookingService.hostCancelBooking(bookingId, host);

            return booking != null ? new OkResponse<>("Cancel booking successfully").response() : new BadResponse<String>("Can not cancel booking").response();
        } catch (BookingNotFoundException e) {
            return new NotFoundResponse<String>(e.getMessage()).response();
        }
    }

    @PutMapping(value = "/{bookingId}/user/canceled")
    public ResponseEntity<StandardJSONResponse<String>> userCancelBooking(@PathVariable("bookingId") Integer bookingid, @AuthenticationPrincipal UserDetailsImpl userDetailsImpl) throws MessagingException {
        try {
            User customer = userDetailsImpl.getUser();
            Booking booking;
            try {

                booking = bookingService.userCancelBooking(bookingid, customer);
                if (booking != null) {
                    SendEmail.send(customer.getEmail(), "Cancel booking", "Cancel booking successfully");
                }

                return booking != null ? new OkResponse<>("Cancel booking successfully").response() : new BadResponse<String>("Can not cancel booking").response();
            } catch (AlreadyCancelException e) {
                return new OkResponse<>(e.getMessage()).response();
            } catch (BookingNotFoundException e) {
                return new NotFoundResponse<String>(e.getMessage()).response();
            } catch (CancelDateGreaterThanCheckinDateException e) {
                throw new RuntimeException(e);
            } catch (BookingDetailNotFoundException | ParseException e) {
                return new BadResponse<String>(e.getMessage()).response();
            } catch (ReserveDateInThePastException e) {
                return new BadResponse<String>(e.getMessage()).response();
            }
        } catch (ForbiddenException e) {
            return new ForbiddenResponse<String>(e.getMessage()).response();
        }
    }

    @PutMapping(value = "/{bookingid}/approved")
    public ResponseEntity<StandardJSONResponse<String>> approveBooking(@PathVariable("bookingid") Integer bookingId, @AuthenticationPrincipal UserDetailsImpl userDetailsImpl) {
        try {
            User customer = userDetailsImpl.getUser();
            Booking booking = bookingService.approveBooking(bookingId, customer);

            return booking != null ? new OkResponse<>("Approve booking successfully").response() : new BadResponse<String>("Can not approve booking").response();

        } catch (ForbiddenException e) {
            return new ForbiddenResponse<String>().response();
        }
    }

    @PostMapping(value = "/{bookingDetailId}/create-review")
    public ResponseEntity<StandardJSONResponse<String>> approveBooking(@PathVariable("bookingDetailId") Integer bookingDetailId, @RequestBody CreateReviewDTO createReviewDTO, @AuthenticationPrincipal UserDetailsImpl userDetailsImpl) {
        User customer = userDetailsImpl.getUser();
        Integer cleanlinessRating = createReviewDTO.getCleanlinessRating();
        Integer contactRating = createReviewDTO.getContactRating();
        Integer checkinRating = createReviewDTO.getCheckinRating();
        Integer accuracyRating = createReviewDTO.getAccuracyRating();
        Integer locationRating = createReviewDTO.getLocationRating();
        Integer valueRating = createReviewDTO.getValueRating();

        SubRating subRating = SubRating.builder().cleanliness(cleanlinessRating).contact(contactRating).checkin(checkinRating).accuracy(accuracyRating).location(locationRating).value(valueRating).build();

        BookingDetail bookingDetail = null;
        try {
            bookingDetail = bookingDetailService.findById(bookingDetailId);

            if (bookingDetail.getReview() != null) {
                Review review = bookingDetail.getReview();
                review.setSubRating(subRating);
                review.setComment(createReviewDTO.getRatingComment());

                reviewService.updateReview(review);
            } else {
                Review review = Review.builder().comment(createReviewDTO.getRatingComment()).subRating(subRating).bookingDetail(bookingDetail).build();

                Review savedReview = reviewService.createReview(review);

                bookingDetail.setReview(savedReview);
                bookingDetailService.save(bookingDetail);
            }

            return new OkResponse<>("OK").response();
        } catch (BookingDetailNotFoundException e) {
            return new BadResponse<String>(e.getMessage()).response();
        }
    }

    @GetMapping(value = "/user/orders")
    public ResponseEntity<StandardJSONResponse<List<BookingUserOrderDTO>>> fetchUserOrders(@AuthenticationPrincipal UserDetailsImpl userDetailsImpl) {
        User customer = userDetailsImpl.getUser();
        List<BookingUserOrderDTO> bookings = bookingService.findByCustomerAndCartStatus(customer).stream().map(booking -> BookingUserOrderDTO.build(booking)).collect(Collectors.toList());

        return new OkResponse<>(bookings).response();
    }

    @GetMapping(value = "/user/orders/selected")
    public ResponseEntity<StandardJSONResponse<List<BookingUserOrderDTO>>> fetchUserSelectedOrders(@AuthenticationPrincipal UserDetailsImpl userDetailsImpl) {
        User customer = userDetailsImpl.getUser();
        List<BookingUserOrderDTO> bookings = bookingService.findByCustomerAndState(customer, Status.CARTSELECTED).stream().map(BookingUserOrderDTO::build).collect(Collectors.toList());

        return new OkResponse<>(bookings).response();
    }

    @GetMapping(value = "/user/orders/booked")
    public ResponseEntity<StandardJSONResponse<List<BookingUserOrderDTO>>> fetchUserBookedOrders(@AuthenticationPrincipal UserDetailsImpl userDetailsImpl, @RequestParam(value = "query", required = false, defaultValue = "") String query) {
        User customer = userDetailsImpl.getUser();
        List<BookingUserOrderDTO> bookings = bookingService.findByCustomerAndBookedStatus(customer, query).stream().map(BookingUserOrderDTO::build).collect(Collectors.toList());

        return new OkResponse<>(bookings).response();
    }

    @GetMapping(value = "/updateBookingStatus")
    public ResponseEntity<StandardJSONResponse<String>> updateBookingStatus(@AuthenticationPrincipal UserDetailsImpl userDetailsImpl, @RequestParam("bookingIds") String bookingIdsStr) throws BookingNotFoundException {
        try {
            List<Integer> bookingIds = Arrays.stream(bookingIdsStr.split(",")).map(Integer::parseInt).collect(Collectors.toList());

            for (Integer booInteger : bookingIds) {
                Booking booking = bookingService.findById(booInteger);
                booking.setState(Status.CARTSELECTED);
                bookingService.save(booking);
            }

            return new OkResponse<>("Update Booking Status Successfully").response();
        } catch (Exception ex) {
            return new OkResponse<>(ex.getMessage()).response();
        }
    }

    @PostMapping(value = "/transferToPendingBooking")
    public ResponseEntity<StandardJSONResponse<String>> transferToPendingBooking(@AuthenticationPrincipal UserDetailsImpl userDetailsImpl, @RequestBody TransferToPendingBookingDTO transferToPendingBookingDTO) {
        try {
            for (TransferToPendingBookingElementDTO booInteger : transferToPendingBookingDTO.getPostData()) {
                Booking booking = bookingService.findById(booInteger.getId());
                booking.setState(Status.PENDING);
                if (Objects.nonNull(booInteger.getClientMessage())) {
                    booking.setClientMessage(booInteger.getClientMessage());
                }
                bookingService.save(booking);
            }

            return new OkResponse<>("Update Booking Status Successfully").response();
        } catch (Exception ex) {
            return new OkResponse<>(ex.getMessage()).response();
        }
    }
}
