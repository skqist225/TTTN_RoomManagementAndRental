package com.airtnt.airtntapp.booking;

import java.util.ArrayList;
import java.util.List;

import com.airtnt.airtntapp.booking.dto.BookingDTO;
import com.airtnt.airtntapp.booking.dto.CountBookingDTO;
import com.airtnt.airtntapp.exception.BookingNotFoundException;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.entity.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.airtnt.airtntapp.booking.dto.BookingListDTO;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.success.OkResponse;

@RestController
@RequestMapping("/api/admin/")
public class AdminBookingRestController {
    @Autowired
    private BookingService bookingService;

    @GetMapping("bookings")
    public ResponseEntity<StandardJSONResponse<BookingListDTO>> getAllBookings(@RequestParam("page") int page,
            @RequestParam(value = "type", defaultValue = "all", required = false) String type) {
        Page<Booking> bookingsPage = bookingService.getAllBookings(page, type);

        List<BookingDTO> bookingListingsDTOs = new ArrayList<>();
        BookingListDTO bookingListResponse = new BookingListDTO();

        for (Booking booking : bookingsPage.getContent()) {
            bookingListingsDTOs.add(BookingDTO.build(booking));
        }

        bookingListResponse.setBookings(bookingListingsDTOs);
        bookingListResponse.setTotalPages(bookingsPage.getTotalPages());
        bookingListResponse.setTotalElements(bookingsPage.getTotalElements());

        return new OkResponse<BookingListDTO>(bookingListResponse).response();
    }

    @DeleteMapping("bookings/{bookingid}")
    public ResponseEntity<StandardJSONResponse<String>> deleteBooking(
            @PathVariable(value = "bookingid") Integer bookingId) throws BookingNotFoundException {
        if (bookingService.deleteById(bookingId)) {
            return new OkResponse<String>("Delete booking successfully").response();
        }

        return new BadResponse<String>("Can not delete booking").response();
    }

    @GetMapping("bookings/count")
    public ResponseEntity<StandardJSONResponse<CountBookingDTO>> getBookingState() throws BookingNotFoundException {
        return new OkResponse<CountBookingDTO>(bookingService.countBookingByState()).response();
    }
}
