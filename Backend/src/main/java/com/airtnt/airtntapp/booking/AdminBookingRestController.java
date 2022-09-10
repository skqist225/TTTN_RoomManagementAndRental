package com.airtnt.airtntapp.booking;

import com.airtnt.airtntapp.booking.dto.BookingListDTO;
import com.airtnt.airtntapp.booking.dto.CountBookingByMonthInYear;
import com.airtnt.airtntapp.booking.dto.CountBookingDTO;
import com.airtnt.airtntapp.booking.dto.RevenueByYearAndStatus;
import com.airtnt.airtntapp.exception.BookingNotFoundException;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.airtntapp.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/")
public class AdminBookingRestController {
    @Autowired
    private BookingService bookingService;

    @GetMapping(value = "/bookings/{page}")
    public ResponseEntity<StandardJSONResponse<BookingListDTO>> listings(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
            @PathVariable("page") Integer page,
            @RequestParam(name = "booking_date_month", required = false, defaultValue = "") String bookingDateMonth,
            @RequestParam(name = "booking_date_year", required = false, defaultValue = "") String bookingDateYear,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "is_complete", required = false, defaultValue = "") String isComplete) throws ParseException {
        Map<String, String> filters = new HashMap<>();
        filters.put("query", query);
        filters.put("isComplete", isComplete);
        filters.put("bookingDateMonth", bookingDateMonth);
        filters.put("bookingDateYear", bookingDateYear);

        BookingListDTO bookings = bookingService.getBookingListByRoomsAdmin(filters, page);

        return new OkResponse<>(bookings).response();
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
        return new OkResponse<>(bookingService.countBookingByState()).response();
    }

    @GetMapping("bookings/countByMonth")
    public ResponseEntity<StandardJSONResponse<CountBookingByMonthInYear>> countBookingByMonth(@RequestParam("year") Integer year)  {
        return new OkResponse<>(bookingService.countBookingByMonth(year)).response();
    }

    @GetMapping("bookings/getRevenueByYear")
    public ResponseEntity<StandardJSONResponse<RevenueByYearAndStatus>> getRevenueByYear(@RequestParam("year") String year)  {
        return new OkResponse<>(bookingService.getRevenueByYear(year)).response();
    }

    @GetMapping("bookings/getCurrentMonthSale")
    public ResponseEntity<StandardJSONResponse<Long>> getCurrentMonthSale()  {
        return new OkResponse<>(bookingService.getCurrentMonthSale()).response();
    }
}
