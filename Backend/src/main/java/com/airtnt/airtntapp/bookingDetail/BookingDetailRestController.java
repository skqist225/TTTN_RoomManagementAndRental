package com.airtnt.airtntapp.bookingDetail;


import com.airtnt.airtntapp.booking.BookingService;
import com.airtnt.airtntapp.booking.dto.PostCreateBookingDetailDTO;
import com.airtnt.airtntapp.exception.BookingDetailNotFoundException;
import com.airtnt.airtntapp.exception.ConstrainstViolationException;
import com.airtnt.airtntapp.exception.RoomNotFoundException;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.airtntapp.response.error.ForbiddenResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.airtntapp.security.UserDetailsImpl;
import com.airtnt.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/bookingDetail")
public class BookingDetailRestController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingDetailService bookingDetailService;

    @Autowired
    private RoomService roomService;

    public LocalDateTime convertDateToLocalDateTime(Date date) {
        return date.toInstant().atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }

    @PostMapping("create")
    public ResponseEntity<StandardJSONResponse<BookingDetail>> createBookingDetail(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody PostCreateBookingDetailDTO postCreateBookingDetailDTO) throws ParseException {
        Integer roomId = postCreateBookingDetailDTO.getRoomId();
        String checkinDateStr = postCreateBookingDetailDTO.getCheckinDate();
        String checkoutDateStr = postCreateBookingDetailDTO.getCheckoutDate();

        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
        Date checkinDate = sdf.parse(checkinDateStr);
        Date checkoutDate = sdf.parse(checkoutDateStr);

        LocalDateTime checkinDateldt = convertDateToLocalDateTime(checkinDate);
        LocalDateTime bookingDateldt = convertDateToLocalDateTime(checkoutDate);
        LocalDateTime currentDate = LocalDateTime.now();

        if (checkinDateldt.isBefore(currentDate) || bookingDateldt.isBefore(currentDate)) {
            return new BadResponse<BookingDetail>("Invalid checkin date and checkout date as it before current date").response();
        }

        if (bookingDetailService.isBooked(checkinDate, checkoutDate, roomId)) {
            return new BadResponse<BookingDetail>("Invalid checkin date and checkout date as it before current date").response();
        }

        User customer = userDetails.getUser();
        List<Booking> cartBookings = bookingService.findByCustomerAndStatus(customer, Status.CART);

        BookingDetail bookingDetail = null;
        Booking existedBooking = null;
        BookingDetail savedBookingDetail = null;

        try {
            Room room = roomService.findById(roomId);
            User bookingDetailRoomHost = room.getHost();

            if (cartBookings.size() > 0) {
                for (Booking booking : cartBookings) {
                    User roomHost = booking.getBookingDetails().iterator().next().getRoom().getHost();
                    //bookingDetail have the same host will be in the same booking
                    if (Objects.equals(roomHost.getId(), bookingDetailRoomHost.getId())) {
                        for (BookingDetail bDetail : booking.getBookingDetails()) {
                            if (Objects.equals(bDetail.getRoom().getId(), postCreateBookingDetailDTO.getRoomId())) {
                                bookingDetail = bDetail;
                                break;
                            }
                        }

                        existedBooking = booking;
                    }
                }

                if (Objects.nonNull(bookingDetail)) {
                    bookingDetail.setCheckinDate(checkinDate);
                    bookingDetail.setCheckoutDate(checkoutDate);

                    savedBookingDetail = bookingDetailService.save(bookingDetail);
                } else {
                    bookingDetail = BookingDetail.builder().checkinDate(checkinDate).checkoutDate(checkoutDate).siteFee(room.getPrice() * 2 / 100)
                            .room(room).cleanFee(room.getPrice() * 3 / 100).build();

                    savedBookingDetail = bookingDetailService.save(bookingDetail);

                    if (Objects.isNull(existedBooking)) {
                        Booking booking = Booking.builder()
                                .customer(customer)
                                .state(Status.CART)
                                .bookingDate(LocalDateTime.now())
                                .build();

                        Booking savedBooking = bookingService.save(booking);

                        savedBookingDetail.setBooking(savedBooking);
                    } else {
                        savedBookingDetail.setBooking(existedBooking);
                    }
                    savedBookingDetail = bookingDetailService.save(savedBookingDetail);
                }
            } else {
                bookingDetail = BookingDetail.builder().checkinDate(checkinDate).checkoutDate(checkoutDate).siteFee(room.getPrice() * 2 / 100)
                        .room(room).cleanFee(room.getPrice() * 3 / 100).build();

                savedBookingDetail = bookingDetailService.save(bookingDetail);

                Booking booking = Booking.builder()
                        .customer(customer)
                        .state(Status.CART)
                        .bookingDate(LocalDateTime.now())
                        .build();

                Booking savedBooking = bookingService.save(booking);

                savedBookingDetail.setBooking(savedBooking);
                savedBookingDetail = bookingDetailService.save(savedBookingDetail);
            }

            return new OkResponse<BookingDetail>(savedBookingDetail).response();
        } catch (RoomNotFoundException e) {
            return new BadResponse<BookingDetail>(e.getMessage()).response();
        }
    }


    @DeleteMapping("{bookingDetailId}/delete")
    public ResponseEntity<StandardJSONResponse<String>> deleteBookingDetail(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable(value = "bookingDetailId") Integer bookingDetailId) {
        User customer = userDetails.getUser();
        try {
            BookingDetail bookingDetail = bookingDetailService.findById(bookingDetailId);
            if (!Objects.equals(bookingDetail.getBooking().getCustomer().getId(), customer.getId())) {
                return new ForbiddenResponse<String>("You are not the owner of this booking detail").response();
            }

            System.out.println(bookingDetailId);
            return new OkResponse<String>(bookingDetailService.deleteById(bookingDetailId)).response();

        } catch (BookingDetailNotFoundException | ConstrainstViolationException e) {
            return new BadResponse<String>(e.getMessage()).response();
        }
    }
}
